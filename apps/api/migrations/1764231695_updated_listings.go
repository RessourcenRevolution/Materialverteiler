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
			"createRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\"",
			"deleteRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && @request.auth.id = user",
			"listRule": "@request.auth.id != \"\"",
			"updateRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && @request.auth.id = user",
			"viewRule": "@request.auth.id != \"\""
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_1568971955",
			"hidden": false,
			"id": "relation3303056927",
			"maxSelect": 1,
			"minSelect": 0,
			"name": "team",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "date2502384312",
			"max": "",
			"min": "",
			"name": "start_date",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "date2220669758",
			"max": "",
			"min": "",
			"name": "end_date",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text2092856725",
			"max": 0,
			"min": 0,
			"name": "material",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(9, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text1905397537",
			"max": 0,
			"min": 0,
			"name": "measurements",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(10, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text3184953411",
			"max": 0,
			"min": 0,
			"name": "condition",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text223244161",
			"max": 0,
			"min": 0,
			"name": "address",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text1708812519",
			"max": 0,
			"min": 0,
			"name": "postalcode",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(13, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text760939060",
			"max": 0,
			"min": 0,
			"name": "city",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(14, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text2899822501",
			"max": 0,
			"min": 0,
			"name": "pickup_description",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text724990059",
			"max": 0,
			"min": 0,
			"name": "title",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
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
			"createRule": "@request.auth.id != \"\" && @request.auth.verified = true",
			"deleteRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.id = user",
			"listRule": "",
			"updateRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.id = user",
			"viewRule": ""
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation3303056927")

		// remove field
		collection.Fields.RemoveById("date2502384312")

		// remove field
		collection.Fields.RemoveById("date2220669758")

		// remove field
		collection.Fields.RemoveById("text2092856725")

		// remove field
		collection.Fields.RemoveById("text1905397537")

		// remove field
		collection.Fields.RemoveById("text3184953411")

		// remove field
		collection.Fields.RemoveById("text223244161")

		// remove field
		collection.Fields.RemoveById("text1708812519")

		// remove field
		collection.Fields.RemoveById("text760939060")

		// remove field
		collection.Fields.RemoveById("text2899822501")

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text724990059",
			"max": 0,
			"min": 0,
			"name": "title",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
