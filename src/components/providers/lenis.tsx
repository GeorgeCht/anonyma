'use client'

// @ts-expect-error
import Tempus from '@studio-freight/tempus'
import Lenis from '@studio-freight/lenis'
import router from 'next/router'
import { createContext, useContext, useLayoutEffect, useState } from 'react'

export const lenisCTX = createContext<Lenis | null>(null)
export const useLenis = () => useContext(lenisCTX)

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useLayoutEffect(() => {
    const lenis = new Lenis()

    setLenis(lenis)
    const resize = setInterval(() => {
      lenis.resize()
    }, 150)
    function onFrame(time: number) {
      lenis.raf(time)
    }
    const unsubscribe = Tempus.add(onFrame)

    router.events.on('routeChangeStart', () => {
      lenis.scrollTo(0, { immediate: true })
    })

    return () => {
      unsubscribe()
      clearInterval(resize)
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return (
    <lenisCTX.Provider value={lenis} data-lenis-prevent>
      {children}
    </lenisCTX.Provider>
  )
}
