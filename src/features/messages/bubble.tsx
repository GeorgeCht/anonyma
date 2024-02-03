'use client'

import { Suspense, useRef, useState } from 'react'
import { detectURLs, timeAgo } from '@/lib/utils'

import { useDoubleTap } from 'use-double-tap'
import clsx from 'clsx'
import DotIcon from '@/components/ui/icons/dot-icon'
import Button from '@/components/ui/elements/button'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/shadcn/drawer'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import useMessages from '@/stores/messages'

const MessageBubble = ({
  sentBy = 'anon',
  message,
  data,
  timestamp,
}: {
  sentBy?: 'user' | 'anon'
  message: string
  data: Message
  timestamp: number
}) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const { setActionMessage } = useMessages()
  const msgRef = useRef<HTMLDivElement>(null)
  const handleClick = () => {
    const element = msgRef.current
    element &&
      (element.getAttribute('data-timestamp')
        ? element.removeAttribute('data-timestamp')
        : element.setAttribute('data-timestamp', timeAgo(timestamp)))
  }

  const bindDoubleTap = useDoubleTap(() => {
    setActionMessage(data)
    handleRemoveMessage()
  })

  const onOpenDrawer = (newOpenState: boolean) => {
    if (newOpenState) {
      setOpenDrawer(true)
    } else {
      setOpenDrawer(false)
    }
  }

  const handleRemoveMessage = () => {
    setActionMessage(data)
    document.getElementById('trigger--remove-message-dialog')?.click()
  }

  const messageUrl = detectURLs(message)

  return (
    <div
      role={'message'}
      onClick={handleClick}
      className={clsx(
        sentBy === 'anon' ? 'flex-row' : 'flex-row-reverse',
        'group flex relative w-full items-center justify-between gap-1 sm:gap-4'
      )}
    >
      <div
        className={clsx(
          'flex flex-row flex-none items-center gap-3',
          message === ''
            ? 'max-w-[100%] sm:max-w-[100%]'
            : 'max-w-[100%] sm:max-w-[80%]'
        )}
      >
        {sentBy === 'user' && message !== '' && (
          <React.Fragment>
            <Drawer open={openDrawer} onOpenChange={onOpenDrawer}>
              <DrawerContent>
                <DrawerHeader
                  className={'flex flex-col pt-16 justify-center items-center'}
                >
                  <AlertTriangle className={'w-8 h-8'} />
                  <DrawerTitle className={' max-w-72'}>
                    Are you sure you want to unsent this message?
                  </DrawerTitle>
                  <DrawerDescription>
                    This action cannot be undone.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter
                  className={'itmes-center justify-between mx-auto pb-16'}
                >
                  <Button intent={'fit'} size={'lg'}>
                    Confirm
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className={
                    'hidden sm:block opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-all'
                  }
                >
                  <DotIcon className={'w-[5px] h-[19px]'} />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={'w-36 bg-dark/70 border-light/10 backdrop-blur-xl'}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleRemoveMessage}>
                    <span>Remove</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(message)
                      toast.success('Message copied to clipboard.')
                    }}
                  >
                    <span>Copy message</span>
                  </DropdownMenuItem>
                  {messageUrl !== null && (
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(messageUrl[0])
                        toast.success('Link copied to clipboard.')
                      }}
                    >
                      <span>Copy link</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </React.Fragment>
        )}

        <div
          ref={msgRef}
          role={'message-bubble'}
          data-sender={sentBy}
          className={clsx(
            sentBy === 'anon'
              ? 'bg-gray text-light'
              : 'bg-light text-dark sm:max-w-[calc(100%-19px)]',
            message === '' && sentBy !== 'anon' && 'sm:max-w-[calc(100%)]',
            'flex flex-none px-5 py-5 mb-0 rounded-2xl transition-all max-w-[100%]'
          )}
          {...(message !== '' && sentBy !== 'anon' ? bindDoubleTap : {})}
        >
          {message === '' ? (
            <i className={'text--mono-base text--mono-italic opacity-50'}>
              User unsent this message
            </i>
          ) : (
            <p className={'text--mono-base'}>{message}</p>
          )}
        </div>
      </div>

      <Suspense>
        <p
          suppressHydrationWarning
          className={clsx(
            'text--body-sm transition-opacity opacity-0',
            'group-hover:opacity-0 sm:group-hover:opacity-100',
            'text-light/30 flex-none max-w-[20%] text-end'
          )}
        >
          {timeAgo(timestamp)}
        </p>
      </Suspense>
    </div>
  )
}

export default MessageBubble
