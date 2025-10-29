import { defineMiddleware } from "astro/middleware";
import PocketBase from "pocketbase";

export const onRequest = defineMiddleware(
  async ({ locals, request, redirect }, next) => {
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

    // If invalid, redirect to login
    if (request.method === "GET" && !locals.pb.authStore.isValid) {
      const url = new URL(request.url);
      if (url.pathname !== "/login") {
        return redirect("/login");
      }
    }

    const response = await next();

    // Set the auth cookie with the updated auth state
    const authCookie = locals.pb.authStore.exportToCookie({ sameSite: "lax" });
    response.headers.append("set-cookie", authCookie);

    return response;
  }
);
