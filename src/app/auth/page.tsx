'use client'

import React, { Suspense, useEffect } from 'react'
import { useTransition, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { wait } from '@/lib/utils'
import { authUser } from '@/app/actions/auth-user'
import { createUser } from '@/app/actions/create-user'
import { PleaseWait, LoaderKeywords } from '@/features/auth'

const LoaderPage = () => {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { push } = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')

  useEffect(() => {
    const userCreationTimeout = Math.floor(Math.random() * 1000) + 400
    const userAuthTimeout = Math.floor(Math.random() * 1000) + 400
    const errorTimeout = Math.floor(Math.random() * 1000) + 400

    const timer = setTimeout(() => {
      startTransition(async () => {
        const newUser = await createUser()
        if (newUser) {
          const authedUser = await authUser(newUser)
          setIsLoading(false)
          if (authedUser) {
            await wait(userCreationTimeout)
            if (redirectParam) {
              push(`/c/${redirectParam}?onboarding`)
            } else {
              push('/browse?onboarding')
            }
          } else {
            await wait(userAuthTimeout)
            push('/error?unexpected')
          }
        } else {
          await wait(errorTimeout)
          push('/error?unexpected')
        }
      })
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Suspense fallback={null}>
      <div
        className={
          'flex flex-col min-h-screen justify-center items-center -mt-[70px] text-light'
        }
      >
        <Loader2 strokeWidth={1} className={'h-11 w-11 animate-spin'} />
        <LoaderKeywords almostReady={isPending && isLoading} />
        <PleaseWait />
      </div>
    </Suspense>
  )
}

export default LoaderPage
