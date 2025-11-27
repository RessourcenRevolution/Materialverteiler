package main

import (
	"log"
	"net/http"
	"slices"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "api/migrations"
)

func main() {
	app := pocketbase.New()

	// loosely check if it was executed using "go run"
	isGoRun := true // strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	// fires only for "users" and "articles" records
	app.OnRecordAfterUpdateSuccess("users").BindFunc(func(e *core.RecordEvent) error {
		original := e.Record.Original()

		// User's email got verified
		if !original.GetBool("verified") && e.Record.GetBool("verified") {
			log.Printf("E-mail of user %s has been verified\n", e.Record.GetString("email"))
			return sendVerifiedEmail(e)
		}

		// User's account got approved
		if !slices.Contains(original.GetStringSlice("roles"), "user") && slices.Contains(e.Record.GetStringSlice("roles"), "user") {
			log.Printf("User %s has been approved\n", e.Record.GetString("email"))
			return sendApprovedEmail(e)
		}

		return e.Next()
	})
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// register "POST /api/myapp/settings" route (allowed only for authenticated users)
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
			data := struct {
				Name        string `json:"name"`
				Email       string `json:"email"`
				Phonenumber string `json:"phonenumber"`
				Message     string `json:"message"`
			}{}
			if err := e.BindBody(&data); err != nil {
				return e.BadRequestError("Failed to read request data", err)
			}

			log.Printf("Contact form submitted for listing %s by %s\n", data.Name, data.Email)

			sendListingContactEmail(e, listing, listing.ExpandedOne("user"), data.Name, data.Email, data.Phonenumber, data.Message)
			sendListingContactConfirmationEmail(e, listing, e.Auth, data.Name, data.Email, data.Phonenumber, data.Message)
			return e.JSON(http.StatusOK, map[string]bool{"success": true})
		}).Bind(apis.RequireAuth())

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
