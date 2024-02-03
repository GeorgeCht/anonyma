'use client'

import React, { Suspense } from 'react'

import { Footer, InnerSection } from '@/components/layout'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import * as Heading from '@/components/ui/headings'
import { Button } from '@/components/ui/elements'

export default function NotFoundPage() {
  const pathname = usePathname()
  const router = useRouter()
  const missingElement = pathname.startsWith('/c/') ? 'Channel' : 'Page'

  toast.error(`${missingElement} not found`, {
    description: `The ${missingElement.toLowerCase()} you' re looking for has probably expired.`,
  })
  return (
    <Suspense>
      <InnerSection>
        <div className={'flex flex-col justify-between w-full min-h-layout'}>
          <div>
            <Heading.Main>{missingElement} not found</Heading.Main>
            <Heading.Sub>¯\_(ツ)_/¯</Heading.Sub>
            <Button
              intent={'full'}
              size={'lg'}
              className={'mt-6'}
              onClick={() => router.push('/browse')}
            >
              Browse channels
            </Button>
          </div>
          <Footer className={'pt-6'} />
        </div>
      </InnerSection>
    </Suspense>
  )
}
