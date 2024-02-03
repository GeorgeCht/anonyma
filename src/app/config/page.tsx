'use server'

import React, { Suspense } from 'react'

import { PageSection, StickyHeader } from '@/components/layout'
import MainHeading from '@/components/ui/headings/main'

export default async function Page({ params }: { params: { key: string } }) {
  return (
    <Suspense fallback={null}>
      <PageSection>
        <StickyHeader>
          <div className={'flex items-center justify-between gap-6 sm:gap-8'}>
            <MainHeading>Config</MainHeading>
          </div>
        </StickyHeader>
        <div className={'flex flex-col justify-between w-full min-h-inner'}>
          <p>{params.key}</p>
        </div>
      </PageSection>
    </Suspense>
  )
}
