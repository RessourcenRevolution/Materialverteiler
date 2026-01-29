package hooks

import (
	"api/email"
	"log"
	"net/mail"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func ListingValidate(e *core.RecordEvent) error {
	original := e.Record.Original()
	listing := e.Record
	log.Print(original.Id)

	// Continue when new record
	if original.Id == "" {
		return e.Next()
	}

	// Prevent listing status from being reset to 'new'
	if original.GetString("status") != "new" && listing.Get("status") == "new" {
		return apis.NewApiError(500, "Listing status can't be reset to 'new'", map[string]validation.Error{
			"title": validation.NewError("invalid_listing_status", "Listing status can't be reset to 'new'"),
		})
	}

	return e.Next()
}

func AfterListingCreate(e *core.RecordEvent) error {
	listing := e.Record

	// Expand user & team
	errs := e.App.ExpandRecord(listing, []string{"user", "team"}, nil)
	if len(errs) > 0 {
		e.App.Logger().Error("Error expanding listing user or  team")
		return e.Next()
	}
	user := listing.ExpandedOne("user")
	team := listing.ExpandedOne("team")

	// Notify managers about new listing
	email.QueueManagersEmail(e.App, func(manager *core.Record) email.NotifyNewListingData {
		return email.NotifyNewListingData{
			DefaultFields:    email.GetDefaultFields(e.App),
			ManagerFirstname: manager.GetString("firstname"),
			UserFirstname:    user.GetString("firstname"),
			UserLastname:     user.GetString("lastname"),
			ListingId:        listing.Id,
			ListingTitle:     listing.GetString("title"),
			TeamName:         team.GetString("name"),
		}
	})

	return e.Next()
}

func AfterListingUpdate(e *core.RecordEvent) error {
	original := e.Record.Original()
	listing := e.Record

	// Expand user
	errs := e.App.ExpandRecord(listing, []string{"user"}, nil)
	if len(errs) > 0 {
		e.App.Logger().Error("Error expanding listing user")
		return e.Next()
	}

	user := listing.ExpandedOne("user")

	// Listing got approved
	if original.GetString("status") == "new" && listing.GetString("status") == "open" {
		log.Printf("Listing (%s) got approved\n", listing.GetString("title"))

		// Send email to listing owner
		data := email.ListingApprovedData{
			DefaultFields: email.GetDefaultFields(e.App),
			Firstname:     user.GetString("firstname"),
			ListingId:     listing.Id,
			ListingTitle:  listing.GetString("title"),
		}
		email.SendEmail(e.App, mail.Address{Address: user.Email()}, data, nil)

		// Notify other users of new listing
		users, err := e.App.FindRecordsByFilter("users", "verified = true && roles ~ 'user' && notifications ~ 'new-listing' && id != '"+user.Id+"'", "", 100, 0, dbx.Params{})
		if err != nil {
			e.App.Logger().Error("Error fetching users")
		}
		for _, other := range users {
			data := email.NewListingData{
				DefaultFields:       email.GetDefaultFields(e.App),
				Firstname:           other.GetString("firstname"),
				ListingId:           listing.Id,
				ListingTitle:        listing.GetString("title"),
				ListingMaterial:     listing.GetString("material"),
				ListingMeasurements: listing.GetString("measurements"),
				ListingCondition:    listing.GetString("condition"),
				ListingDescription:  listing.GetString("description"),
				ListingPickupInfo:   listing.GetString("pickup_description"),
			}
			email.QueueEmail(e.App, mail.Address{Address: other.Email()}, data, nil)
		}
	}

	return e.Next()
}
