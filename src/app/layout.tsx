import localFont from 'next/font/local'
import './globals.css'
import { LenisProvider, ReactQueryProvider } from '@/components/providers'
import Header from '@/components/layout/header'

import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import { TooltipProvider } from '@/components/shadcn/tooltip'
import { Toaster } from '@/components/shadcn/sonner'
import { HtmlTag } from '@/components/misc'
import { extractDomainAndExt } from '@/lib/utils'
import { Body } from '@/components/misc'

// Get name from enviroment var
const getDomain = extractDomainAndExt(process.env.NEXT_PUBLIC_DOMAIN)
const brandDomain = `${getDomain?.domain
  .charAt(0)
  .toUpperCase()}${getDomain?.domain.slice(1)}`
const brandExt = getDomain?.ext

const sans = localFont({
  src: '/assets/ccneue.ttf',
  display: 'swap',
  variable: '--font-sans',
})

const mono = localFont({
  src: '/assets/monospace.ttf',
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: `${brandDomain}.${brandExt}`,
  description: 'Generated by create next app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111111',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HtmlTag>
      <Body className={`${mono.variable} ${sans.variable} ${sans.className}`}>
        <Suspense fallback={null}>
          <Header />
          <LenisProvider>
            <ReactQueryProvider>
              <main
                className={
                  'min-h-layout m-auto px-4 md:px-0 w-full max-w-prefered transition-all'
                }
              >
                <TooltipProvider>{children}</TooltipProvider>
              </main>
              <Toaster />
            </ReactQueryProvider>
          </LenisProvider>
        </Suspense>
      </Body>
    </HtmlTag>
  )
}
