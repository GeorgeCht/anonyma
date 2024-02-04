'use client'

import React from 'react'
import useSettings from '@/stores/settings'

const HtmlTag = ({ children }: { children: React.ReactNode }) => {
  const textSize = useSettings((state) => state.prefersTextSize)
  const viewSize = useSettings((state) => state.prefersViewSize)
  const theme = useSettings((state) => state.prefersTheme)
  return (
    <html
      lang={'en'}
      data-theme={theme}
      data-prefers-view={viewSize}
      data-prefers-text-size={textSize}
    >
      {children}
    </html>
  )
}

export default HtmlTag
