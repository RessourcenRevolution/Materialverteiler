import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ locals, redirect }) => {
  locals.pb.authStore.clear()
  return redirect('/app/login')
}
