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
				"body": "<a href=\"{{.AppURL }}\" target=\"_blank\"><img src=\"{APP_URL}/logo.png\" alt=\"Logo\" style=\"max-width: 200px; margin-bottom: 16px\" alt/></a>\n\n<p>Hallo {RECORD:firstname},</p>\n<p>Klicke auf den untenstehenden Button, um dein Passwort zurückzusetzen.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/app/password-reset-confirm?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Passwort zurücksetzen</a>\n</p>\n<p><i>Falls du keine Passwortrücksetzung angefordert hast, kannst du diese E-Mail ignorieren.</i></p>\n<p>\n  Liebe Grüße,<br/>\n  dein Team der {APP_NAME}\n</p>"
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
				"body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
			}
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
