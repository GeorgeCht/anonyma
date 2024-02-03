'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className={'toaster group'}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-dark/70 group-[.toaster]:backdrop-blur-xl group-[.toaster]:py-3 group-[.toaster]:px-4 group-[.toaster]:text-light group-[.toast]:font-sans group-[.toast]:font-semibold group-[.toast]:text-[15px] group-[.toaster]:border-border group-[.toaster]:border-light/10 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-light/75',
          actionButton:
            'group-[.toast]:bg-light group-[.toast]:text-dark group-[.toast]:rounded-2xl group-[.toast]:font-semibold group-[.toast]:h-8 group-[.toast]:px-3 group-[.toast]:text-[15px] group-[.toast]:pt-[3px] group-[.toast]:font-sans',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

/* bg-dark/70 border-light/10 backdrop-blur-xl */
