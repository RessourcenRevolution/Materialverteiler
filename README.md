# Materialverteiler

Materialverteiler (material distributor) is a material distribution platform,
allowing institutions to pass on items and materials to give them a second life,
instead of discarding them. Built using [Pocketbase](https://pocketbase.io/),
[Keystone](https://keystonejs.com) and [Astro](https://astro.build).

## Features

- **📦 Listings**: Create, browse, and view items/materials
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
- Scheduled jobs and cron tasks

### Keystone (Content Management)

A [Keystone](https://keystonejs.com) instance functions as the Headless Content
Management System (CMS). It is used for managing structured content that is
displayed on the front-end.

Key features:

- SQLite database for content storage
- GraphQL API for content delivery
- Local image storage and management

### Astro (Frontend)

The user-facing website is built with [Astro](https://astro.build). This
application is responsible for:

- Rendering the user interface
- Communicating with the Pocketbase API for dynamic data and user actions (like
  logging in and creating listings)
- Fetching content from the Keystone CMS to display on pages
- Multi-language support (English and German)

### Astrobook (Component Documentation)

[Astrobook](https://github.com/ocavue/astrobook) is used for component
documentation and development. It provides:

- Interactive component documentation
- Development environment for UI components

## Project Structure

```
/
├── apps/                  # Main applications
│   ├── api/               # Pocketbase API backend
│   ├── web/               # Astro frontend application
│   ├── keystone/          # Keystone CMS
│   └── astrobook/         # Component documentation
├── packages/              # Shared packages and components
│   ├── astro-pocketbase/  # Pocketbase integration for Astro
│   ├── ui/                # UI component library
│   ├── drawer-menu/       # Drawer menu component
│   ├── image-gallery/     # Image gallery component
│   ├── image-uploader/    # Image uploader component
│   └── eslint-config/     # Shared ESLint configuration
├── docker-compose.yml     # Docker configuration
├── mise.toml              # Development environment configuration
└── package.json           # Monorepo root configuration
```

## Deployment

Materialverteiler is best deployed using [Docker](https://www.docker.com/). This
repository contains a [docker-compose.yaml](./docker-compose.yml) which, when
provided with the correct [environment variables](#environment-variables)
as described below, leads to a successful deployment.

## Environment Variables

For development purposes the local setup gets provided with correct defaults
using mise.

Configuring the environment variables is in general only required when deploying
the services somewhere using docker.

### Web Application (apps/web)

Create a `.env` file in the `apps/web` directory with:

```env
APP_NAME=Your App Name
APP_LANGUAGE=en # or 'de' for German
```

### Keystone CMS (apps/keystone)

The Keystone application requires a session secret:

```env
SESSION_SECRET=your_secure_random_string
```

### Docker Configuration

The `docker-compose.yml` file supports the following environment variables:

```env
# Web application
APP_NAME=App Name
APP_LANGUAGE=en
APP_PORT=3000

# API
API_URL=https://<pocketbase_public_or_internal_url>
PUBLIC_API_URL=https://<pocketbase_public_url>

# Keystone
KEYSTONE_BASE_URL=https://<keystone_public_url>
WEB_APP_BASE_URL=https://<astro_app_public_url>
KEYSTONE_API_USER_EMAIL=your_email@example.com
KEYSTONE_API_USER_PASSWORD=your_password
KEYSTONE_GRAPHQL_ENDPOINT=https://<keystone_public_url>/api/graphql
```

## Development

### Tech-Stack

- [NPM Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [Mise](https://github.com/jdx/mise)
- [Mailpit](https://github.com/axllent/mailpit)
- [Pocketbase](https://pocketbase.io/)
- [Keystone](https://keystonejs.com)
- [Astro](https://astro.build)
- [Tailwind](https://tailwindcss.com)
- [Astrobook](https://github.com/ocavue/astrobook)

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

### Testing

Currently only typechecking is implemented as testing strategy, this can be run
for the whole project using:

```bash
# Run typechecking in the different apps and packages
mise run //...:typecheck
```

## Contribution Guidelines

We welcome contributions to the Materialverteiler project! Here's how you can help:

### Reporting Issues

- Check existing issues before creating new ones
- Provide clear reproduction steps
- Include relevant logs and screenshots
- Specify the affected components

### Pull Request Process

1. Ensure your code passes all tests
2. Update documentation if needed
3. Reference any related issues in your PR description
4. Be responsive to feedback and review comments
5. Keep your PR focused on a single feature/fix

## Troubleshooting

### Common Issues

**Mailpit not starting:**

- Ensure you have `MISE_EXPERIMENTAL=true` set
- Check that the mailpit binary was downloaded correctly
- Try running `mise run //:setup` again

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.
Please review the license before using, modifying, or distributing this software.
