import { APP_LANGUAGE } from 'astro:env/client'

export type TranslationKey = keyof (typeof ui)[typeof defaultLang]

export const languages = {
  en: 'English',
  de: 'Deutsch',
}

export const defaultLang = APP_LANGUAGE

export const ui = {
  en: {
    // Header
    'header.home': 'Home',
    'header.dashboard': 'Dashboard',
    'header.profile': 'Profile',
    'header.login': 'Login',
    'header.signup': 'Signup',
    'header.logout': 'Logout',
    'header.about': 'About us',
    // Forms
    'forms.firstname': 'Firstname',
    'forms.lastname': 'Lastname',
    'forms.team': 'Institution',
    'forms.email': 'E-Mail',
    'forms.password': 'Password',
    'forms.errors.required': 'This field is required',
    // Signup page
    'signup.title': 'Signup',
    'signup.button': 'Signup',
    'signup.errors.email_in_use':
      'There is already an account with this e-mail address.',
    'signup.errors.password_too_short':
      'Password should be at least 8 characters long.',
    'signup.errors.required': 'This field is required.',
    'signup.errors.unknown':
      'An unknown error occurred while creating your account, please try again.',
    // Login page
    'login.title': 'Login',
    'login.button': 'Login',
    'login.signup': 'Create account',
    // Profile page
    'profile.title': 'Your profile',
    'profile.name': 'Name',
    'profile.email': 'E-mail',
    'profile.team': 'Institution',
    'profile.active-listings': 'Active offers',
    'profile.past-listings': 'Past offers',
    // E-mail confirmation page
    'email-confirmation.title': 'E-mail confirmation',
    'email-confirmation.loading': 'Confirming e-mail address...',
    'email-confirmation.missing-token': 'Missing token',
    'email-confirmation.error':
      'Error confirming e-mail address, please try agian...',
    'email-confirmation.success': 'E-Mail confirmed!',
    'email-confirmation.button': 'Go to dashboard',
    // Dashboard page
    'dashboard.title': 'Offers',
    'dashboard.user-approval.title': 'Welcome',
    'dashboard.user-approval.text':
      'Your account is currently under review and will be approved soon. We’ll notify you by email once it’s ready.',
    'confirm-email.warning.text':
      'Your email address is not yet confirmed. Check your inbox for the confirmation link.',
    'confirm-email.warning.button': 'Resend verification e-mail',
    'confirm-email.resend.error':
      'An error occured resending the confirmation email. Please try again.',
    'confirm-email.resend.success':
      'An e-mail verification email has been sent.',
    // New listing page
    'create-listing.create-team.title': 'Create team',
    'create-listing.create-team.text':
      'Please provide information about your institute, organization, or association.',
    'create-listing.title': 'New listing',
    'create-listing.text': 'Please provide information about your resource.',
    'create-listing.button': 'Submit',
    'create-listing.errors.forbidden':
      'You are not allowed to create new listings',
    'create-listing.errors.image-file-size-limit':
      'One of the selected images exceeds the maximum allowed file size of 5MB.',
    'create-listing.errors.unknown':
      'An unknown error occurred while creating the listing.',
    // Update listing
    'update-listing.title': 'Update listing',
    'update-listing.text': 'Edit the detail of your listing.',
    // Team form
    'team-form.name.label': 'Name',
    'team-form.name.placeholder': 'e.g., Oper Köln',
    'team-form.address.label': 'Address',
    'team-form.postalcode.label': 'ZIP Code',
    'team-form.city.label': 'City',
    'team-form.city.required': 'Please provide a city.',
    'team-form.errors.already-in-team': 'You are already a member of a team.',
    'team-form.submit': 'Create team',
    'team-form.success': 'Successfully created your team',
    // Listing form
    'listing-form.general.title': 'Material Information',
    'listing-form.general.text':
      'Please provide detailed information about the material you want to give away. Knowing the exact dimensions, weight, and condition will make pickup easier. Also, upload suitable photos from different angles showing the material in its current state.',
    'listing-form.pickup.title': 'Pickup Information',
    'listing-form.pickup.text':
      'Please enter precise details about the pickup. Is there anything to note about access? Can assistance be provided for loading? Are tools or electricity available on-site for disassembly?',
    'listing-form.title.label': 'Title',
    'listing-form.description.label': 'Description',
    'listing-form.material.label': 'Material',
    'listing-form.measurements.label': 'Dimensions and Weight',
    'listing-form.condition.label':
      'Condition (e.g., assembled / disassembled)',
    'listing-form.address.label': 'Street and House Number for Pickup',
    'listing-form.postalcode.label': 'Postal Code for Pickup',
    'listing-form.city.label': 'City for Pickup',
    'listing-form.pickup_description.label': 'Important Pickup Info (Optional)',
    'listing-form.start_date.label': 'Available From',
    'listing-form.end_date.label': 'Available Until (Optional)',
    'listing-form.create.images.label': 'Images',
    'listing-form.update.images.label': 'Add images',
    'listing-form.create.submit': 'Create listing',
    'listing-form.update.submit': 'Save listing',
    'listing-form.create.success': 'Listing created successfully!',
    'listing-form.update.success': 'Listing updated successfully!',
    // Listing card
    'listing-card.open': 'View',
    'listing-card.edit': 'Edit',
    'listing-card.remove': 'Remove',
  },
  de: {
    // Header
    'header.home': 'Startseite',
    'header.dashboard': 'Dashboard',
    'header.profile': 'Profil',
    'header.login': 'Einloggen',
    'header.signup': 'Registrieren',
    'header.about': 'Über uns',
    'header.logout': 'Ausloggen',
    // Forms
    'forms.firstname': 'Vorname',
    'forms.lastname': 'Nachname',
    'forms.team': 'Institution',
    'forms.email': 'E-Mail Addresse',
    'forms.password': 'Passwort',
    'forms.errors.required': 'Dieses Feld ist erforderlich',
    // Signup page
    'signup.title': 'Registrieren',
    'signup.button': 'Registrieren',
    'signup.errors.email_in_use':
      'Es gibt bereits ein Konto mit dieser E-Mail-Adresse.',
    'signup.errors.password_too_short':
      'Das Passwort muss mindestens 8 Zeichen lang sein.',
    'signup.errors.required': 'Dieses Feld ist erforderlich.',
    'signup.errors.unknown':
      'Ein unbekannter Fehler ist aufgetreten, bitte versuche es erneut.',
    // Login page
    'login.title': 'Einloggen',
    'login.button': 'Einloggen',
    'login.signup': 'Konto anlegen',
    // Profile page
    'profile.title': 'Dein Profil',
    'profile.name': 'Name',
    'profile.email': 'E-Mail',
    'profile.team': 'Institution',
    'profile.active-listings': 'Aktive Angebote',
    'profile.past-listings': 'Vergangene Angebote',
    // E-mail confirmation page
    'email-confirmation.title': 'E-Mail-Bestätigung',
    'email-confirmation.loading': 'E-Mail-Adresse wird bestätigt...',
    'email-confirmation.missing-token': 'Token fehlt',
    'email-confirmation.error':
      'Fehler bei der Bestätigung der E-Mail-Adresse, bitte versuche es erneut...',
    'email-confirmation.success': 'E-Mail Addresse ist bestätigt!',
    'email-confirmation.button': 'Zum Dashboard',
    // Dashboard page
    'dashboard.title': 'Materialangebote',
    'dashboard.user-approval.title': 'Wilkommen',
    'dashboard.user-approval.text':
      'Dein Konto wird derzeit geprüft und bald freigeschaltet. Sobald es aktiviert ist, erhältst du eine E-Mail von uns.',
    'confirm-email.warning.text':
      'Deine E-Mail-Adresse wurde noch nicht bestätigt. Überprüfe deinen Posteingang nach dem Bestätigungslink.',
    'confirm-email.warning.button': 'Bestätigungs-E-Mail erneut senden',
    'confirm-email.resend.error':
      'Beim erneuten Senden der Bestätigungs-E-Mail ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    'confirm-email.resend.success': 'Eine Bestätigungs-E-Mail wurde gesendet.',
    // New listing page
    'create-listing.create-team.title': 'Erstelle ein Team',
    'create-listing.create-team.text':
      'Bitte gib Informationen zu deinem Institut, deiner Organisation oder deinem Verein an.',
    'create-listing.title': 'Angebot anlegen',
    'create-listing.text': `<p>Hier kannst du ein neues Angebot anlegen. Bitte nutze die Eintragungsfelder, um so viele Informationen wie möglich weiterzugeben.</p>
      <p>Je genauer die Informationen sind, desto einfacher können wir eine geeignete Abnahme vermitteln.</p>
      <p>Solltest du Fragen bezüglich unserer Plattform haben, schreib uns gerne eine Mail.</p>`,
    'create-listing.button': 'Anlegen',
    'create-listing.errors.forbidden':
      'Du bist nicht berechtigt, neue Angebote zu erstellen',
    'create-listing.errors.image-file-size-limit':
      'Eine der ausgewählten Bilder überschreitet die maximal zulässige Dateigröße von 5 MB.',
    'create-listing.errors.unknown':
      'Ein unbekannter Fehler ist beim Erstellen des Angebots aufgetreten.',
    // Update listing
    'update-listing.title': 'Angebot aktualisieren',
    'update-listing.text':
      'Bearbeite die folgenden Felder, um dein Angebot zu aktualisieren.',
    // Team form
    'team-form.name.label': 'Name',
    'team-form.name.placeholder': 'z.B. Oper Köln',
    'team-form.address.label': 'Addresse',
    'team-form.postalcode.label': 'PLZ',
    'team-form.city.label': 'Stadt',
    'team-form.city.required': 'Bitte gib eine Stadt ein.',
    'team-form.errors.already-in-team':
      'Du bist bereits Mitglied in einem Team.',
    'team-form.submit': 'Team erstellen',
    'team-form.success': 'Team erfolgreich erstellt.',
    // Listing form
    'listing-form.general.title': 'Informationen zum Material',
    'listing-form.general.text':
      'Bitte mache hier ausführliche Angaben zum Material, das du abzugeben hast. Genaues Wissen zu Maßen, Gewicht und Zustand erleichtern die Abholung. Lade auch geeignete Fotos in verschiedenen Ansichten hoch, die das Material im aktuellen Zustand zeigen.',
    'listing-form.pickup.title': 'Informationen zur Abholung',
    'listing-form.pickup.text':
      'Bitte trage hier präzise Infos zur Abholung ein. Gibt es etwas bei der Anfahrt zu beachten? Kann vor Ort beim einladen geholfen werden? Sind Werkzeuge / Strom zum auseinandernehmen vorhanden?',
    'listing-form.title.label': 'Angebotstitel',
    'listing-form.description.label': 'Beschreibungstext',
    'listing-form.material.label': 'Material',
    'listing-form.measurements.label': 'Maße und Gewicht',
    'listing-form.condition.label':
      'Zustand (zB zusammengebaut / in Teile zerlegt)',
    'listing-form.address.label': 'Straße und Hausnummer des Abholungsortes',
    'listing-form.postalcode.label': 'PLZ des Abholungsortes',
    'listing-form.city.label': 'Stadt des Abholungsortes',
    'listing-form.pickup_description.label':
      'Wichtige Infos zur Abholung (Optional)',
    'listing-form.start_date.label': 'Verfügbar ab',
    'listing-form.end_date.label': 'Verfügbar bis (Optional)',
    'listing-form.create.images.label': 'Bilder',
    'listing-form.update.images.label': 'Bilder hinzufügen',
    'listing-form.create.submit': 'Angebot anlegen',
    'listing-form.update.submit': 'Angebot speichern',
    'listing-form.create.success': 'Angebot erfolgreich angelegt!',
    'listing-form.update.success': 'Angebot erfolgreich aktualisiert!',
    // Listing card
    'listing-card.open': 'Zum Angebot',
    'listing-card.edit': 'Bearbeiten',
    'listing-card.remove': 'Löschen',
  },
}

export function useTranslations(lang: keyof typeof ui = defaultLang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key] || key
  }
}
