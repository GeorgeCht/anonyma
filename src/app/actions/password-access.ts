'use server'

import { db } from '@/lib/db'
import { userSession as session } from './session'
import { encrypt } from '@/lib/utils'
import { ZodError } from 'zod'
import { channelPasswordSchema } from '@/lib/validators'
import { getChannelById } from './get-channel-by-id'

class CustomError<T = string> extends Error {
  constructor(message: T) {
    super(message as string)
    this.name = 'CustomError'
  }
}

export type ChannelPasswordResponse = {
  channelId: string
  channelName: string
  password: string | null
}

export async function channelPasswordAccess(
  prevState: ExtendedActionResponseState<ChannelPasswordResponse>,
  data: FormData,
) {
  try {
    const { channelId, password } = channelPasswordSchema.parse({
      channelId: data.get('channelId') as string,
      password: data.get('password') as string,
    })

    // Get user session
    const userSession = await session.get()
    if (!(await session.validate()))
      throw new CustomError('Unauthorized session. Please try again.')

    // Auth user session via db
    const user = await db.get<User>(`user:${userSession.id}`)
    if (!(await session.authenticate()) || !user)
      throw new CustomError('Unauthorized session. Please try again.')

    // Check if password is valid
    if (!password || password.length < 4)
      throw new CustomError('Invalid password.')

    // Prepare encrypted password for check
    const encryptedPassword = encrypt(password, {
      withServerVector: true,
    })

    // Get channel data
    const channelData = await getChannelById(channelId)
    if (!channelData) throw new CustomError('Invalid channel.')

    // Compare input password with db password
    if (channelData.password !== encryptedPassword)
      throw new CustomError('Invalid password.')

    return {
      status: 'success',
      response: {
        channelId: channelId,
        channelName: channelData.name,
        password: encryptedPassword,
      } as ChannelPasswordResponse,
      message: 'Access granted.',
    } as ExtendedActionResponseState<ChannelPasswordResponse>
  } catch (error) {
    return error instanceof ZodError
      ? ({
          status: 'error',
          message: 'Invalid data.',
          errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        } as ExtendedActionResponseState<ChannelPasswordResponse>)
      : error instanceof CustomError
        ? ({
            status: 'error',
            message: error.message,
          } as ExtendedActionResponseState<ChannelPasswordResponse>)
        : ({
            status: 'error',
            message: 'Something went wrong. Please try again.',
          } as ExtendedActionResponseState<ChannelPasswordResponse>)
  }
}
