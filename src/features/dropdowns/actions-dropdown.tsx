'use client'

import React, { useEffect, useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import KeyboardKeys from '@/components/ui/elements/keyboard-keys'
import useSettings from '@/stores/settings'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { isChannelCreator } from '@/app/actions/is-channel-creator'
import { toast } from 'sonner'

const ActionsDropdown = ({ children }: { children: React.ReactNode }) => {
  const { setTextSize, setViewSize, setTheme } = useSettings()
  const [isPending, startTransition] = useTransition()
  const [canEditChannel, setCanEditChannel] = useState(false)
  const [currentPage, setCurrentPage] = useState<
    'channel' | 'browse' | 'other'
  >('other')
  const pathname = usePathname()

  const isMac =
    typeof window !== 'undefined'
      ? navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
      : false

  useEffect(() => {
    setCurrentPage(
      pathname.startsWith('/browse')
        ? 'browse'
        : pathname.startsWith('/c/')
          ? 'channel'
          : 'other',
    )
  }, [pathname])

  useEffect(() => {
    pathname.startsWith('/c/') &&
      startTransition(async () => {
        try {
          const result = await isChannelCreator(pathname.substring(3))
          if (result === true) setCanEditChannel(true)
        } catch (error) {
          setCanEditChannel(false)
          toast.error(`Channel /${pathname.substring(3)} not found.`)
        }
      })
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={'w-56 bg-dark/70 border-light/10 backdrop-blur-xl'}
      >
        <DropdownMenuLabel
          className={'text--mono-caps-base text-light/30 pt-2 pb-3'}
        >
          Preferences
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Themes</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className={'bg-dark/70 border-light/10 backdrop-blur-xl'}
              >
                <DropdownMenuItem onClick={() => setTheme('anonyma-amber')}>
                  <span>Anonyma Amber</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('neon-darkness')}>
                  <span>Neon Darkness</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('vanta-black')}>
                  <span>Vanta Black</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('jaded-cyan')}>
                  <span>Jaded Cyan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    document.getElementById('trigger--settings-dialog')?.click()
                  }}
                >
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>Text Size</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className={'bg-dark/70 border-light/10 backdrop-blur-xl'}
              >
                <DropdownMenuItem onClick={() => setTextSize('lg')}>
                  <span>Large</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTextSize('md')}>
                  <span>Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTextSize('sm')}>
                  <span>Small</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    document.getElementById('trigger--settings-dialog')?.click()
                  }}
                >
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>View</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className={'bg-dark/70 border-light/10 backdrop-blur-xl'}
              >
                <DropdownMenuItem onClick={() => setViewSize('lg')}>
                  <span>Large</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewSize('md')}>
                  <span>Medium</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewSize('sm')}>
                  <span>Small</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    document.getElementById('trigger--settings-dialog')?.click()
                  }}
                >
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel
          className={'text--mono-caps-base text-light/30 pt-2 pb-3'}
        >
          Channel
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              document.getElementById('trigger--new-channel-dialog')?.click()
            }}
          >
            <span>Create Channel</span>
            <DropdownMenuShortcut>
              <KeyboardKeys keys={['Shft', '+', 'N']} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {currentPage === 'channel' ? (
            <React.Fragment>
              <DropdownMenuItem
                disabled={!canEditChannel}
                onClick={() => {
                  document
                    .getElementById('trigger--edit-channel-dialog')
                    ?.click()
                }}
              >
                <span>Edit Channel</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={!canEditChannel}
                onClick={() => {
                  document
                    .getElementById('trigger--edit-announcement-dialog')
                    ?.click()
                }}
              >
                <span>Announcement</span>
              </DropdownMenuItem>
            </React.Fragment>
          ) : null}

          <DropdownMenuItem
            onClick={() => {
              document.getElementById('trigger--settings-dialog')?.click()
            }}
          >
            <span>Settings</span>
            <DropdownMenuShortcut>
              <KeyboardKeys keys={[isMac ? 'Cmd' : 'Ctrl', '+', ',']} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel
          className={'text--mono-caps-base text-light/30 pt-2 pb-3'}
        >
          Misc
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {currentPage === 'channel' ? (
            <DropdownMenuItem
              onClick={() => {
                document.getElementById('trigger--share-dialog')?.click()
              }}
            >
              <span>Share</span>
              <DropdownMenuShortcut>
                <KeyboardKeys keys={['Alt', '+', 'S']} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem>
            <Link href={'http://github.com'}>
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>About</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionsDropdown
