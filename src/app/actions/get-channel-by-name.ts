'use server'

import { db } from '@/lib/db'

export async function getChannelByName(
  channelName: string
): Promise<DataResponseState<Channel>> {
  const channelId = await db.hget<string>(
    'channel_index',
    channelName.toLowerCase()
  )

  if (channelId) {
    return {
      status: 'success',
      response: {
        ...(await db.get<Omit<Channel, 'id'>>(`channel:${channelId}`)),
        id: channelId,
      } as Channel,
    }
  } else {
    return {
      status: 'error',
      message: 'Channel does not exist.',
    }
  }
}
