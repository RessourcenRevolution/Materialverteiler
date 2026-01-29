import type Client from 'pocketbase'
import { TeamSchema } from '~/schemas/team'
import type { User } from '~/schemas/user'

export async function getUserTeam(pb: Client, user: User) {
  let team
  try {
    team = await pb
      .collection('teams')
      .getOne(user.team)
  }
  catch (err) {
    console.error(err)
    throw err
  }
  return TeamSchema.parse(team)
}
