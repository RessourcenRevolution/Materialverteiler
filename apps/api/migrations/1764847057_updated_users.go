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
			"verificationTemplate": {
				"body": "<img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt/>\n\n<p>Hallo,</p>\n<p>Vielen Dank, dass du dich bei {APP_NAME} registriert hast.</p>\n<p>Klicke auf den Button unten, um deine E-Mail-Adresse zu bestätigen.</p>\n<p>\n  <a href=\"{APP_URL}/profile/confirm-email?token={TOKEN}\" target=\"_blank\" rel=\"noopener\" style=\"display: inline-block;font-weight: bold;padding: 10px 12px 9px 12px;border: solid #303633 3px;border-radius: 2px;text-decoration: none;\">\n    Bestätigen\n  </a>\n</p>\n<p>\n  Liebe Grüße,<br/>\n  {APP_NAME}\n</p>",
				"subject": "Bestätig deine {APP_NAME} E-Mail"
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
			"verificationTemplate": {
				"body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/profile/confirm-email?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
				"subject": "Verify your {APP_NAME} email"
			}
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
