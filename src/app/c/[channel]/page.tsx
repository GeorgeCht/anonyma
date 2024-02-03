'use server'

import React from 'react'

import { InnerSection } from '@/components/layout'
import { getChannelByName } from '@/app/actions/get-channel-by-name'
import { userSession } from '@/app/actions/session'
import { getChatInitialMessages } from '@/app/actions/get-messages-action'
import { notFound, redirect } from 'next/navigation'

import MessageInput from '@/features/messages/input'
import ChannelDialogs from '@/components/layout/channel-dialogs'
import MessageLayout from '@/features/messages/layout'

export default async function Page({
  params,
}: {
  params: { channel: string }
}) {
  const channelDataResponse = await getChannelByName(params.channel)
  if (channelDataResponse?.status === 'error') {
    notFound()
  }
  const channelData = channelDataResponse?.response as Channel
  const initialMessages = await getChatInitialMessages(channelData.id)
  const sessionData = await userSession.get()
  !(await userSession.validate()) && redirect('/?sessiontimeout')

  return (
    <React.Fragment>
      <InnerSection>
        <MessageLayout
          messages={initialMessages}
          sessionId={sessionData.id}
          channel={channelData}
        />
        <div
          className={'fixed flex w-full max-w-prefered bottom-20 py-3'}
          id={'scrollToBottom-portal'}
        />
      </InnerSection>
      <MessageInput id={channelData.id} />
      <ChannelDialogs />
    </React.Fragment>
  )
}
