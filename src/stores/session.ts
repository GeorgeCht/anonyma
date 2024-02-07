import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ClientSessionState {
  id: string | null
  name: string | null
  setSessionId: (id: string) => void
  setSessionName: (name: string) => void
  setSession: (id: string, name: string) => void
  destroySession: () => void
}

export type InitialClientSessionState = Pick<ClientSessionState, 'id' | 'name'>

export const initialState: InitialClientSessionState = {
  id: null,
  name: null,
}

const useClientSession = create(
  persist<ClientSessionState>(
    (set, get) => ({
      ...initialState,
      setSessionId: (id) => set(() => ({ id })),
      setSessionName: (name) => set(() => ({ name })),
      setSession: (id, name) => set(() => ({ id, name })),
      destroySession: () => set(() => ({ ...initialState })),
    }),
    {
      name: 'session',
    },
  ),
)

export default useClientSession
