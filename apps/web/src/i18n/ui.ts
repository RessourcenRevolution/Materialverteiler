import { APP_LANGUAGE } from "astro:env/client";

export type TranslationKey = keyof (typeof ui)[typeof defaultLang];

export const languages = {
  en: "English",
  de: "Deutsch",
};

export const defaultLang = APP_LANGUAGE;

export const ui = {
  en: {
    // Header
    "header.dashboard": "Dashboard",
    "header.profile": "Profile",
    "header.login": "Login",
    "header.signup": "Signup",
    "header.logout": "Logout",
    // Forms
    "forms.firstname": "Firstname",
    "forms.lastname": "Lastname",
    "forms.team": "Institution",
    "forms.email": "E-Mail",
    "forms.password": "Password",
    "forms.errors.required": "This field is required",
    // Signup page
    "signup.title": "Signup",
    "signup.button": "Signup",
    "signup.errors.email_in_use":
      "There is already an account with this e-mail address.",
    "signup.errors.password_too_short":
      "Password should be at least 8 characters long.",
    "signup.errors.required": "This field is required.",
    "signup.errors.unknown":
      "An unknown error occurred while creating your account, please try again.",
    // Login page
    "login.title": "Login",
    "login.button": "Login",
    // Profile page
    "profile.title": "Profile",
    "profile.name": "Name",
    "profile.email": "E-mail",
    "profile.team": "Institution",
    // E-mail confirmation page
    "email-confirmation.title": "E-mail confirmation",
    "email-confirmation.loading": "Confirming e-mail address...",
    "email-confirmation.missing-token": "Missing token",
    "email-confirmation.error":
      "Error confirming e-mail address, please try agian...",
    "email-confirmation.success": "E-Mail confirmed!",
    "email-confirmation.button": "Go to dashboard",
    // Dashboard page
    "dashboard.user-approval.title": "Welcome",
    "dashboard.user-approval.text":
      "Your account is currently under review and will be approved soon. We’ll notify you by email once it’s ready.",
    "confirm-email.warning.text":
      "Your email address is not yet confirmed. Check your inbox for the confirmation link.",
    "confirm-email.warning.button": "Resend verification e-mail",
    "confirm-email.resend.error":
      "An error occured resending the confirmation email. Please try again.",
    "confirm-email.resend.success":
      "An e-mail verification email has been sent.",
    // New listing page
    "create-listing.create-team.title": "Create team",
    "create-listing.create-team.text":
      "Please provide information about your institute, organization, or association.",
    "create-listing.title": "New listing",
    "create-listing.text": "Please provide information about your resource.",
    "create-listing.button": "Submit",
    "create-listing.errors.forbidden":
      "You are not allowed to create new listings",
    "create-listing.errors.image-file-size-limit":
      "One of the selected images exceeds the maximum allowed file size of 5MB.",
    "create-listing.errors.unknown":
      "An unknown error occurred while creating the listing.",
    // Team form
    "team-form.name.label": "Name",
    "team-form.name.placeholder": "e.g., Oper Köln",
    "team-form.address.label": "Address",
    "team-form.postalcode.label": "ZIP Code",
    "team-form.city.label": "City",
    "team-form.city.required": "Please provide a city.",
    "team-form.errors.already-in-team": "You are already a member of a team.",
    "team-form.submit": "Create team",
    "team-form.success": "Successfully created your team",
    // Listing form
    "listing-form.title.label": "Title",
    "listing-form.description.label": "Description",
    "listing-form.images.label": "Images",
    "listing-form.submit": "Create listing",
    "listing-form.success": "Listing created successfully!",
  },
  de: {
    // Header
    "header.dashboard": "Dashboard",
    "header.profile": "Profiel",
    "header.login": "Einloggen",
    "header.signup": "Registrieren",
    "header.logout": "Ausloggen",
    // Forms
    "forms.firstname": "Vorname",
    "forms.lastname": "Nachname",
    "forms.team": "Institution",
    "forms.email": "E-Mail Addresse",
    "forms.password": "Passwort",
    "forms.errors.required": "Dieses Feld ist erforderlich",
    // Signup page
    "signup.title": "Registrieren",
    "signup.button": "Registrieren",
    "signup.errors.email_in_use":
      "Es gibt bereits ein Konto mit dieser E-Mail-Adresse.",
    "signup.errors.password_too_short":
      "Das Passwort muss mindestens 8 Zeichen lang sein.",
    "signup.errors.required": "Dieses Feld ist erforderlich.",
    "signup.errors.unknown":
      "Ein unbekannter Fehler ist aufgetreten, bitte versuche es erneut.",
    // Login page
    "login.title": "Einloggen",
    "login.button": "Einloggen",
    // Profile page
    "profile.title": "Profiel",
    "profile.name": "Name",
    "profile.email": "E-Mail",
    "profile.team": "Institution",
    // E-mail confirmation page
    "email-confirmation.title": "E-Mail-Bestätigung",
    "email-confirmation.loading": "E-Mail-Adresse wird bestätigt...",
    "email-confirmation.missing-token": "Token fehlt",
    "email-confirmation.error":
      "Fehler bei der Bestätigung der E-Mail-Adresse, bitte versuche es erneut...",
    "email-confirmation.success": "E-Mail Addresse ist bestätigt!",
    "email-confirmation.button": "Zum Dashboard",
    // Dashboard page
    "dashboard.user-approval.title": "Wilkommen",
    "dashboard.user-approval.text":
      "Dein Konto wird derzeit geprüft und bald freigeschaltet. Sobald es aktiviert ist, erhältst du eine E-Mail von uns.",
    "confirm-email.warning.text":
      "Deine E-Mail-Adresse wurde noch nicht bestätigt. Überprüfe deinen Posteingang nach dem Bestätigungslink.",
    "confirm-email.warning.button": "Bestätigungs-E-Mail erneut senden",
    "confirm-email.resend.error":
      "Beim erneuten Senden der Bestätigungs-E-Mail ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    "confirm-email.resend.success": "Eine Bestätigungs-E-Mail wurde gesendet.",
    // New listing page
    "create-listing.create-team.title": "Erstelle ein Team",
    "create-listing.create-team.text":
      "Bitte gib Informationen zu deinem Institut, deiner Organisation oder deinem Verein an.",
    "create-listing.title": "Neues Angebot",
    "create-listing.text":
      "Gib einige Details zu dem Material an, das du anbietest.",
    "create-listing.button": "Anlegen",
    "create-listing.errors.forbidden":
      "Du bist nicht berechtigt, neue Angebote zu erstellen",
    "create-listing.errors.image-file-size-limit":
      "Eine der ausgewählten Bilder überschreitet die maximal zulässige Dateigröße von 5 MB.",
    "create-listing.errors.unknown":
      "Ein unbekannter Fehler ist beim Erstellen des Angebots aufgetreten.",
    // Team form
    "team-form.name.label": "Name",
    "team-form.name.placeholder": "z.B. Oper Köln",
    "team-form.address.label": "Addresse",
    "team-form.postalcode.label": "PLZ",
    "team-form.city.label": "Stadt",
    "team-form.city.required": "Bitte gib eine Stadt ein.",
    "team-form.errors.already-in-team":
      "Du bist bereits Mitglied in einem Team.",
    "team-form.submit": "Team erstellen",
    "team-form.success": "Team erfolgreich erstellt.",
    // Listing form
    "listing-form.title.label": "Titel",
    "listing-form.description.label": "Beschreibung",
    "listing-form.images.label": "Bilder",
    "listing-form.submit": "Angebot anlegen",
    "listing-form.success": "Angebot erfolgreich angelegt!",
  },
};

export function useTranslations(lang: keyof typeof ui = defaultLang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key] || key;
  };
}
