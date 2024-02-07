// eslint-disable-next-line no-unused-vars
interface User {
  id: string
  name: string
  token: string
  channels: number
}

// eslint-disable-next-line no-unused-vars
interface Channel {
  id: string
  name: string
  announcement: string
  createdBy: string
  password: string
  access: 'private' | 'public'
  tags?: Array<string>
}

// eslint-disable-next-line no-unused-vars
interface ChannelIndexHash {
  id: string
  timestamp: number
}

// eslint-disable-next-line no-unused-vars
interface Message {
  id: string
  senderId: string
  senderUsername: string
  message: string
  timestamp: number
  delivered: boolean
}
