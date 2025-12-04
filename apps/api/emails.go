package main

import (
	_ "embed"
	"net/mail"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"github.com/pocketbase/pocketbase/tools/template"

	"github.com/Masterminds/sprig/v3"

	htmlTemplate "html/template"
)

//go:embed "views/emails/base.html"
var baseTemplate string

//go:embed "views/emails/email-verified.html"
var emailVerifiedTemplate string

//go:embed "views/emails/notify-user-signup.html"
var notifyUserSignupTemplate string

//go:embed "views/emails/user-approved.html"
var userApprovedTemplate string

//go:embed "views/emails/listing-contact.html"
var listingContactTemplate string

//go:embed "views/emails/listing-contact-confirmation.html"
var listingContactConfirmationTemplate string

func newEmailTemplateData(app core.App) map[string]any {
	return map[string]any{
		"appURL": app.Settings().Meta.AppURL,
	}
}

func newEmailTemplate() *template.Registry {
	return template.NewRegistry().AddFuncs(sprig.FuncMap())
}

func sendVerifiedEmail(e *core.RecordEvent) error {
	data := newEmailTemplateData(e.App)
	data["firstname"] = e.Record.GetString("firstname")

	html, err := newEmailTemplate().LoadString(baseTemplate + emailVerifiedTemplate).Render(data)

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

func sendNotifyUserSignupEmail(e *core.RequestEvent, manager *core.Record, user *core.Record, team *core.Record, message string) error {
	data := newEmailTemplateData(e.App)
	data["managerFirstname"] = manager.GetString("firstname")
	data["userId"] = user.Id
	data["userFirstname"] = user.GetString("firstname")
	data["userLastname"] = user.GetString("lastname")
	data["userEmail"] = user.Email()
	data["teamName"] = team.GetString("name")
	data["publicApiUrl"] = os.Getenv("PUBLIC_API_URL")
	data["message"] = htmlTemplate.HTML(strings.Replace(message, "\n", "<br>", -1))

	html, err := newEmailTemplate().LoadString(baseTemplate + notifyUserSignupTemplate).Render(data)

	if err != nil {
		e.App.Logger().Error("Can't render listing-contact email template: %w", err)
		return e.Next()
	}

	msg := &mailer.Message{
		From: mail.Address{
			Address: manager.Email(),
			Name:    manager.GetString("firstname"),
		},
		To:      []mail.Address{{Address: user.Email()}},
		Subject: "Neue Anfrage zum Beitritt zum Materialverteiler",
		HTML:    html,
	}

	return e.App.NewMailClient().Send(msg)
}

func sendApprovedEmail(e *core.RecordEvent) error {
	data := newEmailTemplateData(e.App)
	data["firstname"] = e.Record.GetString("firstname")

	html, err := newEmailTemplate().LoadString(baseTemplate + userApprovedTemplate).Render(data)

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
		Subject: "Willkommen in der Community",
		HTML:    html,
	}

	return e.App.NewMailClient().Send(message)
}

func sendListingContactEmail(e *core.RequestEvent, listing *core.Record, user *core.Record, name string, email string, phonenumber string, message string) error {
	data := newEmailTemplateData(e.App)
	data["listingId"] = listing.Id
	data["firstname"] = user.GetString("firstname")
	data["other_name"] = name
	data["email"] = email
	data["phonenumber"] = phonenumber
	data["message"] = htmlTemplate.HTML(strings.Replace(message, "\n", "<br>", -1))

	html, err := newEmailTemplate().LoadString(baseTemplate + listingContactTemplate).Render(data)

	if err != nil {
		e.App.Logger().Error("Can't render listing-contact email template: %w", err)
		return e.Next()
	}

	msg := &mailer.Message{
		From: mail.Address{
			Address: email,
			Name:    name,
		},
		To:      []mail.Address{{Address: user.Email()}},
		Subject: "Neue Anfrage zu Ihrem Materialangebot",
		HTML:    html,
	}

	return e.App.NewMailClient().Send(msg)
}

func sendListingContactConfirmationEmail(e *core.RequestEvent, listing *core.Record, user *core.Record, name string, email string, phonenumber string, message string) error {
	data := newEmailTemplateData(e.App)
	data["listingId"] = listing.Id
	data["listingTitle"] = listing.GetString("title")
	data["firstname"] = user.GetString("firstname")
	data["name"] = name
	data["email"] = email
	data["phonenumber"] = phonenumber
	data["message"] = htmlTemplate.HTML(strings.Replace(message, "\n", "<br>", -1))

	html, err := newEmailTemplate().LoadString(baseTemplate + listingContactConfirmationTemplate).Render(data)

	if err != nil {
		e.App.Logger().Error("Can't render listing-contact-confirmation email template: %w", err)
		return e.Next()
	}

	msg := &mailer.Message{
		From: mail.Address{
			Address: e.App.Settings().Meta.SenderAddress,
			Name:    e.App.Settings().Meta.SenderName,
		},
		To:      []mail.Address{{Address: user.Email()}},
		Subject: "Bestätigung zu deine Materialangebot Anfrage",
		HTML:    html,
	}

	return e.App.NewMailClient().Send(msg)
}
