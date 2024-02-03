import clsx from 'clsx'
import React from 'react'
import MessageBubble from './bubble'
import { motion as Motion } from 'framer-motion'
import MessageAnnouncement from './announcement'
import useSettings from '@/stores/settings'
import { filterUnsentMessages, sortMessagesByTimestamp } from '@/lib/utils'

const Messages = React.forwardRef<
  React.ElementRef<typeof Motion.ul>,
  {
    sessionId: string
    channel: Channel
    messages: Array<Message>
  } & React.ComponentPropsWithoutRef<typeof Motion.ul>
>(({ channel, sessionId, messages, ...props }, ref) => {
  const { pinAnnouncement } = useSettings()
  const messageContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 85,
        damping: 15,
        staggerChildren: 0.0475,
      },
    },
  }
  const messageItem = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 },
  }

  messages = sortMessagesByTimestamp(filterUnsentMessages(messages))

  return (
    <React.Fragment>
      <Motion.ul
        ref={ref}
        variants={messageContainer}
        initial={'hidden'}
        animate={'show'}
        role={'group'}
        className={'flex flex-col gap-1'}
        {...props}
      >
        {!pinAnnouncement && (
          <MessageAnnouncement
            announcement={channel.announcement}
            sticky={false}
          />
        )}
        {messages.map((message, index) => {
          let isFirstMessage = index === 0
          let isCurrentUser = message.senderId === sessionId
          let nextMessageIsFromSameUser =
            messages[index - 1]?.senderId === messages[index].senderId

          return (
            <React.Fragment key={index}>
              {(isFirstMessage || !nextMessageIsFromSameUser) && (
                <Motion.li
                  className={'flex relative w-full'}
                  key={`user-${message.id || index}`}
                  variants={messageItem}
                >
                  <p
                    className={clsx(
                      'text--body-sm mt-5 mb-2 text-light/30',
                      'cursor-default transition-colors',
                      isCurrentUser && 'text-right w-full'
                    )}
                  >
                    @{message.senderUsername}
                  </p>
                </Motion.li>
              )}
              <Motion.li
                className={'flex relative w-full'}
                key={index}
                variants={messageItem}
              >
                <MessageBubble
                  key={`message-${message.id || index}`}
                  sentBy={isCurrentUser ? 'user' : 'anon'}
                  data={message}
                  message={message.message}
                  timestamp={message.timestamp}
                />
              </Motion.li>
            </React.Fragment>
          )
        })}
      </Motion.ul>
    </React.Fragment>
  )
})

export default Messages
