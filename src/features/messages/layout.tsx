'use client'

import React, { useEffect, useState } from 'react'

import Chat from '@/features/messages/chat'
import MessageAnnouncement from '@/features/messages/announcement'
import ChannelHeader from '@/features/channels/header'
import useMessages from '@/stores/messages'
import LoadMoreMessages from './load-more'
import useSettings from '@/stores/settings'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { StickyHeader } from '@/components/misc'

const MessageLayout = ({
  messages,
  sessionId,
  channel,
}: {
  messages: Array<Message>
  sessionId: string
  channel: Channel
}) => {
  const [presenceCount, setPresenceCount] = useState(0)
  const [notification, setNotification] = useState(0)
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
      addMessage(message)
      message.senderId !== sessionId && setNotification((prev) => prev + 1)
    }
    pusherClient.bind('message', messageHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`channel:${channel.id}:messages`))
      pusherClient.unbind('message', messageHandler)
      chatChannel.unbind('pusher:subscription_count')
    }
  }, [])

  return (
    <React.Fragment>
      <StickyHeader>
        <ChannelHeader channel={channel} presenceCount={presenceCount} />
      </StickyHeader>
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
  )
}

export default MessageLayout
