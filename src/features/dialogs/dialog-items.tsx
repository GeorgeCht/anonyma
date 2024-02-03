import clsx from 'clsx'
import React from 'react'

const DialogHeading = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h2 className={clsx('text--body-lg text-light', className)}>{children}</h2>
  )
}

const DialogLabelTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <label
      className={clsx('text--body-base text--body-833 text-light', className)}
    >
      {children}
    </label>
  )
}

const DialogLabelDescription = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <p className={clsx('text--body-sm text-light/50', className)}>{children}</p>
  )
}

const DialogClarification = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={clsx('flex flex-row gap-1.5 max-w-[334px]', className)}>
      <p className={'text--body-xs text-light'}>&#9432;</p>
      <p className={'text--body-xs text-light'}>{children}</p>
    </div>
  )
}

const DialogBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={clsx('flex flex-col gap-4 min-h-96', className)}>
      {children}
    </div>
  )
}

const DialogSeperator = ({ text = 'or' }: { text?: string }) => {
  return (
    <div className={'flex justify-center w-full'}>
      <div className={'flex flex-row w-48 items-center'}>
        <div className={'flex flex-1 h-[1px] bg-light/10 w-full'}></div>
        <div className={'flex flex-none px-4'}>
          <p className={'text--body-tooltip uppercase text-light/50'}>{text}</p>
        </div>
        <div className={'flex flex-1 h-[1px] bg-light/10 w-full'}></div>
      </div>
    </div>
  )
}

const DialogErrorMessage = ({
  state,
  forPath,
}: {
  state: ActionResponseState
  forPath: string
}) => {
  const displayError =
    state && 'errors' in state && state.errors
      ? state.errors.find((e) => e.path === forPath)
      : undefined

  if (displayError) {
    return (
      <span className={'text--body-sm text-red-700 -mt-2'}>
        {displayError.message}
      </span>
    )
  }

  return null
}

export {
  DialogBody,
  DialogErrorMessage,
  DialogHeading,
  DialogLabelTitle,
  DialogLabelDescription,
  DialogClarification,
  DialogSeperator,
}
