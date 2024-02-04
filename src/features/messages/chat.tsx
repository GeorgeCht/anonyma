'use client'

import React, { useEffect, useRef, useState } from 'react'
import Messages from '@/features/messages/messages'
import Button from '@/components/ui/elements/button'

import { useLenis } from '@/features/essentials/lenis'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { ArrowDown } from 'lucide-react'

const Chat = ({
  channel,
  sessionId,
  messages,
  notification,
  setNotification,
}: {
  channel: Channel
  sessionId: string
  messages: Array<Message>
  notification: number
  setNotification: React.Dispatch<React.SetStateAction<number>>
}) => {
  const lenis = useLenis()
  const ref = useRef() as React.MutableRefObject<HTMLUListElement>
  const [domReady, setDomReady] = useState(false)
  const [userScrolled, setUserScrolled] = useState(true)

  useEffect(() => {
    setDomReady(true)
  }, [])

  // Scroll down effect
  useEffect(() => {
    setTimeout(() => {
      lenis?.scrollTo(ref.current?.clientHeight! + 200, {
        duration: 2.785,
      })
    }, 175)
  }, [])

  lenis?.on('scroll', () => {
    const scrollContainer = ref.current
    if (scrollContainer) {
      const isScroll =
        lenis.scroll + innerHeight > scrollContainer.clientHeight! + 355
      setUserScrolled(isScroll)
      isScroll && setNotification(0)
    }
  })

  const scrollDown = () => {
    ref !== undefined && lenis?.scrollTo(ref.current?.clientHeight! + 200)
    setNotification(0)
  }

  const motionItem = {
    hidden: {
      opacity: 0,
      y: 30,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <div className={'pt-2 pb-24 relative overflow-x-hidden overflow-y-auto'}>
      <Messages
        channel={channel}
        sessionId={sessionId}
        messages={messages}
        ref={ref}
      />
      {domReady &&
        createPortal(
          <React.Fragment>
            <AnimatePresence>
              <Motion.div
                variants={motionItem}
                initial={'hidden'}
                animate={!userScrolled ? 'visible' : 'hidden'}
                exit={'exit'}
                id={'scrollToBottom-button'}
                className={
                  'flex w-full max-w-prefered justify-center items-center'
                }
              >
                {notification ? (
                  <Button
                    type={'submit'}
                    onClick={scrollDown}
                    id={'scrollToBottom-button--trigger'}
                    size={'sm'}
                    className={
                      'h-8 px-3 bg-gradient-to-tl from-accent-primary to-accent-secondary hover:bg-gradient-to-tl hover:from-light hover:to-offwhite hover:shadow-xl'
                    }
                  >
                    <span className={'text--body-sm'}>
                      {notification} new message{notification > 1 ? 's' : ''}
                    </span>
                  </Button>
                ) : (
                  <Button
                    type={'submit'}
                    onClick={scrollDown}
                    id={'scrollToBottom-button--trigger'}
                    size={'xl'}
                    className={
                      'h-[37px] w-[37px] bg-gradient-to-tl from-accent-primary to-accent-secondary hover:bg-gradient-to-tl hover:from-light hover:to-offwhite hover:shadow-xl'
                    }
                  >
                    <ArrowDown className={'w-[24px] h-[24px] mt-[4px]'} />
                  </Button>
                )}
              </Motion.div>
            </AnimatePresence>
          </React.Fragment>,
          document.getElementById('scrollToBottom-portal')!,
        )}
    </div>
  )
}

export default Chat
