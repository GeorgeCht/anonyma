'use client'

import React, { useEffect, useState, useTransition } from 'react'

import Chat from '@/features/messages/chat'
import MessageAnnouncement from '@/features/messages/announcement'
import ChannelHeader from '@/features/channels/header'
import useMessages from '@/stores/messages'
import LoadMoreMessages from './load-more'
import useSettings from '@/stores/settings'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { StickyHeader } from '@/components/misc'
import usePasswords from '@/stores/passwords'
import { authChannelPassword } from '@/app/actions/auth-channel-password'

const MessageLayout = ({
  messages,
  sessionId,
  channel,
}: {
  messages: Array<Message>
  sessionId: string
  channel: Channel
}) => {
  const { entryExists, findEntry } = usePasswords()
  const [, startTransition] = useTransition()
  const [presenceCount, setPresenceCount] = useState(0)
  const [notification, setNotification] = useState(0)
  const [isPasswordAuth, setIsPasswordAuth] = useState(false)
  const { pinAnnouncement } = useSettings()

  const {
    messages: storeMessages,
    resetState,
    switchChannel,
    setMessages,
    addMessage,
  } = useMessages()

  useEffect(() => {
    // Update store state
    resetState()
    switchChannel(channel.id)

    // Check if channel is private
    if (channel.access === 'private' && !isPasswordAuth) {
      // If user doesnt have current password in store, show password dialog
      if (!entryExists(channel.id)) {
        setIsPasswordAuth(false)
        document.getElementById('trigger--channel-password-dialog')?.click()
      } else {
        // User has stored password
        const storedPasswordData = findEntry(channel.id)
        if (storedPasswordData) {
          startTransition(async () => {
            // Check if password is valid
            const hasPasswordAuth =
              await authChannelPassword(storedPasswordData)
            if (hasPasswordAuth) {
              setIsPasswordAuth(true)
            } else {
              setIsPasswordAuth(false)
              document
                .getElementById('trigger--channel-password-dialog')
                ?.click()
            }
          })
        } else {
          setIsPasswordAuth(false)
          document.getElementById('trigger--channel-password-dialog')?.click()
        }
      }
    }

    if (
      (channel.access === 'private' && isPasswordAuth) ||
      channel.access === 'public'
    ) {
      // Update store messages state
      setMessages(messages)

      // Get live message updates
      const chatChannel = pusherClient.subscribe(
        toPusherKey(`channel:${channel.id}:messages`),
      )

      // Presence channel
      chatChannel.bind(
        'pusher:subscription_count',
        (data: { subscription_count: number }) => {
          setPresenceCount(data?.subscription_count)
        },
      )

      // Messages handler
      const messageHandler = (message: Message) => {
        message.senderId !== sessionId && addMessage(message)
        message.senderId !== sessionId &&
          message.message !== '' &&
          setNotification((prev) => prev + 1)
      }
      pusherClient.bind('message', messageHandler)

      return () => {
        pusherClient.unsubscribe(toPusherKey(`channel:${channel.id}:messages`))
        pusherClient.unbind('message', messageHandler)
        chatChannel.unbind('pusher:subscription_count')
      }
    }
  }, [isPasswordAuth])

  return (
    <React.Fragment>
      <StickyHeader>
        <ChannelHeader channel={channel} presenceCount={presenceCount} />
      </StickyHeader>
      {(channel.access === 'private' && isPasswordAuth) ||
      channel.access === 'public' ? (
        <React.Fragment>
          {pinAnnouncement && (
            <MessageAnnouncement announcement={channel.announcement} sticky />
          )}
          <LoadMoreMessages />
          <Chat
            channel={channel}
            sessionId={sessionId}
            messages={storeMessages}
            notification={notification}
            setNotification={setNotification}
          />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

export default MessageLayout
