package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3660939671")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.id != \"\" && @request.auth.verified = true",
			"deleteRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.id = user",
			"updateRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.id = user"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"cascadeDelete": false,
			"collectionId": "_pb_users_auth_",
			"hidden": false,
			"id": "relation2375276105",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "user",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3660939671")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": null,
			"deleteRule": null,
			"updateRule": null
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation2375276105")

		return app.Save(collection)
	})
}
