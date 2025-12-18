import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ locals, redirect }) => {
  // Clear pocketbase auth state
  locals.pb.authStore.clear()

  // Get redirect response
  const response = redirect('/app/login')

  // Append new empty cookie
  const authCookie = locals.pb.authStore.exportToCookie({
    sameSite: 'lax',
  })
  response.headers.append('set-cookie', authCookie)

  return response
}
