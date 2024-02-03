'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/shadcn/carousel'
import { type CarouselApi } from '@/components/shadcn/carousel'
import Autoplay from 'embla-carousel-autoplay'

import React, { FC, useCallback, useContext, useLayoutEffect } from 'react'
import * as Search from '@/features/search'

import { useSearchParams } from 'next/navigation'

import { useLenis } from '@/features/essentials/lenis'
import DotIcon from '@/components/ui/icons/dot-icon'
import ActionsDropdown from '@/features/dropdowns/actions-dropdown'
import { Footer, PageSection, StickyHeader } from '@/components/layout'

import * as Dialog from '@/features/dialogs'
import * as Channels from '@/features/channels'
import SubHeading from '@/components/ui/headings/sub'
import MainHeading from '@/components/ui/headings/main'
import ChannelBanner from '@/features/channels/banner'

const Page: FC = () => {
  const searchParams = useSearchParams().get('search')

  return (
    <React.Fragment>
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
                  <Channels.HeroCarousel
                    channels={[
                      {
                        title: 'general',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                      {
                        title: 'politics',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                      {
                        title: 'custom',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                      {
                        title: 'chatrooms',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                    ]}
                  />
                </div>

                <h2
                  className={
                    'text--body-xl text-light mb-3 mt-6 cursor-default'
                  }
                >
                  Latest
                </h2>
                <div
                  className={
                    'flex gap-1 w-full max-w-prefered overflow-x-hidden'
                  }
                >
                  <Channels.Carousel
                    channels={[
                      {
                        title: 'general',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                      {
                        title: 'politics',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                      {
                        title: 'custom',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                      {
                        title: 'chatrooms',
                        tags: ['Public', 'Links', 'Tags', 'Twitch'],
                      },
                    ]}
                  />
                </div>

                <h2
                  className={
                    'text--body-xl text-light mb-3 mt-6 cursor-default'
                  }
                >
                  Community
                </h2>

                <ChannelBanner
                  title={'general'}
                  tags={['Public', 'Links', 'Tags', 'Twitch']}
                />
                <ChannelBanner
                  title={'politics'}
                  className={'mt-1'}
                  tags={[
                    'Public',
                    'Orange',
                    'Amazon',
                    'Facebook',
                    'Public',
                    'Orange',
                    'Amazon',
                    'Facebook',
                  ]}
                />
                <ChannelBanner
                  title={'test'}
                  className={'mt-1'}
                  tags={[
                    'Public',
                    'Links',
                    'Test',
                    'Thots',
                    'Links',
                    'Test',
                    'Thots',
                  ]}
                />
              </React.Fragment>
            ) : (
              <Search.Results />
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
    </React.Fragment>
  )
}

export default Page
