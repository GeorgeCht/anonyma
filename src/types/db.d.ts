interface User {
  id: string
  name: string
  token: string
  channels: number
}

interface Channel {
  id: string
  name: string
  announcement: string
  createdBy: string
  password: string
  vector: string
  access: 'private' | 'public'
  tags?: Array<string>
}

interface Message {
  id: string
  senderId: string
  senderUsername: string
  message: string
  timestamp: number
}
