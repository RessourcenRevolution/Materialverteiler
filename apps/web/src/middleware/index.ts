import { defineMiddleware } from 'astro/middleware'
import { sequence } from 'astro:middleware'
import {
  authPocketbase,
  initPocketbase,
} from '@rr/astro-pocketbase/middleware'

// Routes a visitor can visit without being authenticated
const APP_ROUTE = /^\/app($|\/.*)/

const UNAUTHENTICATED_APP_ROUTES = [
  /^\/app\/login($|\/.*)/,
  /^\/app\/password-reset($|\/.*)/,
  /^\/app\/password-reset-confirm($|\/.*)/,
  /^\/app\/signup($|\/.*)/,
]

// Routes a user can visit without having the 'user' role
const NEW_USER_ROUTES = [
  /^\/app\/logout$/,
  /^\/app\/listings$/,
  /^\/app\/profile$/,
  /^\/app\/profile\/confirm-email$/,
]

const isNewUserRoute = (path: string): boolean => {
  return NEW_USER_ROUTES.some(pattern => pattern.test(path))
}

const routeGuard = defineMiddleware(async ({ url, locals, redirect, isPrerendered }, next) => {
  // Prerendered routes are always accessible, for now
  if (isPrerendered) {
    return next()
  }

  const pathName = new URL(url).pathname

  // Not an app route, don't verify authentication
  if (!pathName.match(APP_ROUTE)) {
    return next()
  }

  // Unauthenticated app routes, don't verify authentication
  if (UNAUTHENTICATED_APP_ROUTES.some(pattern => pattern.test(pathName))) {
    return next()
  }

  // Otherwise, redirect to login page if the user is not authenticated
  if (!locals.pb.authStore.isValid) {
    return redirect('/app/login?redirect=' + encodeURIComponent(pathName))
  }

  // Unverified users can access some routes
  if (isNewUserRoute(pathName)) {
    return next()
  }

  // Otherwise expect user to be verified, and have the 'user' role to access the route
  if (!locals.pb.authStore.record!.verified || !locals.pb.authStore.record!.roles.includes('user')) {
    return redirect('/app/listings')
  }

  return next()
})

export const onRequest = sequence(initPocketbase, authPocketbase, routeGuard)
