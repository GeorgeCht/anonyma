'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const InnerSection = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <section className={cn('relative min-h-inner', className)}>
      {children}
    </section>
  )
}

export default InnerSection
