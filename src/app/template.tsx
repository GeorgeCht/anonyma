'use client'

import { useEffect } from 'react'
import { TransitionLayout } from '@/components/layout/'
import { motion as Motion } from 'framer-motion'
import React from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  // Prevent mobile zoom in
  useEffect(() => {
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault()
      // @ts-expect-error
      document.body.style.zoom = 0.9999
    })

    document.addEventListener('gesturechange', function (e) {
      e.preventDefault()
      // @ts-expect-error
      document.body.style.zoom = 0.9999
    })
    document.addEventListener('gestureend', function (e) {
      e.preventDefault()
      // @ts-expect-error
      document.body.style.zoom = 1
    })
  }, [])
  const motionItem = {
    hidden: {
      opacity: [1, 0],
      transition: {
        type: 'spring',
        stiffness: 100,
        delay: 0.25,
      },
      transitionEnd: {
        display: 'none',
      },
    },
    visible: {
      opacity: 1,
      transition: {
        type: 'linear',
      },
    },
  }
  return (
    <React.Fragment>
      <Motion.div
        variants={motionItem}
        initial={'visible'}
        animate={'hidden'}
        className={
          'absolute inline-block top-0 left-0 w-screen h-screen bg-dark'
        }
      />
      <TransitionLayout>{children}</TransitionLayout>
    </React.Fragment>
  )
}
