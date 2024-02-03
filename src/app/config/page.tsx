'use server'

import React from 'react'

import { InnerSection, PageSection, StickyHeader } from '@/components/layout'
import { getChannelByName } from '@/app/actions/get-channel-by-name'
import { userSession } from '@/app/actions/session'
import { getChatInitialMessages } from '@/app/actions/get-messages-action'
import { notFound, redirect } from 'next/navigation'

import MessageInput from '@/features/messages/input'
import ChannelDialogs from '@/components/layout/channel-dialogs'
import MessageLayout from '@/features/messages/layout'
import MainHeading from '@/components/ui/headings/main'

export default async function Page({ params }: { params: { key: string } }) {
  return (
    <React.Fragment>
      <PageSection>
        <StickyHeader>
          <div className={'flex items-center justify-between gap-6 sm:gap-8'}>
            <MainHeading>Config</MainHeading>
          </div>
        </StickyHeader>
        <div className={'flex flex-col justify-between w-full min-h-inner'}>
          <p>{params.key}</p>
        </div>
      </PageSection>
    </React.Fragment>
  )
}
