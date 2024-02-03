import { db } from '@/lib/db'
import { encrypt } from '@/lib/utils'
import { defaultSession, sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const userSession = {
  async get() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    !session.authStatus && Object.assign(session, defaultSession)
    return session
  },

  async set(data: SessionData) {
    const session = await this.get()
    Object.assign(session, data)
    await session.save()
    revalidatePath('/browse')
    return session
  },

  async validate() {
    const session = await this.get()
    return session.expiresAt - Date.now() > 0 && session.authStatus
  },

  async authenticate() {
    const session = await this.get()
    const user = await db.get<User>(`user:${session.id}`)
    return !user ||
      user.token !== session.token ||
      encrypt(user.name, { withServerVector: true }) !== session.token
      ? false
      : true
  },

  async destroy() {
    const session = await this.get()
    session.destroy()
  },
}
