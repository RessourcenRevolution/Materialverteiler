# Materialverteiler

Materialverteiler (material distributor) offers a ready to go solution to start
a material distribution platform.

The platform connects institutions, allowing them to pass on items and materials
to give them a second life, instead of discarding them.

## Features

- **📦 Material listings**: Create, browse, and view materials
- **✉️ Transaction emails**: Automatic emails for new listings and interactions
- **👤 User Management**: Sign up, login, email verification and password reset
- **🔒 Sign up approval**: Grant access to users/institutions only after admin
  approval
- **📩 Admin email workflow**: Automated email notifications for new sign ups and
  listing activities
- **🔧 Keystone integration**: CMS for content management

## Architecture

This project is a mono repo containing several applications that work together to
form the platform.

### Pocketbase (API Backend)

The core back-end is a [Pocketbase](https://pocketbase.io/) application. It
serves as the primary API, handling:

- User authentication and management
- Database storage for listings, teams, and user data
- Business logic and custom API endpoints
- Transactional e-mail sending

### Keystone (Content Management)

A [Keystone](https://keystonejs.com) instance functions as the Headless Content
Management System (CMS). It is used for managing structured content that is
displayed on the front-end.

### Astro (Frontend)

The user-facing website is built with [Astro](https://astro.build). This
application is responsible for:

- Rendering the user interface
- Communicating with the Pocketbase API for dynamic data and user actions (like
  logging in and creating listings)
- Fetching content from the Keystone CMS to display on pages

## Tech

- [NPM Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [Mise](https://github.com/jdx/mise)
- [Mailpit](https://github.com/axllent/mailpit)
- [Pocketbase](https://pocketbase.io/)
- [Keystone](https://keystonejs.com)
- [Astro](https://astro.build)
- [Tailwind](https://tailwindcss.com)
- [Astrobook](https://github.com/ocavue/astrobook)

## Deployment

```sh
docker compose build
docker compose up
```

## Development

### Getting started

- Set up [mise](https://github.com/jdx/mise?tab=readme-ov-file#quickstart).
- Clone the repository

```bash
# Install required platform dependencies
$ mise install

# Install required npm dependencies
$ npm i

# Enable mono-repo support for mise
$ export MISE_EXPERIMENTAL=true

# Run setup actions
$ mise run //:setup

# Run applications
$ mise run //...:dev
```

After initially starting all application:

- Head to <http://localhost:3002> to create a first Keystone admin user
- Create an additional Keystone user with the following credentials for local
  usage:
  - E-mail address: <example@example.com>
  - Password: 123456abcdef
- Create a homepage in the Keystone 'Pages' section
- Create a main navigation in the Keystone 'Navigations' section

### Run

Use `mise` to start the project in development mode, including `mailpit` as
email testing tool.

```sh
# Enable mono-repo support for mise
$ export MISE_EXPERIMENTAL=true

# Start the project in dev mode
$ mise run //...:dev
```

The following services will be available:

- Front-end: <https://localhost:3000>
- Astrobook: <https://localhost:3001>
- Keystone: <https://localhost:3002>
- Pocketbase: <https://localhost:8090>
- Mailpit: <https://localhost:8025>
