import { defineMiddleware } from "astro/middleware";
import { sequence } from "astro:middleware";
import {
  authPocketbase,
  initPocketbase,
} from "@rr/astro-pocketbase/middleware";

// Routes a visitor can visit without being authenticated
const UNPROTECTED_ROUTES = [
  /^\/login($|\/.*)/,
  /^\/signup($|\/.*)/,
  /^\/logout($|\/.*)/,
  /^\/($|\/.*)/,
];

const isSafeRoute = (path: string): boolean => {
  return UNPROTECTED_ROUTES.some((pattern) => pattern.test(path));
};

const routeGuard = defineMiddleware(async ({ url, locals, redirect }, next) => {
  const pathName = new URL(url).pathname;
  if (isSafeRoute(pathName)) {
    return next();
  }

  if (!locals.pb.authStore.isValid) {
    return redirect("/login");
  }

  return next();
});

export const onRequest = sequence(initPocketbase, authPocketbase, routeGuard);
