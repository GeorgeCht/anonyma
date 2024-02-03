import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import LenisProvider from '../features/essentials/lenis'
import Header from '../components/layout/header'
import { TooltipProvider } from '@/components/shadcn/tooltip'
import { Toaster } from '@/components/shadcn/sonner'
import { Body } from '@/components/layout'
import HtmlTag from '@/components/layout/html-tag'

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
  title: 'Anonyma.xyz', // TODO: Change name via env variable and add SEO stuff
  description: 'Generated by create next app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HtmlTag>
      <Body className={`${mono.variable} ${sans.variable} ${sans.className}`}>
        <Header />
        <LenisProvider>
          <main
            className={
              'min-h-layout m-auto px-4 md:px-0 w-full max-w-prefered transition-all'
            }
          >
            <TooltipProvider>{children}</TooltipProvider>
          </main>
          <Toaster />
        </LenisProvider>
      </Body>
    </HtmlTag>
  )
}
