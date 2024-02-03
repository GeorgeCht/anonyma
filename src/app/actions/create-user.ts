'use server'

import { db } from '@/lib/db'
import { encrypt } from '@/lib/utils'
import { uniqueId, uniqueUsername } from '@/lib/utils'

export async function createUser() {
  const username = uniqueUsername()
  const token = encrypt(username, { withServerVector: true })
  const user = {
    id: uniqueId(),
    name: username,
    token: token,
    channels: 0,
  } satisfies User

  const { id, ...userData } = user
  const response = await db.set(`user:${id}`, JSON.stringify(userData), {
    ex: eval(process.env.EXPIRATION!) as number,
  })
  return response ? (user as User) : null
}
