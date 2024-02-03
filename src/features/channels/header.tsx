'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
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
          {channel.tags?.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
      )}
    </React.Fragment>
  )
}

export default ChannelHeader
