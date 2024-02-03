import clsx from 'clsx'
import { HTMLAttributes, FC } from 'react'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  theme?: 'light' | 'dark'
}

const Tag: FC<TagProps> = ({ theme = 'light', children }) => {
  return (
    <span
      className={clsx(
        'relative w-fit flex items-center justify-center border py-[3px] px-[4px]',
        'rounded-xl  transition-colors -mt-2',
        theme === 'light' &&
          'text-light/60 border-light/10 hover:text-light/80',
        theme === 'dark' && 'text-dark/60 border-dark/10 hover:text-dark/80'
      )}
    >
      <span className="text--mono-xs text-[9px] py-[1px]">{children}</span>
    </span>
  )
}

export default Tag
