'use client'

import React, { useEffect, useState, Suspense } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import {
  DialogBody,
  DialogClarification,
  DialogErrorMessage,
  DialogLabelTitle,
} from '@/features/dialogs/dialog-items'
import { Input } from '@/components/shadcn/input'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChannelPasswordSchemaType,
  channelPasswordSchema,
} from '@/lib/validators'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/elements'
import {
  ChannelPasswordResponse,
  channelPasswordAccess,
} from '@/app/actions/password-access'

import useMessages from '@/stores/messages'
import usePasswords from '@/stores/passwords'

const ChannelPassword = ({ children }: { children: React.ReactNode }) => {
  const { channelId } = useMessages()
  const { addPassword } = usePasswords()
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const { register, reset, setError } = useForm<ChannelPasswordSchemaType>({
    resolver: zodResolver(channelPasswordSchema),
    defaultValues: {
      channelId: channelId,
    },
  })

  const [state, formAction] = useFormState<
    ExtendedActionResponseState<ChannelPasswordResponse>,
    FormData
  >(channelPasswordAccess, null)

  const { pending } = useFormStatus()

  useEffect(() => {
    if (!state) {
      return
    }
    if (state.status === 'error') {
      toast.error(state.message)
    }
    if (state.status === 'success') {
      addPassword({
        channelId: state.response.channelId as string,
        password: state.response.password as string,
      })
      setDialogOpen(false)
      toast.success(state.message)
      router.push(
        `/c/${state.response.channelName.toLowerCase()}?access=granted`,
      )
    }
  }, [state, setError, reset])

  const onOpenHandler = (handlerState: boolean) => {
    if (handlerState) {
      setDialogOpen(handlerState)
      reset()
    } else {
      toast.error('Forbidden action', {
        description: 'Access to this channel is forbidden without a password.',
      })
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'sm:max-w-[386px]'}>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Access channel</DialogTitle>
          </DialogHeader>
          <DialogBody className={'!min-h-24'}>
            <Input
              placeholder={'Channel name'}
              autoComplete={'off'}
              disabled={pending}
              className={'hidden'}
              {...register('channelId')}
              value={channelId}
            />
            <DialogLabelTitle className={'pt-4'}>
              Channel password
            </DialogLabelTitle>
            <Input
              type={'password'}
              placeholder={'••••••••'}
              disabled={pending}
              {...register('password')}
            />
            <Suspense>
              <DialogErrorMessage state={state} forPath={'password'} />
            </Suspense>
          </DialogBody>
          <DialogFooter className={'sm:justify-start pt-4'}>
            <DialogClarification className={'pb-4'}>
              Channel is private access only. A password is required to access
              its messages.
            </DialogClarification>
            <Button
              type={'submit'}
              intent={'full'}
              size={'lg'}
              loading={pending}
            >
              Submit
            </Button>
            <Button
              intent={'full'}
              variant={'ghost'}
              size={'lg'}
              className={'px-8'}
              onClick={() => router.back()}
            >
              Go back
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChannelPassword
