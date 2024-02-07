'use server'

import { db } from '@/lib/db'
import { userSession as session } from './session'
import { ZodError } from 'zod'
import { sendMessageSchema } from '@/lib/validators'
import { toPusherKey } from '@/lib/utils'
import { encrypt } from '@/lib/utils'
import { pusherServer } from '@/lib/pusher'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export async function sendMessage(
  prevState: ActionResponseState,
  data: FormData,
) {
  try {
    const { channelId, messageId, message, senderId, senderUsername } =
      sendMessageSchema.parse({
        channelId: data.get('channelId') as string,
        messageId: data.get('messageId') as string,
        senderId: data.get('senderId') as string,
        senderUsername: data.get('senderUsername') as string,
        message: data.get('message') as string,
      })

    const timestampScore = Date.now()

    // Get user session
    const userSession = await session.get()
    if (!(await session.validate()))
      throw new CustomError('Unauthorized session. Please try again.')

    // Auth user session via db
    const user = await db.get<User>(`user:${userSession.id}`)
    if (!(await session.authenticate()) || !user)
      throw new CustomError('Unauthorized session. Please try again.')

    // Auth user with client session
    if (userSession.id !== senderId || userSession.name !== senderUsername)
      throw new CustomError('Unauthorized action. Client session missmatch.')

    // Encrypt message
    const encryptedMessage = encrypt(message, {
      withServerVector: true,
    })

    // Mutate message data
    const mutatedData = {
      id: messageId,
      senderId: userSession.id,
      senderUsername: userSession.name,
      message: encryptedMessage,
      timestamp: timestampScore,
      delivered: true,
    } satisfies Message

    // Prepare data for pusher
    const messageData = {
      id: messageId,
      senderId: userSession.id,
      senderUsername: userSession.name,
      message: message,
      timestamp: timestampScore,
      delivered: true,
    } satisfies Message

    // Notify messages to subscribed users
    await pusherServer.trigger(
      toPusherKey(`channel:${channelId}:messages`),
      'message',
      messageData,
    )

    // Persist message data in db
    await db.zadd(`channel:${channelId}:messages`, {
      score: timestampScore,
      member: JSON.stringify(mutatedData),
    })

    return {
      status: 'success',
      message: 'Message sent.',
    } as ActionResponseState
  } catch (error) {
    return error instanceof ZodError
      ? ({
          status: 'error',
          message: "Can't send this.",
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
