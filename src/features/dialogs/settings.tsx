'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Button, Clarification } from '@/components/ui/elements'
import { Switch } from '@/components/shadcn/switch'
import useSettings, {
  Size,
  Theme,
  initialState as initialOptionsState,
} from '@/stores/settings'

const Settings = ({ children }: { children: React.ReactNode }) => {
  const storeSettings = useSettings()
  const [options, setOptions] = useState(initialOptionsState)

  useEffect(() => {
    setOptions(storeSettings)
  })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'sm:max-w-[386px]'}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <DialogBody className={'min-h-[532px]'}>
          <DialogHeading>Appearance</DialogHeading>
          <DialogLabelTitle>Theme</DialogLabelTitle>
          <Select
            value={storeSettings.prefersTheme as string}
            onValueChange={(value) => {
              storeSettings.setTheme(value as Theme)
            }}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder={'Theme'} />
            </SelectTrigger>
            <SelectContent>
              {options.themesArray.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme
                    .replace(/-/g, ' ')
                    .replace(
                      /\w\S*/g,
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.substr(1).toLowerCase()
                    )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogLabelTitle>Font size</DialogLabelTitle>
          <DialogLabelDescription className={'-mt-2'}>
            Choose text display size
          </DialogLabelDescription>
          <Select
            value={storeSettings.prefersTextSize as string}
            onValueChange={(value) => {
              storeSettings.setTextSize(value as Size)
            }}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder={'Theme'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'sm'}>Small</SelectItem>
              <SelectItem value={'md'}>Medium</SelectItem>
              <SelectItem value={'lg'}>Large</SelectItem>
            </SelectContent>
          </Select>

          <DialogLabelTitle>View layout</DialogLabelTitle>
          <DialogLabelDescription className={'-mt-2'}>
            Configure the app view layout
          </DialogLabelDescription>
          <Select
            value={storeSettings.prefersViewSize as string}
            onValueChange={(value) => {
              storeSettings.setViewSize(value as Size)
            }}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder={'Theme'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'sm'}>Small</SelectItem>
              <SelectItem value={'md'}>Medium</SelectItem>
              <SelectItem value={'lg'}>Large</SelectItem>
            </SelectContent>
          </Select>

          <DialogHeading className={'pt-1'}>Channels</DialogHeading>

          <div className={'flex flex-row justify-between items-center'}>
            <div className={'flex items-center space-x-2'}>
              <DialogLabelTitle>Display channel tags in chat</DialogLabelTitle>
            </div>
            <Switch
              checked={storeSettings.displayChannelTags}
              onCheckedChange={(checked) => {
                storeSettings.setDisplayChannelTags(checked)
              }}
            />
          </div>
          <div className={'flex flex-row justify-between items-center'}>
            <div className={'flex items-center space-x-2'}>
              <DialogLabelTitle>Enable profanity filter</DialogLabelTitle>
              <Clarification
                side={'top'}
                text={
                  'Channel will be accessed to only those with the password'
                }
              />
            </div>
            <Switch
              checked={storeSettings.profanityFilter}
              onCheckedChange={(checked) => {
                storeSettings.setProfanityFilter(checked)
              }}
            />
          </div>
          <div className={'flex flex-row justify-between items-center'}>
            <div className={'flex items-center space-x-2'}>
              <DialogLabelTitle>Pin announcement at top</DialogLabelTitle>
              <Clarification
                side={'top'}
                text={
                  'Channel will be accessed to only those with the password'
                }
              />
            </div>
            <Switch
              checked={storeSettings.pinAnnouncement}
              onCheckedChange={(checked) => {
                storeSettings.setPinAnnouncement(checked)
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter className={'sm:justify-start'}>
          <DialogClarification className={'pb-4'}>
            Settings are stored and applied locally only for your device. You
            can also reset settings to default.
          </DialogClarification>
          <Button
            intent={'full'}
            size={'lg'}
            onClick={() => {
              storeSettings.setToDefault()
            }}
          >
            Reset to default
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Settings
