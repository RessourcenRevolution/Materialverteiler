import type Client from 'pocketbase'
import { ListingSchema, type Listing } from '~/schemas/listing'

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
  return ListingSchema.parse(listing) as Listing
}

/**
 * Retrieves all future active listings (`start_date > yesterday && (status = open || reserved)`)
 */
export async function getFutureActiveListings(pb: Client, query: string = '') {
  let listings
  try {
    listings = await pb
      .collection('listings')
      .getFullList({
        expand: 'user,team',
        filter: pb.filter(`start_date > @yesterday && (status = "open" || status = "reserved")${query ? ' && (title ~ {:query} || description ~ {:query} || material ~ {:query})' : ''}`, { query }),
        sort: 'start_date',
      })
  }
  catch (err) {
    console.error(err)
    throw err
  }
  return ListingSchema.array().parse(listings) as Listing[]
}

/**
 * Retrieves all past active listings (`start_date < yesterday && (status = open || reserved)`)
 */
export async function getPastActiveListings(pb: Client, query: string = '') {
  let listings
  try {
    listings = await pb
      .collection('listings')
      .getFullList({
        expand: 'user,team',
        filter: pb.filter(`start_date < @yesterday && (status = "open" || status = "reserved")${query ? ' && (title ~ {:query} || description ~ {:query} || material ~ {:query})' : ''}`, { query }),
        sort: '-start_date',
      })
  }
  catch (err) {
    console.error(err)
    throw err
  }
  return ListingSchema.array().parse(listings) as Listing[]
}
