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
			"listRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && (status = 'open' || status = 'reserved' || user = @request.auth.id || @request.auth.roles ~ \"manager\") && deleted = \"\"",
			"updateRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && @request.auth.id = user && deleted = \"\"",
			"viewRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && (status = 'open' || status = 'reserved' || user = @request.auth.id || @request.auth.roles ~ \"manager\") && deleted = \"\""
		}`), &collection); err != nil {
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
			"listRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && (status = 'open' || status = 'reserved' || user = @request.auth.id || @request.auth.roles ~ \"manager\") && deleted:isset = false",
			"updateRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && @request.auth.id = user && deleted:isset = false",
			"viewRule": "@request.auth.id != \"\" && @request.auth.verified = true && @request.auth.roles ~ \"user\" && (status = 'open' || status = 'reserved' || user = @request.auth.id || @request.auth.roles ~ \"manager\") && deleted:isset = false"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
