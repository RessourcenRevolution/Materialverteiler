package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Get all users
		users, err := app.FindAllRecords("users")
		if err != nil {
			return err
		}

		// Add new-listing notification to all users
		for _, user := range users {
			user.Set("notifications+", "new-listing")
			err = app.Save(user)
			if err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		return nil
	})
}
