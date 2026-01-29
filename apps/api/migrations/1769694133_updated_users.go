package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"authAlert": {
				"emailTemplate": {
					"body": "<img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt/>\n\n<p>Hallo {RECORD:firstname},</p>\n<p>wir haben einen Login in dein {APP_NAME}-Konto von einem neuen Standort aus festgestellt.</p>\n<p>Falls du das warst, kannst du diese E-Mail ignorieren.</p>\n<p><strong>Falls du das nicht warst, solltest du umgehend dein {APP_NAME}-Passwort ändern, um den Zugriff von allen anderen Standorten zu widerrufen.</strong></p>\n<p>\n  Liebe Grüße,<br/>\n  {APP_NAME}\n</p>"
				}
			}
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"authAlert": {
				"emailTemplate": {
					"body": "<img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt/>\n\n<p>Hallo,</p>\n<p>wir haben einen Login in dein {APP_NAME}-Konto von einem neuen Standort aus festgestellt.</p>\n<p>Falls du das warst, kannst du diese E-Mail ignorieren.</p>\n<p><strong>Falls du das nicht warst, solltest du umgehend dein {APP_NAME}-Passwort ändern, um den Zugriff von allen anderen Standorten zu widerrufen.</strong></p>\n<p>\n  Liebe Grüße,<br/>\n  {APP_NAME}\n</p>"
				}
			}
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
