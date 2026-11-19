package main

import (
	_ "embed"
	"encoding/json"
	"log"
	"os"
	"strconv"

	"github.com/pocketbase/pocketbase/core"
)

// Test fixtures, also read by the Playwright tests
//
//go:embed seed/fixtures.json
var fixturesJSON []byte

type seedUser struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}

type seedFixtures struct {
	ExistingUser seedUser `json:"existingUser"`
}

// registerTestSeed seeds the test fixtures when SEED_TEST_DATA=true. It only
// runs against an empty database, so it can never touch existing data.
func registerTestSeed(app core.App) {
	if os.Getenv("SEED_TEST_DATA") != "true" {
		return
	}

	// Migrations have run by the time the server starts
	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// Don't open the superuser installer in the browser
		se.InstallerFunc = nil

		if err := seedTestData(se.App); err != nil {
			return err
		}
		return se.Next()
	})
}

func seedTestData(app core.App) error {
	count, err := app.CountRecords("users")
	if err != nil {
		return err
	}
	if count > 0 {
		log.Println("Skipping test data seed: database is not empty")
		return nil
	}

	var fixtures seedFixtures
	if err := json.Unmarshal(fixturesJSON, &fixtures); err != nil {
		return err
	}

	// Settings: app URL for links in emails, SMTP to the test mailpit
	smtpPort, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		return err
	}
	settings := app.Settings()
	settings.Meta.AppName = "Materialverteiler"
	settings.Meta.AppURL = os.Getenv("APP_URL")
	settings.Meta.SenderName = "Materialverteiler"
	settings.Meta.SenderAddress = "noreply@test.local"
	settings.SMTP.Enabled = true
	settings.SMTP.Host = os.Getenv("SMTP_HOST")
	settings.SMTP.Port = smtpPort
	if err := app.Save(settings); err != nil {
		return err
	}

	// Users
	users, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return err
	}
	user := core.NewRecord(users)
	user.SetEmail(fixtures.ExistingUser.Email)
	user.SetPassword(fixtures.ExistingUser.Password)
	user.SetVerified(true)
	user.Set("firstname", fixtures.ExistingUser.Firstname)
	user.Set("lastname", fixtures.ExistingUser.Lastname)
	user.Set("terms", true)
	if err := app.Save(user); err != nil {
		return err
	}

	log.Println("Seeded test data")
	return nil
}
