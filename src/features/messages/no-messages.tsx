import React from 'react'
import clsx from 'clsx'
import { MessageCircleMore } from 'lucide-react'

const NoMessages = ({
  title = 'No messages yet',
  subtitle = 'Seems a little empty in here. Send a message to get started.',
  className,
}: {
  title?: string
  subtitle?: string
  className?: string
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col justify-center items-center w-full h-[42vh] pt-16',
        'pb-2 *:cursor-default',
        className,
      )}
    >
      <MessageCircleMore
        strokeWidth={0.5}
        className={'text-light/30 w-24 h-24 pb-4'}
      />
      <h5 className={'text--body-lg text-light/30 pb-2'}>{title}</h5>
      <span
        className={'text--mono-caps-sm flex text-light/20 max-w-56 text-center'}
      >
        {subtitle}
      </span>
    </div>
  )
}

export default NoMessages
