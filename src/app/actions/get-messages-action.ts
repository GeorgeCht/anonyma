'use server'

import { db } from '@/lib/db'
import { decrypt, filterUnsentMessages, getFromAndTo } from '@/lib/utils'

export async function getChatMessagesExperimentalAction(
  channelId: string,
  page: number
): Promise<Array<Message>> {
  const { from, to } = getFromAndTo(
    page - 1,
    process.env.NEXT_PUBLIC_LIMIT_MESSAGES as number
  )
  try {
    // Get messages via channel id
    const results = await db.zrange<Array<Message>>(
      `channel:${channelId}:messages`,
      from,
      to,
      { rev: true }
    )

    // Decrypt each message if not empty
    const messages = results.map((message) => {
      if (message.message === '') {
        return {
          id: message.id,
          senderId: message.senderId,
          senderUsername: message.senderUsername,
          message: '',
          timestamp: message.timestamp,
        } as Message
      }
      return {
        id: message.id,
        senderId: message.senderId,
        senderUsername: message.senderUsername,
        message: decrypt(message.message, {
          withServerVector: true,
        }),
        timestamp: message.timestamp,
      } as Message
    })

    return messages.reverse()
  } catch (error) {
    throw new Error('Unable to fetch messages.')
  }
}

export async function getChatInitialMessages(
  channelId: string
): Promise<Array<Message>> {
  try {
    // Get messages via channel id
    const results = await db.zrange<Array<Message>>(
      `channel:${channelId}:messages`,
      0,
      process.env.NEXT_PUBLIC_LIMIT_MESSAGES as number,
      { rev: true }
    )

    // Decrypt each message if not empty
    const messages = results.map((message) => {
      if (message.message === '') {
        return {
          id: message.id,
          senderId: message.senderId,
          senderUsername: message.senderUsername,
          message: '',
          timestamp: message.timestamp,
        } as Message
      }
      return {
        id: message.id,
        senderId: message.senderId,
        senderUsername: message.senderUsername,
        message: decrypt(message.message, {
          withServerVector: true,
        }),
        timestamp: message.timestamp,
      } as Message
    })

    return messages.reverse()
  } catch (error) {
    throw new Error('Unable to fetch messages.')
  }
}
