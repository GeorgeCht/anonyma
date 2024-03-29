'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/shadcn/carousel'
import { type CarouselApi } from '@/components/shadcn/carousel'
import Autoplay from 'embla-carousel-autoplay'
import React, { useEffect } from 'react'
import clsx from 'clsx'
import ChannelCard from './card'

interface Channel {
  title: string
  tags: Array<string>
}

const HeroCarousel = ({
  className,
  autoplayDelay = 2000,
  channels,
}: {
  className?: string
  autoplayDelay?: number
  channels: Array<Channel>
}) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const plugin = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true })
  )

  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      setApi={setApi}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      className={clsx(
        'w-full sm:max-w-prefered max-w-[calc(100vw-32px)]',
        className
      )}
      data-fade-right
    >
      <CarouselContent>
        {channels.map((channel, index) => (
          <CarouselItem
            className={'basis-[90%] sm:basis-[378px] p-[2px]'}
            key={channel.title}
          >
            <ChannelCard
              title={channel.title}
              tags={channel.tags}
              theme={index === 0 ? 'accent' : index === 1 ? 'light' : 'dark'}
              variant={'lg'}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default HeroCarousel
