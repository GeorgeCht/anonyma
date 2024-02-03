import { create } from 'zustand'

interface MessageState {
  channelId: string | undefined
  hasMore: boolean
  page: number
  messages: Array<Message>
  actionMessage: Message | undefined
  addMessage: (message: Message) => void
  setActionMessage: (message: Message | undefined) => void
  setMessages: (messages: Array<Message>) => void
  switchChannel: (channelId: string | undefined) => void
  resetState: () => void
}

export type InitialMessagesState = Pick<
  MessageState,
  'hasMore' | 'page' | 'messages' | 'actionMessage' | 'channelId'
>

export const initialState: InitialMessagesState = {
  hasMore: true,
  page: 1,
  messages: [],
  channelId: undefined,
  actionMessage: undefined,
}

const useMessages = create<MessageState>()((set) => ({
  ...initialState,
  switchChannel: (channelId) => set(() => ({ channelId })),
  resetState: () => set(() => initialState),
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= process.env.NEXT_PUBLIC_LIMIT_MESSAGES,
    })),
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
    })),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
}))

export default useMessages
