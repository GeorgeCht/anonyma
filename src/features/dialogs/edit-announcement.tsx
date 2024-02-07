'use client'

import React, { useEffect, useState, useTransition } from 'react'
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
  DialogLabelDescription,
  DialogLabelTitle,
} from '@/features/dialogs/dialog-items'
import { Textarea } from '@/components/shadcn/textarea'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { isChannelCreator } from '@/app/actions/is-channel-creator'
import { Loader2 } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  editAnnouncementSchema,
  EditAnnouncementSchemaType,
} from '@/lib/validators'
import { Input } from '@/components/shadcn/input'
import { editAnnouncement } from '@/app/actions/edit-announcement'
import { getChannelByName } from '@/app/actions/get-channel-by-name'
import { Button } from '@/components/ui/elements'

const EditAnnouncement = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const [canEditChannel, setCanEditChannel] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const { register, reset, setError } = useForm<EditAnnouncementSchemaType>({
    resolver: zodResolver(editAnnouncementSchema),
    defaultValues: { announcement: '' },
  })
  const { pending } = useFormStatus()
  const [state, formAction] = useFormState<ActionResponseState, FormData>(
    editAnnouncement,
    null,
  )
  const { onChange, ...partialRegister } = register('announcement')
  useEffect(() => {
    if (!state) {
      return
    }
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
    pathname.startsWith('/c/') &&
      startTransition(async () => {
        try {
          const canEdit = await isChannelCreator(pathname.substring(3))
          if (canEdit === true) setCanEditChannel(true)
          const currentChannelData = await getChannelByName(
            pathname.substring(3),
          )
          if (currentChannelData?.status === 'success')
            setAnnouncement(currentChannelData.response.announcement)
        } catch (error) {
          setCanEditChannel(false)
          toast.error('Cannot edit this channel.')
        }
      })
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={'sm:max-w-[386px]'}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        {canEditChannel ? (
          <React.Fragment>
            <form action={formAction}>
              <DialogHeader>
                <DialogTitle>Announcement</DialogTitle>
              </DialogHeader>
              <DialogBody className={'!min-h-44'}>
                <DialogLabelTitle className={'pt-4'}>
                  Announcement text
                </DialogLabelTitle>
                <DialogLabelDescription className={'-mt-2'}>
                  Enter an announcement text to display to everyone chatting in
                  the channel
                </DialogLabelDescription>
                <Input
                  {...register('name')}
                  className={'hidden'}
                  aria-hidden
                  value={pathname.substring(3)}
                />
                <Textarea
                  value={announcement}
                  placeholder={'Type an announcement...'}
                  disabled={pending}
                  {...partialRegister}
                  onChange={(e) => {
                    setAnnouncement(e.target.value)
                    onChange(e)
                  }}
                />
                <DialogErrorMessage state={state} forPath={'announcement'} />
              </DialogBody>
              <DialogFooter className={'sm:justify-start'}>
                <DialogClarification className={'pb-4'}>
                  Settings are stored and applied locally only for your device.
                  You can also reset settings to default.
                </DialogClarification>
                <Button
                  type={'submit'}
                  intent={'full'}
                  size={'lg'}
                  loading={pending}
                >
                  Apply changes
                </Button>
                <DialogClose asChild>
                  <Button
                    intent={'full'}
                    variant={'ghost'}
                    size={'lg'}
                    className={'px-8'}
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className={'flex flex-col justify-center items-center h-96'}>
              <Loader2 strokeWidth={1} className={'h-8 w-8 animate-spin'} />
            </div>
          </React.Fragment>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditAnnouncement
