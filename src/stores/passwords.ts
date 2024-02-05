import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ChannelPasswords = {
  channelId: string
  password: string
}

interface PasswordState {
  entries: Array<ChannelPasswords>
  addPassword: (entry: ChannelPasswords) => void
  findEntry: (channelId: string) => ChannelPasswords | undefined
  entryExists: (channelId: string) => boolean
}

export type InitialPasswordsState = Pick<PasswordState, 'entries'>

export const initialState: InitialPasswordsState = {
  entries: [],
}

const usePasswords = create(
  persist<PasswordState>(
    (set, get) => ({
      ...initialState,
      addPassword: (entry) =>
        set((state) => ({ entries: [...state.entries, entry] })),
      findEntry: (channelId) =>
        get().entries.find((entry) => entry.channelId === channelId),
      entryExists: (channelId) =>
        get().entries.some((entry) => entry.channelId === channelId),
    }),
    {
      name: 'passwords',
    },
  ),
)

export default usePasswords
