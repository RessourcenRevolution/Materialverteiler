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
			"resetPasswordTemplate": {
				"body": "<a href=\"{APP_URL}\" target=\"_blank\"><img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt=\"Logo\" /></a>\n\n<p>Hallo {RECORD:firstname},</p>\n<p>klicke auf den untenstehenden Button, um dein Passwort zurückzusetzen.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/app/password-reset-confirm?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Passwort zurücksetzen</a>\n</p>\n<p><i>Falls du keine Passwortrücksetzung angefordert hast, kannst du diese E-Mail ignorieren.</i></p>\n<p>\n  Liebe Grüße,<br/>\n  dein Team der {APP_NAME}\n</p>",
				"subject": "Passwort zurücksetzen"
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
			"resetPasswordTemplate": {
				"body": "<a href=\"{APP_URL}\" target=\"_blank\"><img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt=\"Logo\" /></a>\n\n<p>Hallo {RECORD:firstname},</p>\n<p>Klicke auf den untenstehenden Button, um dein Passwort zurückzusetzen.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/app/password-reset-confirm?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Passwort zurücksetzen</a>\n</p>\n<p><i>Falls du keine Passwortrücksetzung angefordert hast, kannst du diese E-Mail ignorieren.</i></p>\n<p>\n  Liebe Grüße,<br/>\n  dein Team der {APP_NAME}\n</p>",
				"subject": "Reset your {APP_NAME} password"
			}
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
