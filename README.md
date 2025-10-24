# Mise-Astro-Pocketbase

Example/Template of a mono-repository with Pocketbase as back-end application,
Astro as web application, Astrobook as component documentation application, and
an NPM Workspace UI subpackage containing UI Components. Tool versioning and
repository task management using Mise. Production ready setup using Docker.

## Stack

- [NPM Workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [Mise](https://github.com/jdx/mise)
- [Pocketbase](pocketbase.io)
- [Astro](https://astro.build)
- [Tailwind](https://tailwindcss.com)
- [Astrobook](https://github.com/ocavue/astrobook)

## Setup

1. Set up [mise](https://github.com/jdx/mise?tab=readme-ov-file#quickstart)
1. Run `$ mise install`
1. Run `$ npm i`
1. Run `$ export MISE_EXPERIMENTAL=true`
1. Run `$ mise run //...:dev`

## Dev

```sh
$ export MISE_EXPERIMENTAL=true
$ mise run //...:dev
```

## Docker

```sh
$ docker compose build
$ docker compose up
```
