'use server'

import { db } from '@/lib/db'
import { userSession as session } from './session'
import { getChannelById } from './get-channel-by-id'
import { ChannelPasswords } from '@/stores/passwords'

export async function authChannelPassword(data: ChannelPasswords) {
  try {
    const { channelId, password } = data

    // Get user session
    const userSession = await session.get()
    if (!(await session.validate())) return null

    // Auth user session via db
    const user = await db.get<User>(`user:${userSession.id}`)
    if (!(await session.authenticate()) || !user) return null

    // Check if password is valid
    if (!password || password.length < 4) return null

    // Get channel data
    const channelData = await getChannelById(channelId)
    if (!channelData) return null

    // Compare input password with db password
    if (channelData.password !== password) return null

    return true
  } catch (error) {
    return false
  }
}
