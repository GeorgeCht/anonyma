'use server'

import { db } from '@/lib/db'
import { userSession as session } from './session'
import { ZodError } from 'zod'
import { editChannelTagsSchema } from '@/lib/validators'
import { getChannelById } from './get-channel-by-id'

import permanentTags from '@/lib/permanent_tags.json'
import { compareTags } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export async function editTags(prevState: ActionResponseState, data: FormData) {
  try {
    const { channelId, tags } = editChannelTagsSchema.parse({
      channelId: data.get('channelId') as string,
      tags: data.get('tags') as string,
    })

    // Get tags as array
    const newTags = tags?.length! > 0 ? tags?.split(',') || [''] : []

    // Get user session
    const userSession = await session.get()
    if (!(await session.validate()))
      throw new CustomError('Unauthorized session. Please try again.')

    // Auth user session via db
    const user = await db.get<User>(`user:${userSession.id}`)
    if (!(await session.authenticate()) || !user)
      throw new CustomError('Unauthorized session. Please try again.')

    // Get channel data
    const channelData = await getChannelById(channelId)
    if (!channelData || channelData.status === 'error')
      throw new CustomError('Channel not found.')

    // Validate user is the creator of the channel
    if (channelData.response.createdBy !== userSession.id)
      throw new CustomError(
        'Unauthorized action. You cannot edit this channel.',
      )

    // Desconstruct channel data
    const { tags: oldTags, ...channel } = channelData.response

    // Get tag actions
    const actions = compareTags(oldTags!, newTags)

    if (!actions)
      return {
        status: 'success',
        message: 'Nothing to update.',
      } as ActionResponseState

    // Mutate channel data with new tags
    const mutatedChannel = {
      id: channel.id,
      name: channel.name,
      announcement: channel.announcement,
      createdBy: channel.createdBy,
      password: channel.password,
      access: channel.access,
      tags: newTags,
    } satisfies Channel

    // Persist channel data in db
    await Promise.all([
      db.set(`channel:${channel.id}`, JSON.stringify(mutatedChannel)),
    ])

    // Expire all tags that need to be removed
    actions.tagsToDelete.length > 0 &&
      actions.tagsToDelete.forEach(async (tag) => {
        // If tag isn't a permanent tag
        !permanentTags.some((permanentTag) => tag.includes(permanentTag)) &&
          (await db.expire(
            `tag:${tag.toLowerCase()}`,
            eval(process.env.EXPIRATION) as number,
          ))
      })

    // Create new tags
    actions.tagsToCreate.length > 0 &&
      actions.tagsToCreate.forEach(async (tag) => {
        await db.zadd(`tag:${tag.toLowerCase()}`, {
          score: Date.now(),
          member: channelId,
        })
      })

    // Purge cached data
    revalidatePath(`/c/${channelData.response.name}`)

    return {
      status: 'success',
      message: 'Tags updated.',
    } as ActionResponseState
  } catch (error) {
    return error instanceof ZodError
      ? ({
          status: 'error',
          message: 'Invalid data.',
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
