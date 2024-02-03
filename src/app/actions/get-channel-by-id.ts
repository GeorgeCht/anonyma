'use server'

import { db } from '@/lib/db'

export async function getChannelById(channelId: string) {
  const channel = await db.get<Omit<Channel, 'id'>>(`channel:${channelId}`)
  if (channel) {
    return {
      ...channel,
      id: channelId,
    } as Channel
  } else {
    throw new Error('Channel does not exist.')
  }
}
