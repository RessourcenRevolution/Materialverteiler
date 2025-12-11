package main

import (
	"log"
	"net/http"
	"net/mail"
	"os"
	"slices"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "api/migrations"
)

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate: os.Getenv("DEV_MODE") == "true",
	})

	// Every minute process email queue
	app.Cron().MustAdd("process email queue", "*/1 * * * *", func() {
		records, err := app.FindRecordsByFilter("emailQueue", "", "created", 1, 0, dbx.Params{})
		if err != nil {
			app.Logger().Error("Error fetching email queue", err)
			return
		}
		// Nothing to do
		if len(records) == 0 {
			return
		}
		// Send email
		email := records[0]
		log.Printf("Process email queue: '%s' - %s", email.GetString("subject"), email.GetDateTime("created").String())
		sendRenderedEmail(app, mail.Address{Address: email.GetString("to")}, email.GetString("subject"), email.GetString("html"), mail.Address{
			Address: email.GetString("fromAddress"),
			Name:    email.GetString("fromName"),
		})
		// Delete from queue
		err = app.Delete(email)
		if err != nil {
			app.Logger().Error("Error removing email from email queue", err)
		}
	})

	// On user update
	app.OnRecordAfterUpdateSuccess("users").BindFunc(func(e *core.RecordEvent) error {
		original := e.Record.Original()

		// User's email got verified
		if !original.GetBool("verified") && e.Record.GetBool("verified") {
			log.Printf("E-mail of user %s has been verified\n", e.Record.GetString("email"))
			data := EmailVerifiedData{
				DefaultFields: getDefaultFields(e.App),
				Firstname:     e.Record.GetString("firstname"),
			}
			sendEmail(e.App, mail.Address{Address: e.Record.Email()}, data, nil)
		}

		// User's account got approved
		if !slices.Contains(original.GetStringSlice("roles"), "user") && slices.Contains(e.Record.GetStringSlice("roles"), "user") {
			log.Printf("User %s has been approved\n", e.Record.GetString("email"))
			data := UserApprovedData{
				DefaultFields: getDefaultFields(e.App),
				Firstname:     e.Record.GetString("firstname"),
			}
			sendEmail(e.App, mail.Address{Address: e.Record.Email()}, data, nil)
		}

		return e.Next()
	})

	// On listing create
	app.OnRecordAfterCreateSuccess("listings").BindFunc(func(e *core.RecordEvent) error {
		listing := e.Record

		// Expand user & team
		errs := app.ExpandRecord(listing, []string{"user", "team"}, nil)
		if len(errs) > 0 {
			e.App.Logger().Error("Error expanding listing user or  team")
			return e.Next()
		}
		user := listing.ExpandedOne("user")
		team := listing.ExpandedOne("team")

		queueManagersEmail(e.App, func(manager *core.Record) NotifyNewListingData {
			return NotifyNewListingData{
				DefaultFields:    getDefaultFields(e.App),
				ManagerFirstname: manager.GetString("firstname"),
				UserFirstname:    user.GetString("firstname"),
				UserLastname:     user.GetString("lastname"),
				ListingId:        listing.Id,
				ListingTitle:     listing.GetString("title"),
				TeamName:         team.GetString("name"),
			}
		})
		return e.Next()
	})

	// On listing update
	app.OnRecordAfterUpdateSuccess("listings").BindFunc(func(e *core.RecordEvent) error {
		original := e.Record.Original()

		// Expand user
		errs := app.ExpandRecord(e.Record, []string{"user"}, nil)
		if len(errs) > 0 {
			e.App.Logger().Error("Error expanding listing user")
			return e.Next()
		}

		user := e.Record.ExpandedOne("user")

		// Listing got approved
		if original.GetString("status") == "new" && e.Record.GetString("status") == "open" {
			log.Printf("Listing (%s) got approved\n", e.Record.GetString("title"))
			data := ListingApprovedData{
				DefaultFields: getDefaultFields(e.App),
				Firstname:     user.GetString("firstname"),
				ListingId:     e.Record.Id,
				ListingTitle:  e.Record.GetString("title"),
			}
			sendEmail(e.App, mail.Address{Address: user.Email()}, data, nil)
		}

		return e.Next()
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {

		// Notify managers of user signup
		se.Router.POST("/api/users/{id}/notify-managers", func(e *core.RequestEvent) error {
			// User id
			id := e.Request.PathValue("id")
			authId := e.Auth.Id
			if id != authId {
				return e.Error(http.StatusForbidden, "wrong user", nil)
			}

			// Get user
			user, err := app.FindRecordById("users", id)
			if err != nil {
				return e.Error(http.StatusInternalServerError, "error getting user", nil)
			}
			if user == nil {
				return e.Error(http.StatusNotFound, "user not found", nil)
			}

			// Expand user team
			errs := app.ExpandRecord(user, []string{"team"}, nil)
			if len(errs) > 0 {
				return e.Error(http.StatusNotFound, "failed to expand", nil)
			}
			team := user.ExpandedOne("team")

			// Read post data
			body := struct {
				Message string `json:"message"`
			}{}
			if err := e.BindBody(&body); err != nil {
				return e.BadRequestError("Failed to read request data", err)
			}

			queueManagersEmail(e.App, func(manager *core.Record) NotifyUserSignupData {
				return NotifyUserSignupData{
					DefaultFields:    getDefaultFields(e.App),
					ManagerFirstname: manager.GetString("firstname"),
					UserId:           user.Id,
					UserFirstname:    user.GetString("firstname"),
					UserLastname:     user.GetString("lastname"),
					UserEmail:        user.Email(),
					TeamName:         team.GetString("name"),
					Message:          convertLinebreaksToHtml(body.Message),
				}
			})

			return e.JSON(http.StatusOK, map[string]bool{"success": true})
		}).Bind(apis.RequireAuth())

		// Contact message from demander to supplier
		se.Router.POST("/api/listings/{id}/contact", func(e *core.RequestEvent) error {
			id := e.Request.PathValue("id")

			// Get listing
			listing, err := app.FindRecordById("listings", id)
			if err != nil {
				return e.Error(http.StatusInternalServerError, "error getting listing", nil)
			}
			if listing == nil {
				return e.Error(http.StatusNotFound, "listing not found", nil)
			}

			// Expand listing user
			errs := app.ExpandRecord(listing, []string{"user"}, nil)
			if len(errs) > 0 {
				return e.Error(http.StatusNotFound, "failed to expand", nil)
			}

			// Read post data
			body := struct {
				Name        string `json:"name"`
				Email       string `json:"email"`
				Phonenumber string `json:"phonenumber"`
				Message     string `json:"message"`
			}{}
			if err := e.BindBody(&body); err != nil {
				return e.BadRequestError("Failed to read request data", err)
			}

			log.Printf("Contact form submitted for listing %s by %s\n", body.Name, body.Email)

			user := listing.ExpandedOne("user")

			// Listing contact email
			data := ListingContactData{
				DefaultFields: getDefaultFields(e.App),
				ListingId:     listing.Id,
				Firstname:     user.GetString("firstname"),
				OtherName:     body.Name,
				Email:         body.Email,
				Phonenumber:   body.Phonenumber,
				Message:       convertLinebreaksToHtml(body.Message),
			}
			sendEmail(e.App, mail.Address{Address: user.Email()}, data, &EmailConfig{
				CustomFrom: &mail.Address{
					Address: body.Email,
					Name:    body.Name,
				},
			})

			// Listing contact confirmation email
			confirmation := ListingContactConfirmationData{
				DefaultFields: getDefaultFields(e.App),
				ListingId:     listing.Id,
				ListingTitle:  listing.GetString("title"),
				Firstname:     user.GetString("firstname"),
				Name:          body.Name,
				Email:         body.Email,
				Phonenumber:   body.Phonenumber,
				Message:       convertLinebreaksToHtml(body.Message),
			}
			sendEmail(e.App, mail.Address{Address: user.Email()}, confirmation, nil)

			return e.JSON(http.StatusOK, map[string]bool{"success": true})
		}).Bind(apis.RequireAuth())

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
