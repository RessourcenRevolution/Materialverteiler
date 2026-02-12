import { defineMiddleware } from 'astro/middleware'
import { sequence } from 'astro:middleware'
import {
  authPocketbase,
  initPocketbase,
} from '@rr/astro-pocketbase/middleware'

// Route where the dynamic application lives, where by default only users with the role 'user' are allowed
const APP_ROUTE = /^\/app($|\/.*)/

// Route where the management pages live, where only users with the role 'manager' are allowed
const MANAGE_ROUTE = /^\/app\/manage($|\/.*)/

// Routes a visitor can visit without being authenticated
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

  const isVerified = locals.pb.authStore.record!.verified
  const hasUserRole = locals.pb.authStore.record!.roles.includes('user')
  const hasManagerRole = locals.pb.authStore.record!.roles.includes('manager')

  // Otherwise expect user to be verified, and have the 'user' role to access the route
  if (!isVerified || !hasUserRole) {
    return redirect('/app/listings')
  }

  // All non-manage routes are now accessible for verified and approved users
  if (!pathName.match(MANAGE_ROUTE)) {
    return next()
  }

  // Otherwise, when not a manager, return to listing overview
  if (!hasManagerRole) {
    return redirect('/app/listings')
  }

  // Continue to manager-only pages
  return next()
})

export const onRequest = sequence(initPocketbase, authPocketbase, routeGuard)
