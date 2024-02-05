'use server'

import { db } from '@/lib/db'
import { uniqueId, timestampToHours } from '@/lib/utils'
import { createPermaChannelSchema } from '@/lib/validators'
import { ZodError } from 'zod'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export async function createPermanentChannel(
  prevState: ActionResponseState,
  data: FormData,
) {
  try {
    const { authkey, name, tags } = createPermaChannelSchema.parse({
      authkey: data.get('authkey') as string,
      name: data.get('name') as string,
      tags: data.get('tags') as string,
    })

    // Validate authKey
    if (authkey !== process.env.CONFIG_KEY)
      throw new CustomError('Unauthorized action.')

    // Check if channel name is available
    const channelExists = await db.hexists('channel_index', name.toLowerCase())
    if (channelExists)
      throw new CustomError('A channel with this name already exists.')

    // Init id value
    const channelId = uniqueId()

    // Get tags as array
    const tagsArray = tags?.length! > 0 ? tags?.split(',') || [''] : []

    // Create channel data
    const channel = {
      id: channelId,
      name: name.toLowerCase(),
      announcement: (
        process.env.PERMANENT_CHANNEL_ANNOUNCEMENT as string
      ).replace(
        '{{EXPIRATION}}',
        timestampToHours(eval(process.env.EXPIRATION) as number),
      ),
      createdBy: `00000000000000000000000000000000`,
      password: '',
      access: 'public',
      tags: tagsArray || [],
    } satisfies Channel

    // For each tag, add it to sorted set in db
    tagsArray.length > 0 &&
      tagsArray.forEach(async (tag) => {
        await db.zadd(`tag:${tag.toLowerCase()}`, {
          score: Date.now(),
          member: channelId,
        })
      })

    // Split channel data
    const { id, ...channelData } = channel

    // Persist data in db
    await Promise.all([
      db.set(`channel:${id}`, JSON.stringify(channelData)),
      db.hset('channel_index', { [name.toLowerCase()]: channelId }),
    ])

    return {
      status: 'success',
      message: 'Channel created.',
    } as ActionResponseState
  } catch (error) {
    return error instanceof ZodError
      ? ({
          status: 'error',
          message: 'Invalid form data.',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        } as ActionResponseState)
      : error instanceof CustomError
        ? ({
            status: 'error',
            message: error.message,
          } as ActionResponseState)
        : ({
            status: 'error',
            message: 'Something went wrong. Please try again.',
          } as ActionResponseState)
  }
}
