import clsx from 'clsx'
import { HTMLAttributes } from 'react'

export interface StickyHeaderProps extends HTMLAttributes<HTMLSpanElement> {}

const StickyHeader = ({ children, className, ...props }: StickyHeaderProps) => {
  return (
    <div
      {...props}
      className={clsx(
        'w-full sticky z-30 top-[70px] bg-dark pb-2 after:inline-flex',
        'after:bottom-0 after:absolute after:-mb-3 after:bg-gradient-to-b',
        'after:from-dark after:content-empty after:w-full after:h-5',
        className
      )}
    >
      {children}
    </div>
  )
}

export default StickyHeader
