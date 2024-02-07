import { db } from '@/lib/db'
import { decrypt } from '@/lib/utils'

export async function getChatMessages(channelId: string) {
  try {
    // Get messages via channel id
    const results = await db.zrange<Array<Message>>(
      `channel:${channelId}:messages`,
      0,
      -1,
    )

    // Decrypt each message
    const messages = results.map((message) => {
      let decryptedMessage = decrypt(message.message, {
        withServerVector: true,
      })
      return {
        id: message.id,
        senderId: message.senderId,
        senderUsername: message.senderUsername,
        message: decryptedMessage,
        timestamp: message.timestamp,
        delivered: message.delivered,
      } satisfies Message
    })

    // TODO: Validate the message array (?)
    // const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages
  } catch (error) {
    console.log(error)
    throw new Error('Unable to fetch messages.')
  }
}

export async function getChatMessagesExperimental(
  channelId: string,
  from: number = 0,
  to: number = -1,
): Promise<Array<Message>> {
  try {
    // Get messages via channel id
    const results = await db.zrange<Array<Message>>(
      `channel:${channelId}:messages`,
      from,
      to,
    )

    // Decrypt each message
    const messages = results.map((message) => {
      let decryptedMessage = decrypt(message.message, {
        withServerVector: true,
      })
      return {
        id: message.id,
        senderId: message.senderId,
        senderUsername: message.senderUsername,
        message: decryptedMessage,
        timestamp: message.timestamp,
        delivered: message.delivered,
      } satisfies Message
    })

    return messages
  } catch (error) {
    console.log(error)
    throw new Error('Unable to fetch messages.')
  }
}
