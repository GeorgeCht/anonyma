'use client'

import React, { useEffect, useState, useRef, Suspense } from 'react'
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
  DialogHeading,
  DialogLabelDescription,
  DialogLabelTitle,
} from '@/features/dialogs/dialog-items'
import { Input } from '@/components/shadcn/input'
import { Switch } from '@/components/shadcn/switch'
import { TagsInput } from 'react-tag-input-component'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sanitateTags } from '@/lib/utils'
import { NewChannelSchemaType, newChannelSchema } from '@/lib/validators'
import { newChannel } from '@/app/actions/new-channel'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button, Clarification } from '@/components/ui/elements'

import clsx from 'clsx'

const NewChannel = ({ children }: { children: React.ReactNode }) => {
  const [tags, setTags] = useState<string | null>(null)
  const [accessSwitch, setAccessSwitch] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const { register, setValue, reset, setError, control } =
    useForm<NewChannelSchemaType>({
      resolver: zodResolver(newChannelSchema),
      defaultValues: { access: 'public', password: '' },
    })

  const { ref, ...partialNameRegister } = register('name')
  const [state, formAction] = useFormState<ActionResponseState, FormData>(
    newChannel,
    null,
  )

  const { pending } = useFormStatus()

  useEffect(() => {
    const channelName = nameRef.current?.value
    if (!state) {
      return
    }
    if (state.status === 'error') {
      state.errors === undefined && setDialogOpen(false)
      toast.error(state.message)
    }
    if (state.status === 'success') {
      // TODO: If channel has password, add it to zustand store
      setDialogOpen(false)
      toast.success(state.message)
      reset()
      router.push(`/c/${channelName?.toLowerCase()}`)
    }
  }, [state, setError, reset])

  const onOpenHandler = (state: boolean) => {
    setDialogOpen(state)
    reset()
    setTags(null)
    setAccessSwitch(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'sm:max-w-[386px]'}>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>New channel</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogLabelTitle className={'pt-4'}>Display name</DialogLabelTitle>
            <Input
              placeholder={'Channel name'}
              autoComplete={'off'}
              disabled={pending}
              {...partialNameRegister}
              ref={(e) => {
                ref(e)
                nameRef.current = e
              }}
            />
            <Suspense>
              <DialogErrorMessage state={state} forPath={'name'} />
            </Suspense>

            <DialogLabelTitle>Channel tags</DialogLabelTitle>
            <DialogLabelDescription className={'-mt-2'}>
              Add descriptive tags for others to find it
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
            <Suspense>
              <DialogErrorMessage state={state} forPath={'tags'} />
            </Suspense>

            <DialogHeading>Access rules</DialogHeading>
            <div className={'flex flex-row justify-between items-center'}>
              <div className={'flex items-center space-x-2'}>
                <DialogLabelTitle>Make channel private</DialogLabelTitle>
                <Clarification
                  text={
                    'Channel will be accessed to only those with the password'
                  }
                />
              </div>
              <Controller
                name={'access'}
                control={control}
                defaultValue={'public'}
                render={({ field: { onChange, value, ref } }) => (
                  <Switch
                    ref={ref}
                    name={'access'}
                    disabled={pending}
                    value={value === null ? 'public' : value}
                    onChange={onChange}
                    onCheckedChange={(checked) => {
                      setAccessSwitch(checked)
                      if (checked) {
                        setValue('access', 'private')
                      } else {
                        setValue('access', 'public')
                        reset(
                          passwordRef.current?.value ? { password: '' } : {},
                        )
                      }
                    }}
                  />
                )}
              />
            </div>
            {accessSwitch ? (
              <React.Fragment>
                <DialogLabelTitle>Channel password</DialogLabelTitle>
                <Input
                  type={'password'}
                  placeholder={'••••••••'}
                  disabled={pending}
                  {...register('password')}
                />
                <Suspense>
                  <DialogErrorMessage state={state} forPath={'password'} />
                </Suspense>
              </React.Fragment>
            ) : null}
          </DialogBody>
          <DialogFooter className={'sm:justify-start pt-4'}>
            <DialogClarification className={'pb-4'}>
              Settings are stored and applied locally only for your device. You
              can also reset settings to default.
            </DialogClarification>
            <Button
              type={'submit'}
              intent={'full'}
              size={'lg'}
              loading={pending}
            >
              Create channel
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
      </DialogContent>
    </Dialog>
  )
}

export default NewChannel
