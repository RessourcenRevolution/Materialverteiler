import type Client from 'pocketbase'
import { ListingSchema } from '~/schemas/listing'

export async function getListing(pb: Client, id: string) {
  let listing
  try {
    listing = await pb
      .collection('listings')
      .getOne(id)
  }
  catch (err) {
    console.error(err)
    throw err
  }
  return ListingSchema.parse(listing)
}
