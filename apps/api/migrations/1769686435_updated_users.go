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
				"body": "<a href=\"{{.AppURL }}\" target=\"_blank\"><img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt/></a>\n\n<p>Hallo {RECORD:firstname},</p>\n<p>vielen Dank, dass du dich bei {APP_NAME} registriert hast.</p>\n<p>Klicke auf den Button unten, um deine E-Mail-Adresse zu bestätigen.</p>\n<p>\n  <a href=\"{APP_URL}/app/profile/confirm-email?token={TOKEN}\" target=\"_blank\" rel=\"noopener\" style=\"display: inline-block;font-weight: bold;padding: 10px 12px 9px 12px;border: solid #303633 3px;border-radius: 2px;text-decoration: none;\">\n    Bestätigen\n  </a>\n</p>\n<p>\n  Liebe Grüße,<br/>\n  dein Team der {APP_NAME}\n</p>"
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
				"body": "<a href=\"{{.AppURL }}\" target=\"_blank\"><img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt/></a>\n\n<p>Hallo,</p>\n<p>Vielen Dank, dass du dich bei {APP_NAME} registriert hast.</p>\n<p>Klicke auf den Button unten, um deine E-Mail-Adresse zu bestätigen.</p>\n<p>\n  <a href=\"{APP_URL}/app/profile/confirm-email?token={TOKEN}\" target=\"_blank\" rel=\"noopener\" style=\"display: inline-block;font-weight: bold;padding: 10px 12px 9px 12px;border: solid #303633 3px;border-radius: 2px;text-decoration: none;\">\n    Bestätigen\n  </a>\n</p>\n<p>\n  Liebe Grüße,<br/>\n  {APP_NAME}\n</p>"
			}
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
