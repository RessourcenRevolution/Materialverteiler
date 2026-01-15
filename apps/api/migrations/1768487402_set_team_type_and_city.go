package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Get all teams
		teams, err := app.FindAllRecords("teams")
		if err != nil {
			return err
		}

		// Set newly required team 'type' and 'city'
		for _, team := range teams {
			change := false
			if team.Get("type") == nil {
				change = true
				team.Set("type", "non-profit")
			}
			if team.Get("city") == nil {
				change = true
				team.Set("city", "Köln")
			}
			if change {
				err = app.Save(team)
				if err != nil {
					return err
				}
			}
		}

		return nil
	}, func(app core.App) error {
		return nil
	})
}
