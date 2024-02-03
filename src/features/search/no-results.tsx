import clsx from 'clsx'
import React from 'react'

const NoResults = ({
  title = 'Nothing here...',
  subtitle = "Seems a lil' empty in here doesn't it?",
  className,
}: {
  title?: string
  subtitle?: string
  className?: string
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col relative z-10 w-full bg-gray/30 py-4 px-3 rounded-md',
        'h-36 before:content-empty before:bg-gradient-to-t before:from-dark',
        'before:rounded-md before:w-full before:z-[-1] before:top-0 before:left-0',
        'before:absolute before:inline-flex before:h-full *:cursor-default',
        className
      )}
    >
      <h5 className={'text--body-lg text-light/30 pb-4'}>{title}</h5>
      <span className={'text--mono-caps-sm text-light/20 max-w-36'}>
        {subtitle}
      </span>
    </div>
  )
}

export default NoResults
