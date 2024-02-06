import Badge from '@/components/ui/elements/badge'
import Link from 'next/link'
import clsx from 'clsx'
import { joinTagsAndTrim } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import React from 'react'

const ChannelBanner = ({
  title,
  tags,
  access,
  className,
}: {
  title: string
  access?: string
  tags: Array<string>
  className?: string
}) => {
  // Push access type as a tag if it exists
  access !== null &&
    access !== undefined &&
    tags.filter((tag) => !tag.includes('private' || 'public')) &&
    tags.push(access)

  // Split tags via unique set
  const { trimmedTags, remainingTags } = joinTagsAndTrim([...new Set(tags)], 28)

  return (
    <Link
      className={clsx(
        'block p-[10px] rounded-md transition-colors border bg-gray/50 hover:bg-gray border-light/10 hover:border-light/15 w-full overflow-x-hidden',
        className,
      )}
      href={`/c/${title.toLowerCase()}`}
    >
      <h3
        className={clsx(
          'text--body-lg transition-colors text-light/85 hover:text-light w-full',
        )}
      >
        /{title.toLowerCase()}
      </h3>
      <div className={'flex flex-row gap-1 mt-2'}>
        {tags.length > 0 &&
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
    </Link>
  )
}

export default ChannelBanner
