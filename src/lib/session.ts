import { SessionOptions } from 'iron-session'

export const defaultSession: SessionData = {
  id: '',
  name: '',
  token: '',
  authStatus: false,
  expiresAt: 0,
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET,
  cookieName: 'ANONYMA_XYZ_SESSION_DATA',
  cookieOptions: {
    sameSite: 'lax',
    maxAge: process.env.EXPIRATION,
    secure: process.env.NODE_ENV === 'production',
  },
}
