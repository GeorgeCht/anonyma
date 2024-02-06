'use server'

import { db } from '@/lib/db'
import { uniqueId, timestampToHours } from '@/lib/utils'
import { ZodError } from 'zod'
import permanentChannels from '@/lib/permanent_channels.json'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export async function initPermanentChannel(authkey: string) {
  try {
    // Validate authKey
    if (authkey !== process.env.CONFIG_KEY)
      throw new CustomError('Unauthorized action.')

    // Loop every perma channel data
    permanentChannels.forEach(async (permaChannel) => {
      // Check if channel name is available
      if (await db.hexists('channel_index', permaChannel.title.toLowerCase()))
        throw new CustomError('A channel with this name already exists.')

      // Init id value
      const channelId = uniqueId()

      // Create channel data
      const channel = {
        id: channelId,
        name: permaChannel.title.toLowerCase(),
        announcement: (
          process.env.PERMANENT_CHANNEL_ANNOUNCEMENT as string
        ).replace(
          '{{EXPIRATION}}',
          timestampToHours(eval(process.env.EXPIRATION) as number),
        ),
        createdBy: `00000000000000000000000000000000`,
        password: '',
        access: 'public',
        tags: permaChannel.tags,
      } satisfies Channel

      // For each tag, add it to sorted set in db
      permaChannel.tags.length > 0 &&
        permaChannel.tags.forEach(async (tag) => {
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
        db.hset('channel_index', {
          [permaChannel.title.toLowerCase()]: channelId,
        }),
      ])
    })

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
