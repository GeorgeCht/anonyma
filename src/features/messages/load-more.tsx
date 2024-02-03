'use client'

import React, { useRef, useTransition } from 'react'
import useMessages from '@/stores/messages'

import { Button } from '@/components/ui/elements'
import { getChatMessagesExperimentalAction } from '@/app/actions/get-messages-action'

const LoadMoreMessages = () => {
  const { channelId, setMessages, hasMore, page } = useMessages()
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLButtonElement>(null)
  const fetchMore = () => {
    startTransition(async () => {
      const messages = await getChatMessagesExperimentalAction(channelId!, page)
      setMessages(messages)
    })
  }

  return (
    <div
      className={'flex flex-col justify-center items-center w-full pt-4 pb-2'}
    >
      {hasMore && (
        <React.Fragment>
          <Button
            ref={ref}
            intent={'full'}
            size={'lg'}
            onClick={fetchMore}
            loading={isPending}
            className={
              'bg-transparent w-full border border-light/15 hover:border-light/20 text-light/90 hover:bg-transparent'
            }
          >
            {isPending ? 'Fetching...' : 'Load more'}
          </Button>
        </React.Fragment>
      )}

      {!hasMore && page > 2 && (
        <React.Fragment>
          <h5 className={'text--body-lg text-light/30 pb-2'}>
            No more messages
          </h5>
          <span
            className={
              'text--mono-caps-sm flex text-light/20 max-w-56 text-center'
            }
          >
            You' re all caught up! No more older messages found.
          </span>
        </React.Fragment>
      )}
    </div>
  )
}

export default LoadMoreMessages
