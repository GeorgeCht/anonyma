import * as React from 'react'

import clsx from 'clsx'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasOutline?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasOutline = true, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          'flex h-9 w-full px-3 pb-1.5 pt-2 text-sm ring-offset-background file:border-0',
          'file:bg-transparent file:text-sm file:font-medium placeholder:text-light/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'rounded-md bg-gray/90 border border-light/10 sm:py-2',
          hasOutline &&
            'focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
