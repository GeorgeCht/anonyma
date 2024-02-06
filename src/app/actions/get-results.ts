'use server'

import { db } from '@/lib/db'
import { getChannelById } from './get-channel-by-id'
import permanentChannels from '@/lib/permanent_channels.json'

export async function getResults(searchQuery: string) {
  let channelResults: Array<Omit<Channel, 'id'>> = []
  const results = await db.scan(0, {
    match: `tag:*${searchQuery}*`,
    type: 'zset',
  })
  const [cursor, resultsArray] = results
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

// export async function getCommunityChannels() {
//   const resultsArray: Array<{ [key: string]: string }> = Object.entries(
//     (await db.hgetall<Record<string, string>>('channel_index'))!,
//   ).map(([key, value]) => ({
//     [key]: value,
//   }))

//   // Get the permanent channel names
//   const permanentChannelNames = permanentChannels.map(
//     (channel) => channel.title,
//   )

//   // Filter out permanent channels and '--expiration'
//   const filteredResultsArray = resultsArray
//     .filter((result) => {
//       const resultKey = Object.keys(result)[0]
//       return !permanentChannelNames.includes(resultKey)
//     })
//     .filter((result) => {
//       const resultKey = Object.keys(result)[0]
//       return !resultKey.endsWith('--expiration')
//     })

//   // Prepare the response
//   const responseData: Array<Pick<Channel, 'name' | 'tags' | 'access'>> = []

//   if (filteredResultsArray.length > 0) {
//     await Promise.all(
//       filteredResultsArray.slice(0, 10).map(async (channelData) => {
//         // Get key-value pair data
//         const name = Object.keys(channelData)[0]
//         const id = channelData[name]

//         // Get the channel data
//         const channel = await getChannelById(id)

//         // Deconstruct channel data
//         const {
//           name: channelName,
//           tags: channelTags,
//           access: channelAccess,
//           ...rest
//         } = channel

//         // Push 'em to response data
//         channelData &&
//           responseData.push({
//             name: channelName,
//             tags: channelTags,
//             access: channelAccess,
//           })
//       }),
//     )
//   }

//   return responseData
// }
