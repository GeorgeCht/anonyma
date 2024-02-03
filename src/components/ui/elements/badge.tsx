import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, FC } from 'react'
import clsx from 'clsx'

export const badgeVariants = cva(
  'relative w-fit flex items-center justify-center cursor-default border py-[4px] px-[5px] rounded-xl',
  {
    variants: {
      variant: {
        light: 'bg-light/[0.06] text-light/50 border-light/10',
        dark: 'text-dark border-dark/40',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  indicator?: boolean
}

const Badge: FC<BadgeProps> = ({
  className,
  children,
  variant,
  indicator = false,
  ...props
}) => {
  return (
    <span className={clsx(badgeVariants({ variant, className }))} {...props}>
      {indicator && (
        <span
          className={
            'h-[6px] w-[6px] inline-block bg-green-500 rounded-full animate-pulse drop-shadow-indicator-green mr-1'
          }
        />
      )}
      <span className="text--mono-caps-sm py-[2px]">{children}</span>
    </span>
  )
}

export default Badge
