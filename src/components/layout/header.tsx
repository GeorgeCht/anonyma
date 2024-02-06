'use client'

import React, {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  Suspense,
} from 'react'

import Opaque from '../motion/opaque'
import Logo from '@/components/ui/elements/logo'
import Button from '@/components/ui/elements/button'
import KeyboardKeys from '@/components/ui/elements/keyboard-keys'
import clsx from 'clsx'

import { Input } from '@/components/shadcn/input'
import { AnimatePresence } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useHeaderReducer } from '@/components/reducers/header.reducer'
import { useDebouncedCallback } from 'use-debounce'
import { useKeyboardShortcut } from '@/lib/hooks'

const Header = () => {
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState('')
  const [headerColor, setHeaderColor] = useState<'transparent' | 'dark'>(
    'transparent',
  )
  const [headerState, headerDispatch] = useHeaderReducer()

  const isMac =
    typeof window !== 'undefined'
      ? navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
      : false

  // Set header UI state
  useEffect(() => {
    if (pathname === '/') {
      setHeaderColor('transparent')
      headerDispatch({ type: 'SET_LOGO', payload: true })
      headerDispatch({ type: 'SET_LOGO_THEME', payload: 'light' })
      headerDispatch({ type: 'SET_MIDDLE_STATE', payload: 'empty' })
      headerDispatch({ type: 'SET_RIGHTSIDE', payload: false })
    }

    if (pathname.startsWith('/browse')) {
      setHeaderColor('dark')
      headerDispatch({ type: 'SET_LOGO', payload: true })
      headerDispatch({ type: 'SET_LOGO_THEME', payload: 'light' })
      headerDispatch({ type: 'SET_MIDDLE_STATE', payload: 'search' })
      headerDispatch({ type: 'SET_RIGHTSIDE', payload: true })
    }

    if (pathname.startsWith('/config')) {
      setHeaderColor('dark')
      headerDispatch({ type: 'SET_LOGO', payload: true })
      headerDispatch({ type: 'SET_LOGO_THEME', payload: 'light' })
      headerDispatch({ type: 'SET_MIDDLE_STATE', payload: 'inner-page' })
      headerDispatch({ type: 'SET_RIGHTSIDE', payload: false })
    }

    if (pathname.startsWith('/auth')) {
      setHeaderColor('dark')
      headerDispatch({ type: 'SET_LOGO', payload: true })
      headerDispatch({ type: 'SET_LOGO_THEME', payload: 'dark' })
      headerDispatch({ type: 'SET_MIDDLE_STATE', payload: 'empty' })
      headerDispatch({ type: 'SET_RIGHTSIDE', payload: false })
    }

    if (pathname.startsWith('/c/')) {
      setHeaderColor('dark')
      headerDispatch({ type: 'SET_LOGO', payload: true })
      headerDispatch({ type: 'SET_LOGO_THEME', payload: 'light' })
      headerDispatch({ type: 'SET_MIDDLE_STATE', payload: 'inner-page' })
      headerDispatch({ type: 'SET_RIGHTSIDE', payload: true })
    }
  }, [pathname])

  // Ctrl + K shortcut handler
  useKeyboardShortcut(['ctrl', 'k'], () => {
    searchRef.current?.focus()
    searchRef.current?.select()
  })

  // Ctrl + , shortcut handler
  useKeyboardShortcut(['ctrl', ','], () => {
    const dialogueElement = document.querySelector('[role="dialog"]')
    dialogueElement !== null ||
      document.getElementById('trigger--settings-dialog')?.click()
  })

  // Alt + n shortcut handler
  useKeyboardShortcut(['shift', 'n'], () => {
    const dialogueElement = document.querySelector('[role="dialog"]')
    dialogueElement !== null ||
      document.getElementById('trigger--new-channel-dialog')?.click()
  })

  // Alt + s shortcut handler
  useKeyboardShortcut(['alt', 's'], () => {
    const dialogueElement = document.querySelector('[role="dialog"]')
    dialogueElement !== null ||
      document.getElementById('trigger--share-dialog')?.click()
  })

  // Resets form value based on search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchValue = params.get('search') || ''
    setSearchTerm(searchValue)
  }, [])

  const handleSearch = useDebouncedCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams)
      const value = term.trim()
      value ? params.set('search', term) : params.delete('search')
      replace(`${pathname}?${params.toString()}`)
    },
    searchTerm.length >= 3 ? 666 : 0,
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    handleSearch(value)
  }

  return (
    <Suspense fallback={null}>
      <header
        className={clsx(
          headerColor === 'dark' && 'bg-dark',
          headerColor === 'transparent' && 'bg-transparent',
          'flex sticky w-full top-0 items-center px-4 md:px-6 py-3 z-50 transition-all *:relative *:h-[46px]',
        )}
      >
        {/* 1st Div - Logo */}
        <div className={'flex flex-1'}>
          <AnimatePresence initial={false}>
            <Opaque>
              {headerState.logo ? (
                <Opaque key={0}>
                  <Logo state={headerState.logoTheme} key={0} />
                </Opaque>
              ) : (
                <Opaque key={1}>
                  <Logo state={headerState.logoTheme} key={1} />
                </Opaque>
              )}
            </Opaque>
          </AnimatePresence>
        </div>

        {/* 2nd Div - Center Content */}
        <div
          className={
            'hidden md:flex mx-auto items-center sm:w-prefered w-full flex-1 md:flex-none'
          }
        >
          <AnimatePresence initial={false}>
            {headerState.middle === 'inner-page' && (
              <Opaque key={0}>
                <div className={'w-prefered hidden lg:flex'}>
                  <Button
                    size={'4xl'}
                    variant={'ghost'}
                    className={'-mt-[19px] absolute'}
                    onClick={() => router.push('/browse')}
                  >
                    ←
                  </Button>
                </div>
              </Opaque>
            )}
            {headerState.middle === 'search' && (
              <Opaque key={1}>
                <div
                  className={
                    'hidden lg:flex gap-1 w-prefered relative rounded-[8px] border border-light/10 overflow-hidden bg-gray/35 hover:bg-gray/50 transition-colors'
                  }
                >
                  <Input
                    ref={searchRef}
                    type={'text'}
                    placeholder={'Search here...'}
                    onChange={handleChange}
                    value={searchTerm}
                    hasOutline={false}
                    className={
                      'w-full relative bg-dark text--mono-base text-light border-0 outline-none bg-transparent focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-0'
                    }
                  />
                  <KeyboardKeys
                    className={'min-[1280px]:flex hidden pr-2'}
                    keys={[isMac ? 'Cmd' : 'Ctrl', '+', 'K']}
                  />
                </div>
              </Opaque>
            )}
            {headerState.middle === 'empty' || (
              <Opaque key={2}>
                <React.Fragment />
              </Opaque>
            )}
          </AnimatePresence>
        </div>

        {/* 3rd Div - Action Button */}
        <div className={'hidden md:flex flex-1 items-center justify-end'}>
          <AnimatePresence initial={false}>
            {headerState.rightside ? (
              <Opaque key={0}>
                <div className={'flex justify-end items-center flex-row gap-4'}>
                  <KeyboardKeys
                    className={'min-[1280px]:flex hidden'}
                    keys={['Shft', '+', 'N']}
                  />
                  <Button
                    className={'hidden lg:inline-flex'}
                    intent={'fit'}
                    onClick={() => {
                      document
                        .getElementById('trigger--new-channel-dialog')
                        ?.click()
                    }}
                  >
                    Create channel
                  </Button>
                </div>
              </Opaque>
            ) : (
              <Opaque key={1}>
                <React.Fragment />
              </Opaque>
            )}
          </AnimatePresence>
        </div>
      </header>
    </Suspense>
  )
}

export default Header
