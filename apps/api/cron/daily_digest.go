package cron

import (
	"api/email"
	"log"
	"net/mail"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

func SendDailyDigest(app core.App) {
	now := time.Now()
	twentyFourHoursAgo := now.Add(-24 * time.Hour)

	// Get all listings approved in last 24 hours
	listings, err := app.FindRecordsByFilter("listings",
		"status = 'open' && open_since >= '"+twentyFourHoursAgo.Format(time.RFC3339)+"'",
		"-open_since", -1, 0, dbx.Params{})
	if err != nil {
		app.Logger().Error("Error fetching approved listings for daily digest", err)
		return
	}
	if len(listings) == 0 {
		log.Println("No listings approved in the last 24 hours, skipping daily digest")
		return
	}

	// Build summaries from all listings
	var allSummaries []email.ListingSummary
	for _, l := range listings {
		images := l.GetStringSlice("images")
		image := ""
		if len(images) > 0 {
			image = images[0]
		}
		allSummaries = append(allSummaries, email.ListingSummary{
			Id:          l.Id,
			UserId:      l.GetString("user"),
			Image:       image,
			Title:       l.GetString("title"),
			Description: l.GetString("description"),
		})
	}

	// Get all users with digest notifications
	users, err := app.FindRecordsByFilter("users",
		"verified = true && roles ~ 'user' && notifications:each ?= 'new-listing-digest'",
		"", -1, 0, dbx.Params{})
	if err != nil {
		app.Logger().Error("Error fetching users for daily digest", err)
		return
	}
	if len(users) == 0 {
		log.Println("No users with new-listing-digest notification, skipping daily digest")
		return
	}

	log.Printf("Sending daily digest to %d users with %d new listings\n", len(users), len(listings))

	// Send digest to each user
	for _, user := range users {
		// Filter out user's own listings
		var userSummaries []email.ListingSummary
		for _, s := range allSummaries {
			if s.UserId != user.Id {
				userSummaries = append(userSummaries, s)
			}
		}

		if len(userSummaries) == 0 {
			continue
		}

		// Template selection: use single listing template if only 1 listing
		if len(userSummaries) == 1 {
			l := findListingById(listings, userSummaries[0].Id)
			if l == nil {
				continue
			}
			data := email.NewListingData{
				DefaultFields:       email.GetDefaultFields(app),
				Firstname:           user.GetString("firstname"),
				ListingId:           userSummaries[0].Id,
				ListingTitle:        userSummaries[0].Title,
				ListingMaterial:     l.GetString("material"),
				ListingMeasurements: l.GetString("measurements"),
				ListingCondition:    l.GetString("condition"),
				ListingDescription:  l.GetString("description"),
				ListingPickupInfo:   l.GetString("pickup_description"),
			}
			err := email.QueueEmail(app, mail.Address{Address: user.Email()}, data, nil)
			if err != nil {
				app.Logger().Error("Error queueing email,", err)
			}
		} else {
			// Multiple listings: use digest template
			data := email.DailyDigestData{
				DefaultFields: email.GetDefaultFields(app),
				Firstname:     user.GetString("firstname"),
				Listings:      userSummaries,
			}
			err := email.QueueEmail(app, mail.Address{Address: user.Email()}, data, nil)
			if err != nil {
				app.Logger().Error("Error queueing email,", err)
			}
		}
	}
}

func findListingById(listings []*core.Record, id string) *core.Record {
	for _, l := range listings {
		if l.Id == id {
			return l
		}
	}
	return nil
}
