'use client'

import React, { Suspense } from 'react'

import { Footer, InnerSection } from '@/components/layout'
import { useRouter } from 'next/navigation'

import * as Heading from '@/components/ui/headings'
import { Button } from '@/components/ui/elements'

export default function NotFoundPage() {
  const router = useRouter()
  return (
    <Suspense fallback={null}>
      <InnerSection>
        <div className={'flex flex-col justify-between w-full min-h-layout'}>
          <div>
            <Heading.Main>Unexpected error</Heading.Main>
            <Heading.Sub>¯\_(ツ)_/¯</Heading.Sub>
            <Button
              intent={'full'}
              size={'lg'}
              className={'mt-6'}
              onClick={() => router.push('/')}
            >
              Go back
            </Button>
          </div>
          <Footer className={'pt-6'} />
        </div>
      </InnerSection>
    </Suspense>
  )
}
