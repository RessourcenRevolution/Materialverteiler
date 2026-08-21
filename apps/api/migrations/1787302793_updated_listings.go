package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3660939671")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(16, []byte(`{
			"help": "This field gets set automatically when the listing status changes from 'new' to 'open'.",
			"hidden": false,
			"id": "date1149419028",
			"max": "",
			"min": "",
			"name": "open_since",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3660939671")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(16, []byte(`{
			"help": "",
			"hidden": false,
			"id": "date1149419028",
			"max": "",
			"min": "",
			"name": "open_since",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
