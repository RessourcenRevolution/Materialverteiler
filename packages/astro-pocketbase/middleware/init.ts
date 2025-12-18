import { defineMiddleware } from "astro/middleware";
import PocketBase from "pocketbase";

export const initPocketbase = defineMiddleware(async ({ locals, isPrerendered }, next) => {
  // Don't initialize pocketbase for prerendered routes
  if (isPrerendered) {
    return next()
  }

  const API_URL = import.meta.env.SSR
    ? process.env.API_URL
    : process.env.PUBLIC_API_URL;

  locals.pb = new PocketBase(API_URL);
  return next();
});
