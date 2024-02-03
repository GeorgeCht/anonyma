import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import React, {
  forwardRef,
  ButtonHTMLAttributes,
  ReactNode,
  ForwardedRef,
} from 'react'

export const buttonVariants = cva(
  'active:scale-[0.9785] inline-flex items-center justify-center rounded-2xl leading-base select-none transition-button ease-in-out motion-reduce:transition-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        light: 'bg-light text-dark hover:bg-offwhite',
        ghost: 'bg-transparent text-light',
      },
      size: {
        sm: 'py-3 px-[18px]',
        lg: 'h-11 px-8',
        xl: 'px-2 py-[6px] pb-[9px] text-[24px] h-[34px] w-[35px] rounded-[13px]',
        '4xl':
          'px-2 py-[6px] pb-[9px] text-[24px] h-[34px] w-[35px] rounded-[13px]',
      },
      intent: {
        fit: 'w-fit',
        full: 'w-100',
      },
    },
    defaultVariants: {
      variant: 'light',
      size: 'sm',
      intent: 'fit',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean
  loading?: boolean
}

const Button = forwardRef(
  (
    {
      className,
      children,
      variant,
      disabled,
      loading,
      size,
      intent,
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const processChildren = (children: ReactNode) => {
      const isTextOnly = typeof children === 'string'

      if (isTextOnly) {
        return (
          <span
            className={
              size === 'xl'
                ? 'text--body-xl'
                : size === '4xl'
                  ? 'text--body-4xl'
                  : 'text--body-base'
            }
          >
            {children}
          </span>
        )
      } else {
        const childArray = React.Children.toArray(children)

        const textIndex = childArray.findIndex(
          (child) => typeof child === 'string',
        )
        const otherElementsBefore = childArray.slice(0, textIndex)
        const otherElementsAfter = childArray.slice(textIndex + 1)

        return (
          <span className={'flex items-center justify-center'}>
            {otherElementsBefore}
            <span
              className={size === 'xl' ? 'text--body-xl' : 'text--body-base'}
            >
              {childArray[textIndex]}
            </span>
            {otherElementsAfter}
          </span>
        )
      }
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, intent, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {processChildren(children)}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
