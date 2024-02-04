'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const PageSection = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <section className={cn('flex flex-col items-start', className)}>
      {children}
    </section>
  )
}

export default PageSection
