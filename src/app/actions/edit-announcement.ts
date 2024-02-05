'use server'

import { db } from '@/lib/db'
import { userSession as session } from './session'
import { ZodError } from 'zod'
import { editAnnouncementSchema } from '@/lib/validators'
import { getChannelByName } from './get-channel-by-name'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export async function editAnnouncement(
  prevState: ActionResponseState,
  data: FormData,
) {
  try {
    const { name, announcement } = editAnnouncementSchema.parse({
      name: data.get('name') as string,
      announcement: data.get('announcement') as string,
    })

    // Get user session
    const userSession = await session.get()
    if (!(await session.validate()))
      throw new CustomError('Unauthorized session. Please try again.')

    // Auth user session via db
    const user = await db.get<User>(`user:${userSession.id}`)
    if (!(await session.authenticate()) || !user)
      throw new CustomError('Unauthorized session. Please try again.')

    // Get channel data
    const channelResult = await getChannelByName(name)
    const channelData =
      channelResult?.status === 'success' ? channelResult?.response : null

    if (!channelData) throw new CustomError('Channel not found.')

    // Validate user is the creator of the channel
    if (channelData!.createdBy !== userSession.id)
      throw new CustomError(
        'Unauthorized action. You cannot edit this channel.',
      )

    // Desconstruct data
    const { announcement: prevAnnouncement, ...channel } = channelData

    // Mutate channel data
    const mutatedChannel = {
      id: channel.id,
      name: channel.name,
      announcement: announcement,
      createdBy: channel.createdBy,
      password: channel.password,
      access: channel.access,
      tags: channel.tags,
    } satisfies Channel

    // Update channel data in db
    await Promise.all([
      db.set(`channel:${channel.id}`, JSON.stringify(mutatedChannel)),
    ])

    return {
      status: 'success',
      message: 'Announcement updated.',
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
