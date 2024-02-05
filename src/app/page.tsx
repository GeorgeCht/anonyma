'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion as Motion } from 'framer-motion'
import { TextOnly as Footer } from '@/components/layout/footer'

import clsx from 'clsx'
import Image from 'next/image'
import Button from '@/components/ui/elements/button'
import Marquee from 'react-fast-marquee'
import useSettings from '@/stores/settings'

import * as Landing from '@/features/landing'

const HomePage = () => {
  const router = useRouter()
  const { setToDefault } = useSettings()
  const motionItemUpper = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        opacity: {
          delay: 0.875,
        },
      },
    },
  }
  const motionItemLower = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        opacity: {
          delay: 1.025,
        },
      },
    },
  }

  const imgRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    setToDefault()
    const body = document.body
    body.classList.remove('bg--body-dark')
    body.classList.add('bg--body-gradient')
    return () => {
      body.classList.remove('bg--body-gradient')
      body.classList.add('bg--body-dark')
    }
  }, [])
  return (
    <React.Fragment>
      <Landing.SectionWrapper>
        <Image
          ref={imgRef}
          src={'/img--landing.webp'}
          alt={'hero-image'}
          width={907}
          height={1080}
          priority={true}
          onLoad={() =>
            setTimeout(() => {
              imgRef.current?.classList.add('opacity-100')
            }, 785)
          }
          className={clsx(
            'mix-blend-multiply absolute bottom-0 opacity-0 landing--img',
            'right-[calc(50%-200px)] sm:right-[calc(50%-630px)] z-[1]',
          )}
        />
        <Landing.BlurFX />
        <Landing.EsotericWrapper>
          <Motion.div
            variants={motionItemUpper}
            initial={'hidden'}
            animate={'show'}
            role={'group'}
            className={'w-full'}
          >
            <Marquee speed={35} direction={'left'} className={'marquee-mask'}>
              <div className={'flex flex-row gap-2 mr-1.5'}>
                <Landing.MarqueeTag innerText={'gaming'} />
                <Landing.MarqueeTag innerText={'politics'} />
                <Landing.MarqueeTag innerText={'anime'} />
                <Landing.MarqueeTag innerText={'general'} />
                <Landing.MarqueeTag innerText={'twitch'} />
              </div>
            </Marquee>
            <Marquee
              speed={35}
              direction={'right'}
              className={'marquee-mask mt-2'}
            >
              <div className={'flex flex-row gap-2 mr-1.5'}>
                <Landing.MarqueeTag innerText={'gaming'} />
                <Landing.MarqueeTag innerText={'politics'} />
                <Landing.MarqueeTag innerText={'anime'} />
                <Landing.MarqueeTag innerText={'general'} />
                <Landing.MarqueeTag innerText={'twitch'} />
              </div>
            </Marquee>
          </Motion.div>

          <Motion.div
            variants={motionItemLower}
            initial={'hidden'}
            animate={'show'}
            role={'group'}
            className={'w-full'}
          >
            <h1 className={'text--body-xl max-w-[286px] m-auto pb-4'}>
              Encrypted anonymous chat channels for everyone.
            </h1>
            <Button
              intent={'fit'}
              size={'lg'}
              className={'mb-8'}
              onClick={(e) => {
                e.preventDefault()
                router.push('/auth')
              }}
            >
              Get started here
            </Button>
            <Footer />
          </Motion.div>
        </Landing.EsotericWrapper>
      </Landing.SectionWrapper>
    </React.Fragment>
  )
}
export default HomePage
