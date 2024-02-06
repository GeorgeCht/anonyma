'use server'

import { db } from '@/lib/db'

export async function getResults(searchQuery: string) {
  let channelResults: Array<Omit<Channel, 'id'>> = []
  const results = await db.scan(0, {
    match: `tag:*${searchQuery}*`,
    type: 'zset',
  })
  const [, resultsArray] = results
  if (resultsArray.length > 0) {
    await Promise.all(
      resultsArray.map(async (result) => {
        const channelIdResults = await db.zrange<Array<string>>(result, 0, -1)

        if (channelIdResults.length > 0) {
          await Promise.all(
            channelIdResults.map(async (channelId) => {
              const channel = await db.get<Omit<Channel, 'id'>>(
                `channel:${channelId}`,
              )
              channel && channelResults.push(channel)
            }),
          )
        }
      }),
    )
  }

  return channelResults
}
