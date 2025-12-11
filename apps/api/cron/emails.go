package cron

import (
	"api/email"
	"log"
	"net/mail"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

func ProcessEmailQueue(app core.App) {
	// Fetch next two emails to be processed
	records, err := app.FindRecordsByFilter("emailQueue", "", "created", 2, 0, dbx.Params{})
	if err != nil {
		app.Logger().Error("Error fetching email queue", err)
		return
	}

	// Nothing to do
	if len(records) == 0 {
		return
	}

	// Send emails
	for _, record := range records {
		log.Printf("Process email queue: '%s' - %s", record.GetString("subject"), record.GetDateTime("created").String())
		email.SendRenderedEmail(app, mail.Address{Address: record.GetString("to")}, record.GetString("subject"), record.GetString("html"), mail.Address{
			Address: record.GetString("fromAddress"),
			Name:    record.GetString("fromName"),
		})
		// Delete from queue
		err = app.Delete(record)
		if err != nil {
			app.Logger().Error("Error removing email from email queue", err)
		}
	}
}
