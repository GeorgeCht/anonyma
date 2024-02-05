'use server'

import { db } from '@/lib/db'
import { userSession } from './session'

export async function authUser(userData: User) {
  const user = await db.get<User>(`user:${userData.id}`)
  if (user && user.token === userData.token) {
    const expiration: number = eval(process.env.EXPIRATION!)
    await userSession.set({
      id: userData.id,
      name: user.name,
      token: user.token,
      authStatus: true,
      expiresAt: Date.now() + expiration * 1000,
    })
    return user as User
  } else {
    return null
  }
}
