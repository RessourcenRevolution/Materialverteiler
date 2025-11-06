import { defineMiddleware } from "astro/middleware";
import { sequence } from "astro:middleware";
import {
  authPocketbase,
  initPocketbase,
} from "@rr/astro-pocketbase/middleware";

// Routes a visitor can visit without being authenticated
const UNAUTHENTICATED_ROUTES = [
  /^\/login($|\/.*)/,
  /^\/signup($|\/.*)/,
  /^\/logout($|\/.*)/,
  /^\/($|\/.*)/,
];

// Routes a user can visit without having the 'user' role
const NEW_USER_ROUTES = [/^\/dashboard($|\/.*)/, /^\/profile($|\/.*)/];

const isUnauthenticatedRoute = (path: string): boolean => {
  return UNAUTHENTICATED_ROUTES.some((pattern) => pattern.test(path));
};

const isNewUserRoute = (path: string): boolean => {
  return NEW_USER_ROUTES.some((pattern) => pattern.test(path));
};

const routeGuard = defineMiddleware(async ({ url, locals, redirect }, next) => {
  const pathName = new URL(url).pathname;

  // Always allow accessing unprotected routes
  if (isUnauthenticatedRoute(pathName)) {
    return next();
  }

  // Redirect to login page if the user is not authenticated
  if (!locals.pb.authStore.isValid) {
    return redirect("/login");
  }

  // Always allow accessing unprotected routes
  if (isNewUserRoute(pathName)) {
    return next();
  }

  // Redirect to dashboard page if the user doesn't have the 'user' role
  if (!locals.pb.authStore.record!.roles.includes("user")) {
    return redirect("/dashboard");
  }

  return next();
});

export const onRequest = sequence(initPocketbase, authPocketbase, routeGuard);
