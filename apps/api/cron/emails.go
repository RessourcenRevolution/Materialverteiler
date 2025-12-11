package cron

import (
	"api/email"
	"log"
	"net/mail"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

func ProcessEmailQueue(app core.App) {
	records, err := app.FindRecordsByFilter("emailQueue", "", "created", 1, 0, dbx.Params{})
	if err != nil {
		app.Logger().Error("Error fetching email queue", err)
		return
	}
	// Nothing to do
	if len(records) == 0 {
		return
	}
	// Send emailEntry
	emailEntry := records[0]
	log.Printf("Process email queue: '%s' - %s", emailEntry.GetString("subject"), emailEntry.GetDateTime("created").String())
	email.SendRenderedEmail(app, mail.Address{Address: emailEntry.GetString("to")}, emailEntry.GetString("subject"), emailEntry.GetString("html"), mail.Address{
		Address: emailEntry.GetString("fromAddress"),
		Name:    emailEntry.GetString("fromName"),
	})
	// Delete from queue
	err = app.Delete(emailEntry)
	if err != nil {
		app.Logger().Error("Error removing email from email queue", err)
	}
}
