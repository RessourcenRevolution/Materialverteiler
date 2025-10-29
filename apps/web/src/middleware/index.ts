import { defineMiddleware } from "astro/middleware";
import { sequence } from "astro:middleware";
import PocketBase from "pocketbase";

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

const authMiddleware = defineMiddleware(async ({ locals, request }, next) => {
  const API_URL = import.meta.env.SSR
    ? process.env.API_URL
    : process.env.PUBLIC_API_URL;

  locals.pb = new PocketBase(API_URL);

  // Load the store data from the request cookie string
  locals.pb.authStore.loadFromCookie(request.headers.get("cookie") || "");

  try {
    locals.pb.authStore.isValid &&
      (await locals.pb.collection("users").authRefresh());
  } catch (_) {
    locals.pb.authStore.clear();
  }

  const response = await next();

  // Set the auth cookie with the updated auth state
  const authCookie = locals.pb.authStore.exportToCookie({
    sameSite: "lax",
  });
  response.headers.append("set-cookie", authCookie);

  return response;
});

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

export const onRequest = sequence(authMiddleware, routeGuard);
