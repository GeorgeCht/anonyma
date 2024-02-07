'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { DialogBody, DialogHeading } from '@/features/dialogs/dialog-items'
import { Input } from '@/components/shadcn/input'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema, MessageSchemaType } from '@/lib/validators'
import { toast } from 'sonner'
import { Button } from '@/components/ui/elements'
import { removeMessage } from '@/app/actions/remove-message'
import { AlertTriangle } from 'lucide-react'
import useMessages from '@/stores/messages'

const RemoveMessage = ({ children }: { children: React.ReactNode }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { actionMessage, channelId, addMessage } = useMessages()

  const { register, reset, setError } = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      id: actionMessage?.id,
      senderId: actionMessage?.senderId,
      senderUsername: actionMessage?.senderUsername,
      message: '',
      timestamp: actionMessage?.timestamp,
      channelId: channelId,
    },
  })

  const [state, formAction] = useFormState<ActionResponseState, FormData>(
    removeMessage,
    null,
  )

  const { pending } = useFormStatus()

  useEffect(() => {
    if (!state) {
      return
    }
    console.log(state)
    if (state.status === 'error') {
      state.errors === undefined && setDialogOpen(false)
      toast.error(state.message)
    }
    if (state.status === 'success') {
      setDialogOpen(false)
      toast.success(state.message)
      reset()
    }
  }, [state, setError, reset])

  const onOpenHandler = (state: boolean) => {
    setDialogOpen(state)
    reset()
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'sm:max-w-[386px]'}>
        <form
          action={formAction}
          onSubmit={() => {
            // Optimistically removes message
            addMessage({
              id: actionMessage?.id!,
              senderId: actionMessage?.senderId!,
              senderUsername: actionMessage?.senderUsername!,
              message: '',
              timestamp: actionMessage?.timestamp!,
              delivered: false,
            })
          }}
        >
          <DialogHeader>
            <div className={'flex items-center flex-row'}>
              <AlertTriangle className={'w-5 h-5 mr-3'} />
              <DialogTitle>Remove message</DialogTitle>
            </div>
          </DialogHeader>
          <DialogBody className={'!min-h-28'}>
            <DialogHeading className={'w-full max-w-72 pt-3'}>
              Are you sure you want to unsent this message?
            </DialogHeading>
            <p className={'text--body-base text-light/70'}>
              This action cannot be undone.
            </p>
            <Input
              className={'hidden'}
              aria-hidden
              value={actionMessage?.id}
              {...register('id')}
            />
            <Input
              className={'hidden'}
              aria-hidden
              value={actionMessage?.senderId}
              {...register('senderId')}
            />
            <Input
              className={'hidden'}
              aria-hidden
              value={channelId}
              {...register('channelId')}
            />
            <Input
              className={'hidden'}
              aria-hidden
              value={actionMessage?.senderUsername}
              {...register('senderUsername')}
            />
            <Input
              className={'hidden'}
              aria-hidden
              value={''}
              {...register('message')}
            />
            <Input
              className={'hidden'}
              aria-hidden
              value={actionMessage?.timestamp}
              type={'number'}
              {...register('timestamp')}
            />
          </DialogBody>
          <DialogFooter className={'sm:justify-start sm:flex-row gap-3 pt-4'}>
            <Button
              type={'submit'}
              intent={'fit'}
              size={'lg'}
              loading={pending}
            >
              Confirm
            </Button>
            <DialogClose asChild>
              <Button
                intent={'fit'}
                variant={'ghost'}
                size={'lg'}
                className={'px-8'}
                disabled={pending}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RemoveMessage
