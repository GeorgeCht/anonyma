'use server'

import { db } from '@/lib/db'

export async function getChannelById(
  channelId: string,
): Promise<DataResponseState<Channel>> {
  try {
    const channel = await db.get<Omit<Channel, 'id'>>(`channel:${channelId}`)
    if (channel) {
      return {
        status: 'success',
        response: {
          ...channel,
          id: channelId,
        } as Channel,
      }
    } else {
      return {
        status: 'error',
        message: 'Channel does not exist.',
      }
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Channel does not exist.',
    }
  }
}
