'use client'

import React, { Suspense, useEffect, useState, useTransition } from 'react'
import { PageSection, StickyHeader } from '@/components/misc'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/ui/elements'

import MainHeading from '@/components/ui/headings/main'
import { DialogLabelDescription } from '@/features/dialogs/dialog-items'
import { TagsInput } from 'react-tag-input-component'
import { sanitateTags } from '@/lib/utils'
import { useFormState, useFormStatus } from 'react-dom'
import { createPermanentChannel } from '../actions/config-create-perma-channel'
import {
  CreatePermaChannelSchemaType,
  createPermaChannelSchema,
} from '@/lib/validators'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import clsx from 'clsx'
import SubHeading from '@/components/ui/headings/sub'
import { useSearchParams } from 'next/navigation'
import InitiatePermaChannelsButton from '@/features/config/init-perma-channels'

export default function Page({ params }: { params: { key: string } }) {
  const searchParams = useSearchParams()
  const keyParam = searchParams.get('key')

  // Create perma channels form action
  const [tags, setTags] = useState<string | null>(null)
  const { register, setValue, reset, setError } =
    useForm<CreatePermaChannelSchemaType>({
      resolver: zodResolver(createPermaChannelSchema),
      defaultValues: { authkey: keyParam!, name: '', tags: '' },
    })

  const [state, formAction] = useFormState<ActionResponseState, FormData>(
    createPermanentChannel,
    null,
  )

  const { pending } = useFormStatus()

  useEffect(() => {
    if (!state) {
      return
    }
    if (state.status === 'error') {
      toast.error(state.message, {
        description: JSON.stringify(state.errors),
      })
    }
    if (state.status === 'success') {
      toast.success(state.message)
      reset()
    }
  }, [state, setError, reset])

  // ==============================
  // ==============================
  // ==============================

  return (
    <Suspense fallback={null}>
      <PageSection>
        <StickyHeader>
          <div className={'flex items-center justify-between gap-6 sm:gap-8'}>
            <MainHeading>Config</MainHeading>
          </div>
        </StickyHeader>
        <div className={'flex flex-col w-full min-h-inner'}>
          <SubHeading>Permanent Channels</SubHeading>
          {/* Initiate permanent channels & tags */}
          <form className={'flex flex-col gap-2'} action={formAction}>
            {/* ================================= */}
            <Input
              type={'text'}
              value={keyParam!}
              className={'hidden'}
              aria-hidden
              {...register('authkey')}
            />
            {/* ================================= */}
            <DialogLabelDescription className={'mt-2'}>
              Channel name
            </DialogLabelDescription>
            <Input
              placeholder={'Channel name'}
              autoComplete={'off'}
              disabled={pending}
              {...register('name')}
            />
            {/* ================================= */}

            <div role={'contentinfo'} className={'mb-4'}>
              <DialogLabelDescription className={'my-2'}>
                Add descriptive tags
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
            </div>
            {/* ================================= */}
            <Button type={'submit'} size={'lg'} loading={pending}>
              Create channel
            </Button>
          </form>
          <SubHeading className={'mt-10'}>Init Permanent Channels</SubHeading>
          <InitiatePermaChannelsButton authKey={keyParam!} />
        </div>
      </PageSection>
    </Suspense>
  )
}
