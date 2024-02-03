import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Size = 'sm' | 'md' | 'lg'

export type Theme =
  | 'anonyma-amber'
  | 'neon-darkness'
  | 'vanta-black'
  | 'jaded-cyan'

export const themesArray = [
  'anonyma-amber',
  'neon-darkness',
  'vanta-black',
  'jaded-cyan',
] satisfies Array<Theme>

interface SettingsState {
  prefersViewSize: Size
  prefersTextSize: Size
  prefersTheme: Theme
  displayChannelTags: boolean
  profanityFilter: boolean
  pinAnnouncement: boolean
  themesArray: Array<Theme>
  setTheme: (value: Theme) => void
  setViewSize: (value: Size) => void
  setTextSize: (value: Size) => void
  setDisplayChannelTags: (value: boolean) => void
  setProfanityFilter: (value: boolean) => void
  setPinAnnouncement: (value: boolean) => void
  setAllOptions: (value: Partial<InitialSettingsState>) => void
  setToDefault: () => void
}

export type InitialSettingsState = Pick<
  SettingsState,
  | 'prefersViewSize'
  | 'prefersTextSize'
  | 'prefersTheme'
  | 'pinAnnouncement'
  | 'profanityFilter'
  | 'displayChannelTags'
  | 'themesArray'
>

export const initialState: InitialSettingsState = {
  prefersTheme: 'anonyma-amber',
  prefersViewSize: 'sm',
  prefersTextSize: 'md',
  displayChannelTags: true,
  profanityFilter: false,
  pinAnnouncement: true,
  themesArray: themesArray,
}

const useSettings = create(
  persist<SettingsState>(
    (set, get) => ({
      ...initialState,
      setTheme: (value: Theme) => set({ prefersTheme: value }),
      setViewSize: (value: Size) => set({ prefersViewSize: value }),
      setTextSize: (value: Size) => set({ prefersTextSize: value }),
      setDisplayChannelTags: (value: boolean) =>
        set({ displayChannelTags: value }),
      setProfanityFilter: (value: boolean) => set({ profanityFilter: value }),
      setPinAnnouncement: (value: boolean) => set({ pinAnnouncement: value }),
      setAllOptions: (values: Partial<InitialSettingsState>) => {
        set({ displayChannelTags: values.displayChannelTags })
        set({ profanityFilter: values.profanityFilter })
        set({ pinAnnouncement: values.pinAnnouncement })
      },
      setToDefault: () => set(initialState),
    }),
    {
      name: 'settings',
    },
  ),
)

export default useSettings
