'use client'

import React, { useState } from 'react'

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
  DialogHeading,
  DialogLabelDescription,
  DialogLabelTitle,
} from '@/features/dialogs/dialog-items'
import { Input } from '@/components/shadcn/input'
import { Switch } from '@/components/shadcn/switch'
import { TagsInput } from 'react-tag-input-component'
import clsx from 'clsx'
import { Button } from '@/components/ui/elements'

const EditChannel = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<Array<string>>(['existing', 'tags'])
  const [access, setAccess] = useState(false)

  // TODO: Validate tags and inputs
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'sm:max-w-[386px]'}>
        <DialogHeader>
          <DialogTitle>Edit channel</DialogTitle>
        </DialogHeader>
        <DialogBody className={'min-h-44'}>
          <DialogLabelTitle>Channel tags</DialogLabelTitle>
          <DialogLabelDescription className={'-mt-2'}>
            Add descriptive tags for others to find it
          </DialogLabelDescription>
          <TagsInput
            value={selected}
            onChange={setSelected}
            name={'tags'}
            placeHolder={'Type your tags...'}
            classNames={{
              tag: 'rounded-md bg-gray/90 border border-light/80 !px-1 !pb-[2px] !pt-[3px]',
              input: clsx(
                'flex !w-full px-3 pb-1.5 pt-2 text-sm ring-offset-background file:border-0',
                'file:bg-transparent file:text-sm file:font-medium placeholder:text-light/30',
                'disabled:cursor-not-allowed disabled:opacity-50 !text-sm',
                'rounded-md bg-gray/90 border border-light/10'
              ),
            }}
          />
        </DialogBody>
        <DialogFooter className={'sm:justify-start'}>
          <DialogClarification className={'pb-4'}>
            Settings are stored and applied locally only for your device. You
            can also reset settings to default.
          </DialogClarification>
          <Button intent={'full'} size={'lg'}>
            Update changes
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
      </DialogContent>
    </Dialog>
  )
}

export default EditChannel
