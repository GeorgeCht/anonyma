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
  DialogLabelDescription,
  DialogLabelTitle,
} from '@/features/dialogs/dialog-items'
import { Input } from '@/components/shadcn/input'
import { TagsInput } from 'react-tag-input-component'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sanitateTags } from '@/lib/utils'
import { Button } from '@/components/ui/elements'
import { usePathname } from 'next/navigation'
import { isChannelCreator } from '@/app/actions/is-channel-creator'
import { getChannelByName } from '@/app/actions/get-channel-by-name'
import { toast } from 'sonner'
import {
  EditChannelTagsSchemaType,
  editChannelTagsSchema,
} from '@/lib/validators'
import { Loader2 } from 'lucide-react'
import { editTags } from '@/app/actions/edit-tags'
import clsx from 'clsx'

const EditChannel = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [canEditChannel, setCanEditChannel] = useState(false)
  const [tags, setTags] = useState<string | null>(null)
  const [channelId, setChannelId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { register, setValue, reset, setError, control } =
    useForm<EditChannelTagsSchemaType>({
      resolver: zodResolver(editChannelTagsSchema),
      defaultValues: { tags: tags, channelId: channelId! },
    })

  const [state, formAction] = useFormState<ActionResponseState, FormData>(
    editTags,
    null,
  )

  const { pending } = useFormStatus()

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
          if (currentChannelData?.status === 'success') {
            setTags(String(currentChannelData.response.tags))
            setChannelId(currentChannelData.response.id)
          }
        } catch (error) {
          setCanEditChannel(false)
          toast.error('Cannot edit this channel.')
        }
      })
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'sm:max-w-[386px]'}>
        {canEditChannel ? (
          <React.Fragment>
            <form action={formAction}>
              <DialogHeader>
                <DialogTitle>Edit channel</DialogTitle>
              </DialogHeader>
              <DialogBody className={'!min-h-48'}>
                <DialogLabelTitle className={'pt-4'}>
                  Channel tags
                </DialogLabelTitle>
                <DialogLabelDescription className={'-mt-2'}>
                  Add or remove descriptive tags for others to find your channel
                </DialogLabelDescription>
                <TagsInput
                  disabled={pending}
                  value={
                    tags?.length === 1 && tags[0] === '' ? [] : tags?.split(',')
                  }
                  onChange={(tags) => {
                    setValue('tags', sanitateTags(tags).join(',') || null, {
                      shouldValidate: true,
                    })
                  }}
                  separators={[',', 'Enter']}
                  placeHolder={'Type your tags...'}
                  classNames={{
                    tag: 'rounded-md bg-gray/90 border border-light/80 !px-1 !pb-[2px] !pt-[3px]',
                    input: clsx(
                      'flex !w-full px-3 pb-1.5 pt-2 text-sm ring-offset-background file:border-0',
                      'file:bg-transparent file:text-sm file:font-medium placeholder:text-light/30',
                      'disabled:cursor-not-allowed disabled:opacity-50 !text-sm',
                      'rounded-md bg-gray/90 border border-light/10',
                    ),
                  }}
                />
                <Input
                  className={'hidden'}
                  aria-hidden
                  type={'text'}
                  disabled={pending}
                  {...register('tags')}
                />
                <Input
                  className={'hidden'}
                  aria-hidden
                  type={'text'}
                  disabled={pending}
                  {...register('channelId')}
                  value={channelId!}
                />
              </DialogBody>
              <DialogFooter className={'sm:justify-start pt-5'}>
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
                    disabled={pending}
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

export default EditChannel
