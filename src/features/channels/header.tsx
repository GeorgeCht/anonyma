'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { ChevronLeft } from 'lucide-react'
import { joinTagsAndTrim } from '@/lib/utils'

import React from 'react'
import MainHeading from '@/components/ui/headings/main'
import ActionsDropdown from '@/features/dropdowns/actions-dropdown'
import DotIcon from '@/components/ui/icons/dot-icon'
import Badge from '@/components/ui/elements/badge'
import useSettings from '@/stores/settings'

const ChannelHeader = ({
  channel,
  presenceCount,
}: {
  channel: Channel
  presenceCount: number
}) => {
  const { displayChannelTags } = useSettings()
  const { trimmedTags, remainingTags } = joinTagsAndTrim(channel.tags!, 36)
  return (
    <React.Fragment>
      <div className={'flex items-center justify-between gap-6 sm:gap-8'}>
        <div className={'flex items-center gap-3'}>
          <ChevronLeft
            className={
              '-ml-3 sm:-ml-4 block lg:hidden w-[42px] h-[42px] sm:w-[58px] sm:h-[58px]'
            }
          />
          <MainHeading>/{channel.name}</MainHeading>
        </div>

        <ActionsDropdown>
          <div className={'pl-6 py-2 hover:cursor-pointer'}>
            <DotIcon />
          </div>
        </ActionsDropdown>
      </div>

      {displayChannelTags && (
        <div className={'flex flex-row gap-1 sm:mt-4 mt-2'}>
          <Badge indicator variant={'light'}>
            {presenceCount} Online
          </Badge>
          <Badge>{channel.access}</Badge>
          {channel.tags!.length > 0 &&
            trimmedTags.map((tag, index) => {
              return (
                tag !== '' && (
                  <Badge className={'cursor-pointer'} key={index}>
                    {tag}
                  </Badge>
                )
              )
            })}
          {remainingTags && remainingTags.length > 0 ? (
            <Tooltip delayDuration={250}>
              <TooltipTrigger>
                <Badge variant={'light'}>+{remainingTags.length}</Badge>
              </TooltipTrigger>
              <TooltipContent
                className={
                  'flex flex-col gap-3 py-2 bg-dark/60 backdrop-blur-md border border-light/10 cursor-default'
                }
              >
                {remainingTags.map((tag, index) => (
                  <p key={index} className={'text--body-tooltip text-light'}>
                    {tag}
                  </p>
                ))}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      )}
    </React.Fragment>
  )
}

export default ChannelHeader
