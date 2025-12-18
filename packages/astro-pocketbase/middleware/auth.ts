import { defineMiddleware } from "astro/middleware";

export const authPocketbase = defineMiddleware(
  async ({ locals, request, isPrerendered }, next) => {
    // Don't validate pocketbase auth for prerendered routes
    if (isPrerendered) {
      return next()
    }

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
    if (locals.pb.authStore.isValid) {
      const authCookie = locals.pb.authStore.exportToCookie({
        sameSite: "lax",
      });
      response.headers.append("set-cookie", authCookie);
    }

    return response;
  }
);
