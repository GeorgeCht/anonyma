import { cn } from '@/lib/utils'
import React, { HTMLAttributes } from 'react'

interface KeyboardKeysProps extends HTMLAttributes<HTMLSpanElement> {
  keys: Array<string>
}

const KeyboardKeys: React.FC<KeyboardKeysProps> = ({
  keys,
  className,
  ...props
}) => {
  return (
    <span className={cn('flex items-center group gap-1', className)} {...props}>
      {keys.map((key, index) => (
        <abbr
          key={index}
          className={`no-underline text--mono-xs border border-light/15 text-light/40 tracking-widest transition-colors duration-100 ease-in-out cursor-default rounded ${
            key === '+'
              ? 'border-none'
              : 'py-[3px] px-[3px] group-hover:bg-offgray/20 group-hover:text-light/50'
          }`}
          title={keys.join(' ')}
        >
          {key}
        </abbr>
      ))}
    </span>
  )
}

export default KeyboardKeys
