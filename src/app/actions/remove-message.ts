'use server'

import { db } from '@/lib/db'
import { userSession as session } from './session'
import { ZodError } from 'zod'
import { toPusherKey, uniqueId } from '@/lib/utils'
import { encrypt } from '@/lib/utils'
import { pusherServer } from '@/lib/pusher'
import { messageSchema } from '@/lib/validators'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export async function removeMessage(
  prevState: ActionResponseState,
  data: FormData
) {
  try {
    const { id, senderId, senderUsername, message, timestamp, channelId } =
      messageSchema.parse({
        id: data.get('id') as string,
        senderId: data.get('senderId') as string,
        senderUsername: data.get('senderUsername') as string,
        message: data.get('message') as string,
        timestamp: parseInt(data.get('timestamp') as string),
        channelId: data.get('channelId') as string,
      })

    // Confirm timestamp difference
    const timestampScore = Date.now()
    if (timestampScore < timestamp) {
      throw new CustomError('Unable to remove this.')
    }

    // Get user session
    const userSession = await session.get()
    if (!(await session.validate()))
      throw new CustomError('Unauthorized action.')

    // Auth user session via db
    const user = await db.get<User>(`user:${userSession.id}`)
    if (!(await session.authenticate()) || !user)
      throw new CustomError('Unauthorized action.')

    // Confirm message owner
    if (senderId !== userSession.id)
      throw new CustomError('Unauthorized action.')

    // Mutate message data
    const mutatedData = {
      id: id,
      senderId: senderId,
      senderUsername: senderUsername,
      message: '',
      timestamp: timestamp,
    } satisfies Message

    // Prepare data for pusher
    const messageData = {
      id: id,
      senderId: senderId,
      senderUsername: senderUsername,
      message: '',
      timestamp: timestamp,
    } satisfies Message

    // Notify removed message to subscribed users
    pusherServer.trigger(
      toPusherKey(`channel:${channelId}:messages`),
      'message',
      messageData
    )

    // Persist message data in db
    await db.zadd(`channel:${channelId}:messages`, {
      score: timestamp,
      member: JSON.stringify(mutatedData),
    })

    return {
      status: 'success',
      message: 'Message removed.',
    } as ActionResponseState
  } catch (error) {
    return error instanceof ZodError
      ? ({
          status: 'error',
          message: "Can't remove this.",
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
