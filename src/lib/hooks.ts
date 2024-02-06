import { useEffect } from 'react'

type Key = 'ctrl' | 'shift' | 'alt' | string

export const useKeyboardShortcut = (keys: Key[], callback: () => void) => {
  const isMac =
    typeof window !== 'undefined'
      ? navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
      : false

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        keys.every(
          (key) =>
            (key === 'ctrl' && (isMac ? event.metaKey : event.ctrlKey)) ||
            (key === 'shift' && event.shiftKey) ||
            (key === 'alt' &&
              (isMac ? event.altKey : event.key.toLowerCase() === 'alt')) ||
            (typeof key === 'string' && event.key.toLowerCase() === key),
        )
      ) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [keys, callback])
}
