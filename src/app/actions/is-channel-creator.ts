'use server'

import { db } from '@/lib/db'
import { userSession } from './session'

export async function isChannelCreator(channelName: string) {
  const channelId = await db.hget<string>(
    'channel_index',
    channelName.toLowerCase()
  )
  if (channelId) {
    const channel = await db.get<Omit<Channel, 'id'>>(`channel:${channelId}`)
    if (channel?.createdBy === (await userSession.get()).id) {
      return true
    } else {
      return false
    }
  } else {
    throw new Error('Channel does not exist.')
  }
}
