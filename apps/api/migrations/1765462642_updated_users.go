package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"hidden": false,
			"id": "select1610658003",
			"maxSelect": 2,
			"name": "notifications",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"new-listing",
				"newsletter"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"hidden": false,
			"id": "select1610658003",
			"maxSelect": 1,
			"name": "notifications",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"new-listing",
				"newsletter"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
