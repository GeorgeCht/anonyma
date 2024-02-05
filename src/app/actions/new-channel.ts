'use server'

import { db } from '@/lib/db'
import { uniqueId } from '@/lib/utils'
import { userSession as session } from './session'
import { encrypt } from '@/lib/utils'
import { ZodError } from 'zod'
import { newChannelSchema } from '@/lib/validators'

import permanentTags from '@/lib/permanent_tags.json'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export async function newChannel(
  prevState: ActionResponseState,
  data: FormData,
) {
  try {
    const { name, tags, password, access } = newChannelSchema.parse({
      name: data.get('name') as string,
      tags: data.get('tags') as string,
      password: data.get('password') as string | '',
      access: data.get('access') as string | 'public',
    })

    // Get tags as array
    const tagsArray = tags?.length! > 0 ? tags?.split(',') || [''] : []

    // Get access type
    const accessType = access === 'private' ? 'private' : 'public'

    // Init values
    let encryptedPassword = ''
    const channelId = uniqueId()

    // Get user session
    const userSession = await session.get()
    if (!(await session.validate()))
      throw new CustomError('Unauthorized session. Please try again.')

    // Auth user session via db
    const user = await db.get<User>(`user:${userSession.id}`)
    if (!(await session.authenticate()) || !user)
      throw new CustomError('Unauthorized session. Please try again.')

    // Check if user can create channel
    if (user.channels >= process.env.MAX_CHANNELS)
      throw new CustomError('Maximum number of channels created exceeded.')

    // Check if channel name is available
    const channelExists = await db.hexists('channel_index', name.toLowerCase())
    if (channelExists)
      throw new CustomError('A channel with this name already exists.')

    if (accessType === 'private') {
      // Check if password is valid
      if (!password || password.length < 4) return null
      const encryptedData = encrypt(password, {
        withServerVector: true,
      })
      encryptedPassword = encryptedData
    }

    // Create channel data
    const channel = {
      id: channelId,
      name: name.toLowerCase(),
      announcement: (
        process.env.DEFAULT_CHANNEL_ANNOUNCEMENT as string
      ).replace('{{USERNAME}}', userSession.name),
      createdBy: userSession.id,
      password: accessType === 'private' ? encryptedPassword : '',
      access: accessType,
      tags: tagsArray || [],
    } satisfies Channel

    // Update user data
    const { id, ...channelData } = channel
    const { channels, ...updatedUser } = user
    const updatedUserData = {
      ...updatedUser,
      channels: channels + 1,
    }

    // Create expiration timestamp
    const expirationDate = (Date.now() +
      (eval(process.env.EXPIRATION) as number)) as number

    // For each tag, persist it to sorted set and renew expiration
    tagsArray.length > 0 &&
      channelData.tags.forEach(async (tag) => {
        await db.zadd(`tag:${tag.toLowerCase()}`, {
          score: Date.now(),
          member: channelId,
        })

        !permanentTags.some((permanentTag) => tag.includes(permanentTag)) &&
          (await db.expire(
            `tag:${tag.toLowerCase()}`,
            eval(process.env.EXPIRATION) as number,
          ))
      })

    // Extra tag with channel name for searchability
    await db.zadd(`tag:${name.toLowerCase()}`, {
      score: Date.now(),
      member: channelId,
    })
    !permanentTags.some((permanentTag) =>
      name.toLowerCase().includes(permanentTag),
    ) &&
      (await db.expire(
        `tag:${name.toLowerCase()}`,
        eval(process.env.EXPIRATION) as number,
      ))

    await Promise.all([
      db.set(`channel:${id}`, JSON.stringify(channelData), {
        ex: eval(process.env.EXPIRATION) as number,
      }),
      db.set(`user:${userSession.id}`, JSON.stringify(updatedUserData), {
        ex: eval(process.env.EXPIRATION) as number,
      }),
      db.hset('channel_index', { [name.toLowerCase()]: channelId }),
      db.hset('channel_index', {
        [`${name.toLowerCase()}--expiration`]: expirationDate,
      }),
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
