'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const Body = ({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) => {
  return (
    <body
      className={cn(
        'relative text-light overflow-x-hidden bg--body-dark',
        className
      )}
    >
      {children}
    </body>
  )
}

export default Body
