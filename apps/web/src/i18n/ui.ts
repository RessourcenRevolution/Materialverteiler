import { APP_LANGUAGE } from "astro:env/client";

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
    "forms.email": "E-Mail",
    "forms.password": "Password",
    // Signup page
    "signup.title": "Signup",
    "signup.button": "Signup",
    // Login page
    "login.title": "Login",
    "login.button": "Login",
    // Profile page
    "profile.title": "Profile",
    "profile.name": "Name",
    "profile.email": "E-mail",
    // E-mail confirmation page
    "email-confirmation.title": "E-mail confirmation",
    "email-confirmation.loading": "Confirming e-mail address...",
    "email-confirmation.missing-token": "Missing token",
    "email-confirmation.error":
      "Error confirming e-mail address, please try agian...",
    "email-confirmation.success": "E-Mail confirmed!",
    "email-confirmation.button": "Go to dashboard",
    // Dashboard pge
    "confirm-email.warning.text":
      "Your email address is not yet confirmed. Check your inbox for the confirmation link.",
    "confirm-email.warning.button": "Resend verification e-mail",
    "confirm-email.resend.error":
      "An error occured resending the confirmation email. Please try again.",
    "confirm-email.resend.success":
      "An e-mail verification email has been sent.",
  },
  de: {
    // Header
    "header.dashboard": "Dashboard",
    "header.profile": "Profiel",
    "header.login": "Einloggen",
    "header.signup": "Registrieren",
    "header.logout": "Ausloggen",
    // Forms
    "forms.email": "E-Mail Addresse",
    "forms.password": "Passwort",
    // Signup page
    "signup.title": "Registrieren",
    "signup.button": "Registrieren",
    // Login page
    "login.title": "Einloggen",
    "login.button": "Einloggen",
    // Profile page
    "profile.title": "Profiel",
    "profile.name": "Name",
    "profile.email": "E-Mail",
    // E-mail confirmation page
    "email-confirmation.title": "E-Mail-Bestätigung",
    "email-confirmation.loading": "E-Mail-Adresse wird bestätigt...",
    "email-confirmation.missing-token": "Token fehlt",
    "email-confirmation.error":
      "Fehler bei der Bestätigung der E-Mail-Adresse, bitte versuche es erneut...",
    "email-confirmation.success": "E-Mail Addresse ist bestätigt!",
    "email-confirmation.button": "Zum Dashboard",
    // Dashboard pge
    "confirm-email.warning.text":
      "Deine E-Mail-Adresse wurde noch nicht bestätigt. Überprüfe deinen Posteingang nach dem Bestätigungslink.",
    "confirm-email.warning.button": "Bestätigungs-E-Mail erneut senden",
    "confirm-email.resend.error":
      "Beim erneuten Senden der Bestätigungs-E-Mail ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    "confirm-email.resend.success": "Eine Bestätigungs-E-Mail wurde gesendet.",
  },
} as const;

export function useTranslations(lang: keyof typeof ui = defaultLang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key] || key;
  };
}
