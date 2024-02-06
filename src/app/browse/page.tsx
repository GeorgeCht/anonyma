'use client'

import React, { Suspense, useEffect, useState, useTransition } from 'react'

import { useSearchParams } from 'next/navigation'
import { Footer } from '@/components/layout'
import { PageSection, StickyHeader } from '@/components/misc'

import * as Dialog from '@/features/dialogs'
import * as Channels from '@/features/channels'
import * as Search from '@/features/search'

import DotIcon from '@/components/ui/icons/dot-icon'
import ActionsDropdown from '@/features/dropdowns/actions-dropdown'
import SubHeading from '@/components/ui/headings/sub'
import MainHeading from '@/components/ui/headings/main'
import ChannelBanner from '@/features/channels/banner'
import SearchSkeleton from '@/features/search/skeleton'
import permanentChannels from '@/lib/permanent_channels.json'
import { useQuery } from '@tanstack/react-query'
import { queryCommunityChannels } from '../actions/query-community-channels'

const Page = () => {
  const searchParams = useSearchParams().get('search')

  // Hero carousel display via permanent channels
  const heroChannelItems = permanentChannels.slice(0, 5)

  // Latest channels via permanent channels
  const latestChannelItems = permanentChannels
    .slice(5)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  const { isLoading, data: communityChannels } = useQuery<
    Array<Pick<Channel, 'name' | 'tags' | 'access'>>
  >({
    queryKey: ['community-channels'],
    queryFn: () => queryCommunityChannels(),
    staleTime: 5 * 60 * 1000, // 5mins
  })

  return (
    <Suspense fallback={null}>
      <PageSection>
        <StickyHeader>
          <div className={'flex items-center justify-between gap-6 sm:gap-8'}>
            <MainHeading>{searchParams ? 'Results' : 'Browse'}</MainHeading>
            <ActionsDropdown>
              <div className={'pl-6 py-2 hover:cursor-pointer'}>
                <DotIcon />
              </div>
            </ActionsDropdown>
          </div>
        </StickyHeader>
        <div className={'flex flex-col justify-between w-full min-h-inner'}>
          <div>
            {!searchParams ? (
              <React.Fragment>
                <SubHeading>Featured</SubHeading>
                <div
                  className={
                    'flex gap-1 w-full max-w-prefered overflow-x-hidden'
                  }
                >
                  <Channels.HeroCarousel channels={heroChannelItems} />
                </div>

                <SubHeading className={'mb-3 mt-6'}>Latest</SubHeading>
                <div
                  className={
                    'flex gap-1 w-full max-w-prefered overflow-x-hidden'
                  }
                >
                  <Channels.Carousel channels={latestChannelItems} />
                </div>

                <SubHeading className={'mb-3 mt-6'}>Community</SubHeading>
                {!isLoading ? (
                  <div className={'flex flex-col gap-1'}>
                    {communityChannels?.length! > 0 ? (
                      communityChannels?.map((channel) => {
                        return (
                          <ChannelBanner
                            key={channel.name}
                            access={channel.access}
                            title={channel.name}
                            tags={channel.tags!}
                          />
                        )
                      })
                    ) : (
                      <Search.NoResults />
                    )}
                  </div>
                ) : (
                  <SearchSkeleton />
                )}
              </React.Fragment>
            ) : searchParams.length >= 3 ? (
              <Search.Results query={searchParams} />
            ) : (
              <Search.NoResults
                title={'Search must have over 3 characters'}
                subtitle={''}
              />
            )}
          </div>
          <Footer className={'pt-6'} />
        </div>
      </PageSection>
      <Dialog.NewChannel>
        <button
          id={'trigger--new-channel-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.NewChannel>
      <Dialog.Settings>
        <button
          id={'trigger--settings-dialog'}
          className={'hidden'}
          aria-hidden
        />
      </Dialog.Settings>
    </Suspense>
  )
}

export default Page
