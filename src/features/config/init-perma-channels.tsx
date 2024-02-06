'use client'

import React, { useState, useTransition } from 'react'

import { initPermanentChannel } from '@/app/actions/config-init-perma-channels'
import { Button } from '@/components/ui/elements'
import { toast } from 'sonner'

const InitiatePermaChannelsButton = ({ authKey }: { authKey: string }) => {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onClickHandler = () => {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const results = await initPermanentChannel(authKey)
        if (results?.status === 'success') {
          toast.success('Permanent channels initiated.')
          setIsLoading(false)
        }
      } catch (error) {
        toast.error('Cannot edit this channel.')
      }
    })
  }

  return (
    <React.Fragment>
      <Button
        size={'lg'}
        onClick={onClickHandler}
        loading={isLoading || isPending}
      >
        Initiate permanent channels
      </Button>
    </React.Fragment>
  )
}

export default InitiatePermaChannelsButton
