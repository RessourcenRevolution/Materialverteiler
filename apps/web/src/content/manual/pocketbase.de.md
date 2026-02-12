---
title: Plattformverwaltung
---

# Plattformverwaltung

PocketBase ist das Backend-System, das für Benutzerverwaltung, Anmeldungen und
Materialangebotverwaltung zuständig ist.

## Zugriff auf PocketBase

Die folgende Seite enthält einen Link zu PocketBase: [Manage](/app/manage)

## Admin-Zugriff

Für die Anmeldung im PocketBase-Interface wird ein Admin-Konto (Superuser)
benötigt. Ein neues Admin-Konto kann nur mit einem bestehenden Admin-Konto
erstellt werden.

1. Öffne im Menü der Collections-Sektion von PocketBase den Punkt 'System'
2. Wähle \_superusers aus der Liste
3. Nutze den Button 'New record', um ein neues Admin-Konto anzulegen

## Benutzerverwaltung

### Benutzerrollen

- **User**: Benutzer mit der Rolle "user" sind reguläre, bestätigte Benutzer.
- **Manager**: Benutzer mit der Rolle "manager" haben administrative Rechte
  womit sie Materialangebote verwalten, und bekommen E-Mail Updates bei neu
  Nutzer-Anmeldungen oder das erstellen von neue Materialangebote.

### Benutzer bestätigen

1. Navigiere zur Benutzerliste in PocketBase
2. Wähle den Benutzer aus, den du bestätigen möchtest
3. Bearbeite den Benutzer und weise ihm die Rolle "user" zu
4. Speichere die Änderungen

### Manager-Rechte vergeben

1. Navigiere zur Benutzerliste in PocketBase
2. Wähle den Benutzer aus, dem du Manager-Rechte geben möchtest
3. Bearbeite den Benutzer und weise ihm die Rolle "manager" zu
4. Speichere die Änderungen

## Materialangeboteverwaltung

### Materialangebote bestätigen

1. Navigiere zur Liste der Materialangebote (Listings) in PocketBase
2. Wähle das Materialangebot aus, die du bestätigen möchtest
3. Bearbeite das Materialangebot und setze den Status auf "open"
4. Speichere die Änderungen

Mögliche Materialangebote-Status:

- **new**: Neu erstellt, noch nicht bestätigt
- **open**: Bestätigt und sichtbar (neues Angebot E-Mail wird an alle
  verschickt)
- **reserved**: Reserviert, sichtbar aber keine Kontaktaufnahme möglich
- **success**: Erfolgreich abgeschlossen, nicht mehr sichtbar
- **failure**: Nicht erfolgreich abgeschlossen, nicht mehr sichtbar
