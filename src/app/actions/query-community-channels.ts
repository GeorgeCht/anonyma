'use server'

import { db } from '@/lib/db'
import { getChannelById } from './get-channel-by-id'
import permanentChannels from '@/lib/permanent_channels.json'

export const queryCommunityChannels = async () => {
  const rawResults = await db.hgetall<Record<string, string>>('channel_index')
  if (!rawResults) return []
  const resultsArray: Array<{ [key: string]: string }> = Object.entries(
    rawResults,
  ).map(([key, value]) => ({
    [key]: value,
  }))

  // Get the permanent channel names
  const permanentChannelNames = permanentChannels.map(
    (channel) => channel.title,
  )

  // Filter out permanent channels and '--expiration'
  const filteredResultsArray = resultsArray
    .filter((result) => {
      const resultKey = Object.keys(result)[0]
      return !permanentChannelNames.includes(resultKey)
    })
    .filter((result) => {
      const resultKey = Object.keys(result)[0]
      return !resultKey.endsWith('--expiration')
    })

  // Prepare the response
  const responseData: Array<Pick<Channel, 'name' | 'tags' | 'access'>> = []

  if (filteredResultsArray.length > 0) {
    await Promise.all(
      filteredResultsArray.slice(0, 10).map(async (channelData) => {
        // Get key-value pair data
        const name = Object.keys(channelData)[0]
        const id = channelData[name]

        // Get the channel data
        const channel = await getChannelById(id)
        if (!channel || channel.status === 'error') return []

        // Deconstruct channel data
        const {
          name: channelName,
          tags: channelTags,
          access: channelAccess,
          ...rest
        } = channel.response

        // Push 'em to response data
        channelData &&
          responseData.push({
            name: channelName,
            tags: channelTags,
            access: channelAccess,
          })
      }),
    )
  }

  return responseData
}
