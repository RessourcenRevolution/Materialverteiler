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
					"body": "<img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt/>\n\n<p>Hallo,</p>\n<p>wir haben einen Login in dein {APP_NAME}-Konto von einem neuen Standort aus festgestellt.</p>\n<p>Falls du das warst, kannst du diese E-Mail ignorieren.</p>\n<p><strong>Falls du das nicht warst, solltest du umgehend dein {APP_NAME}-Passwort ändern, um den Zugriff von allen anderen Standorten zu widerrufen.</strong></p>\n<p>\n  Liebe Grüße,<br/>\n  {APP_NAME}\n</p>",
					"subject": "Neuer Login bei {APP_NAME}"
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
					"body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
					"subject": "Login from a new location"
				}
			}
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
