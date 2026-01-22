package main

import (
	"api/cron"
	"api/email"
	"api/hooks"
	"log"
	"net/http"
	"net/mail"
	"os"
	"slices"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "api/migrations"
)

type RecentListingData struct {
	Id     string   `json:"id"`
	Title  string   `json:"title"`
	Images []string `json:"images"`
}

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate: os.Getenv("DEV_MODE") == "true",
	})

	// Every minute process email queue
	app.Cron().MustAdd("process email queue", "*/1 * * * *", func() {
		cron.ProcessEmailQueue(app)
	})

	app.OnRecordCreate("users").BindFunc(func(e *core.RecordEvent) error {
		// Set default notifications value
		e.Record.Set("notifications+", "new-listing")
		return e.Next()
	})

	// On user update
	app.OnRecordAfterUpdateSuccess("users").BindFunc(func(e *core.RecordEvent) error {
		original := e.Record.Original()

		// User's email got verified
		if !original.GetBool("verified") && e.Record.GetBool("verified") {
			log.Printf("E-mail of user %s has been verified\n", e.Record.GetString("email"))
			data := email.EmailVerifiedData{
				DefaultFields: email.GetDefaultFields(e.App),
				Firstname:     e.Record.GetString("firstname"),
			}
			email.SendEmail(e.App, mail.Address{Address: e.Record.Email()}, data, nil)
		}

		// User's account got approved
		if !slices.Contains(original.GetStringSlice("roles"), "user") && slices.Contains(e.Record.GetStringSlice("roles"), "user") {
			log.Printf("User %s has been approved\n", e.Record.GetString("email"))
			data := email.UserApprovedData{
				DefaultFields: email.GetDefaultFields(e.App),
				Firstname:     e.Record.GetString("firstname"),
			}
			email.SendEmail(e.App, mail.Address{Address: e.Record.Email()}, data, nil)
		}

		return e.Next()
	})

	// On listing validate
	app.OnRecordValidate("listings").BindFunc(hooks.ListingValidate)

	// On listing create
	app.OnRecordAfterCreateSuccess("listings").BindFunc(hooks.AfterListingCreate)

	// On listing update
	app.OnRecordAfterUpdateSuccess("listings").BindFunc(hooks.AfterListingUpdate)

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

			email.QueueManagersEmail(e.App, func(manager *core.Record) email.NotifyUserSignupData {
				return email.NotifyUserSignupData{
					DefaultFields:    email.GetDefaultFields(e.App),
					ManagerFirstname: manager.GetString("firstname"),
					UserId:           user.Id,
					UserFirstname:    user.GetString("firstname"),
					UserLastname:     user.GetString("lastname"),
					UserEmail:        user.Email(),
					TeamName:         team.GetString("name"),
					TeamType:         team.GetString("type"),
					TeamCity:         team.GetString("city"),
					Message:          email.ConvertLinebreaksToHtml(body.Message),
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
			data := email.ListingContactData{
				DefaultFields: email.GetDefaultFields(e.App),
				ListingId:     listing.Id,
				Firstname:     user.GetString("firstname"),
				OtherName:     body.Name,
				Email:         body.Email,
				Phonenumber:   body.Phonenumber,
				Message:       email.ConvertLinebreaksToHtml(body.Message),
			}
			email.SendEmail(e.App, mail.Address{Address: user.Email()}, data, nil)

			// Listing contact confirmation email
			confirmation := email.ListingContactConfirmationData{
				DefaultFields: email.GetDefaultFields(e.App),
				ListingId:     listing.Id,
				ListingTitle:  listing.GetString("title"),
				Firstname:     user.GetString("firstname"),
				Name:          body.Name,
				Email:         body.Email,
				Phonenumber:   body.Phonenumber,
				Message:       email.ConvertLinebreaksToHtml(body.Message),
			}
			email.SendEmail(e.App, mail.Address{Address: user.Email()}, confirmation, nil)

			return e.JSON(http.StatusOK, map[string]bool{"success": true})
		}).Bind(apis.RequireAuth())

		// Get recent listings
		se.Router.GET("/api/listings/recent", func(e *core.RequestEvent) error {
			// Get listing
			listings, err := app.FindRecordsByFilter("listings", "images:length > 0 && status = 'success'", "created", 4, 0)
			if err != nil {
				return e.Error(http.StatusInternalServerError, "error getting listing", nil)
			}
			// map over listings, and only pick some fields
			listingsData := make([]RecentListingData, len(listings))
			for i, listing := range listings {
				listingsData[i] = RecentListingData{
					Id:     listing.GetString("id"),
					Title:  listing.GetString("title"),
					Images: listing.GetStringSlice("images"),
				}
			}
			return e.JSON(http.StatusOK, listingsData)
		})

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
