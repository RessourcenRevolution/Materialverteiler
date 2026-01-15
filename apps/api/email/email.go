package email

import (
	_ "embed"
	"log"
	"net/mail"
	"os"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
	"github.com/pocketbase/pocketbase/tools/template"

	"github.com/Masterminds/sprig/v3"

	htmlTemplate "html/template"
)

//go:embed "templates/base.html"
var baseTemplate string

//go:embed "templates/email-verified.html"
var emailVerifiedTemplate string

//go:embed "templates/notify-user-signup.html"
var notifyUserSignupTemplate string

//go:embed "templates/user-approved.html"
var userApprovedTemplate string

//go:embed "templates/notify-new-listing.html"
var notifyNewListingTemplate string

//go:embed "templates/listing-approved.html"
var listingApprovedTemplate string

//go:embed "templates/new-listing.html"
var newListingTemplate string

//go:embed "templates/listing-contact.html"
var listingContactTemplate string

//go:embed "templates/listing-contact-confirmation.html"
var listingContactConfirmationTemplate string

// DefaultFields contains fields that are common to all email types
type DefaultFields struct {
	AppURL string
	ApiURL string
}

// Email data structs - now embedding CommonEmailFields
type EmailVerifiedData struct {
	DefaultFields
	Firstname string
}

type NotifyUserSignupData struct {
	DefaultFields
	ManagerFirstname string
	UserId           string
	UserFirstname    string
	UserLastname     string
	UserEmail        string
	TeamName         string
	TeamType         string
	TeamCity         string
	Message          htmlTemplate.HTML
}

type UserApprovedData struct {
	DefaultFields
	Firstname string
}

type NotifyNewListingData struct {
	DefaultFields
	UserFirstname    string
	UserLastname     string
	ManagerFirstname string
	ListingId        string
	ListingTitle     string
	TeamName         string
}

type ListingApprovedData struct {
	DefaultFields
	Firstname    string
	ListingId    string
	ListingTitle string
}

type NewListingData struct {
	DefaultFields
	Firstname           string
	ListingId           string
	ListingTitle        string
	ListingMaterial     string
	ListingMeasurements string
	ListingCondition    string
	ListingDescription  string
}

type ListingContactData struct {
	DefaultFields
	ListingId   string
	Firstname   string
	OtherName   string
	Email       string
	Phonenumber string
	Message     htmlTemplate.HTML
}

type ListingContactConfirmationData struct {
	DefaultFields
	ListingId    string
	ListingTitle string
	Firstname    string
	Name         string
	Email        string
	Phonenumber  string
	Message      htmlTemplate.HTML
}

// EmailData interface that all email data structs must implement
type EmailData interface {
	EmailVerifiedData | NotifyUserSignupData | UserApprovedData | NotifyNewListingData | ListingApprovedData | NewListingData | ListingContactData | ListingContactConfirmationData
}

// EmailTemplate holds the template and subject for an email type
type EmailTemplate struct {
	Template string
	Subject  string
}

// emailTemplates maps email data types to their templates and subjects
var emailTemplates = map[any]EmailTemplate{
	EmailVerifiedData{}: {
		Subject:  "Wilkommen im Materialverteiler",
		Template: emailVerifiedTemplate,
	},
	NotifyUserSignupData{}: {
		Subject:  "Neue Anfrage zum Beitritt zum Materialverteiler: {{.UserFirstname}} von {{.TeamName}}",
		Template: notifyUserSignupTemplate,
	},
	UserApprovedData{}: {
		Subject:  "Willkommen in der Community",
		Template: userApprovedTemplate,
	},
	NotifyNewListingData{}: {
		Subject:  "Neues Angebot wartet auf Freigabe: {{.ListingTitle}}",
		Template: notifyNewListingTemplate,
	},
	ListingApprovedData{}: {
		Subject:  "Dein Angebot ist freigeschaltet: {{.ListingTitle}}",
		Template: listingApprovedTemplate,
	},
	NewListingData{}: {
		Subject:  "Neues Materialangebot: {{.ListingTitle}}",
		Template: newListingTemplate,
	},
	ListingContactData{}: {
		Subject:  "Neue Anfrage zu Ihrem Materialangebot",
		Template: listingContactTemplate,
	},
	ListingContactConfirmationData{}: {
		Subject:  "Bestätigung zu deine Materialangebot Anfrage",
		Template: listingContactConfirmationTemplate,
	},
}

// getEmailTemplate returns the template and subject for a given data type
func getEmailTemplate[T EmailData](data T) EmailTemplate {
	// Create a zero value of the type to use as map key
	var zero T
	return emailTemplates[zero]
}

// Email configuration for custom sender
type EmailConfig struct {
	CustomFrom *mail.Address
}

func newEmailTemplate() *template.Registry {
	return template.NewRegistry().AddFuncs(sprig.FuncMap())
}

// getDefaultFields creates CommonEmailFields from app settings
func GetDefaultFields(app core.App) DefaultFields {
	return DefaultFields{
		AppURL: app.Settings().Meta.AppURL,
		ApiURL: os.Getenv("PUBLIC_API_URL"),
	}
}

func ConvertLinebreaksToHtml(text string) htmlTemplate.HTML {
	return htmlTemplate.HTML(strings.Replace(text, "\n", "<br>", -1))
}

// Generic sendEmail function with type constraint
func renderEmail[T EmailData](app core.App, to mail.Address, data T) (string, string, error) {
	// Get template and subject from the map
	emailTemplate := getEmailTemplate(data)

	// Render html
	html, err := newEmailTemplate().LoadString(baseTemplate + emailTemplate.Template).Render(data)
	if err != nil {
		return "", "", err
	}

	// Render subject with data
	subject, err := template.NewRegistry().LoadString(emailTemplate.Subject).Render(data)
	if err != nil {
		return "", "", err
	}

	return html, subject, nil
}

// Send a rendered email
func SendRenderedEmail(app core.App, to mail.Address, subject string, html string, from mail.Address) error {
	message := &mailer.Message{
		From:    from,
		To:      []mail.Address{to},
		Subject: subject,
		HTML:    html,
	}

	return app.NewMailClient().Send(message)
}

// Generic SendEmail function with type constraint
func SendEmail[T EmailData](app core.App, to mail.Address, data T, config *EmailConfig) error {
	html, subject, err := renderEmail(app, to, data)
	if err != nil {
		app.Logger().Error("Can't render email", "error", err)
		return err
	}

	// Determine sender
	from := mail.Address{
		Address: app.Settings().Meta.SenderAddress,
		Name:    app.Settings().Meta.SenderName,
	}
	if config != nil && config.CustomFrom != nil {
		from = *config.CustomFrom
	}

	return SendRenderedEmail(app, to, subject, html, from)
}

// Generic sendEmail function with type constraint
func QueueEmail[T EmailData](app core.App, to mail.Address, data T, config *EmailConfig) error {
	// Render
	html, subject, err := renderEmail(app, to, data)
	if err != nil {
		app.Logger().Error("Can't render email", "error", err)
		return err
	}

	// Determine sender
	from := mail.Address{
		Address: app.Settings().Meta.SenderAddress,
		Name:    app.Settings().Meta.SenderName,
	}
	if config != nil && config.CustomFrom != nil {
		from = *config.CustomFrom
	}

	// Queue email
	collection, err := app.FindCollectionByNameOrId("emailQueue")
	if err != nil {
		return err
	}
	record := core.NewRecord(collection)
	record.Set("subject", subject)
	record.Set("html", html)
	record.Set("to", to.String())
	record.Set("fromName", from.Name)
	record.Set("fromAddress", from.Address)
	return app.Save(record)
}

type getData[T EmailData] func(*core.Record) T

func QueueManagersEmail[T EmailData](app core.App, fn getData[T]) error {
	managers, err := app.FindRecordsByFilter("users", "roles ~ 'manager'", "", -1, 0, dbx.Params{})
	if err != nil {
		app.Logger().Error("Error fetching managers", err.Error())
		return err
	}
	if managers == nil || len(managers) == 0 {
		app.Logger().Info("No managers found to send email")
		return nil
	}
	log.Printf("Notify %s managers\n", len(managers))
	for _, manager := range managers {
		data := fn(manager)
		QueueEmail(app, mail.Address{Address: manager.Email()}, data, nil)
	}
	return nil
}
