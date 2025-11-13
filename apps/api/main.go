package main

import (
	"log"
	"slices"

	"github.com/pocketbase/pocketbase"
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

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
