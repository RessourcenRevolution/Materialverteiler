package main

import (
	_ "embed"
	"net/mail"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"github.com/pocketbase/pocketbase/tools/template"
)

//go:embed "views/emails/base.html"
var baseTemplate string

//go:embed "views/emails/email-verified.html"
var emailVerifiedTemplate string

//go:embed "views/emails/user-approved.html"
var userApprovedTemplate string

func sendVerifiedEmail(e *core.RecordEvent) error {
	data := map[string]any{"firstname": e.Record.GetString("firstname")}

	html, err := template.NewRegistry().LoadString(baseTemplate + emailVerifiedTemplate).Render(data)

	if err != nil {
		e.App.Logger().Error("Can't render email-verified email template: %w", err)
		return e.Next()
	}

	message := &mailer.Message{
		From: mail.Address{
			Address: e.App.Settings().Meta.SenderAddress,
			Name:    e.App.Settings().Meta.SenderName,
		},
		To:      []mail.Address{{Address: e.Record.Email()}},
		Subject: "Wilkommen im Materialverteiler",
		HTML:    html,
	}

	return e.App.NewMailClient().Send(message)
}

func sendApprovedEmail(e *core.RecordEvent) error {
	data := map[string]any{"firstname": e.Record.GetString("firstname")}

	html, err := template.NewRegistry().LoadString(baseTemplate + userApprovedTemplate).Render(data)

	if err != nil {
		e.App.Logger().Error("Can't render user-approved email template: %w", err)
		return e.Next()
	}

	message := &mailer.Message{
		From: mail.Address{
			Address: e.App.Settings().Meta.SenderAddress,
			Name:    e.App.Settings().Meta.SenderName,
		},
		To:      []mail.Address{{Address: e.Record.Email()}},
		Subject: "Dein Account is approved",
		HTML:    html,
	}

	return e.App.NewMailClient().Send(message)
}
