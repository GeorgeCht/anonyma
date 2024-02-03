'use client'

import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendMessageSchema, SendMessageSchemaType } from '@/lib/validators'
import { Input } from '@/components/shadcn/input'
import { sendMessage } from '@/app/actions/send-message'
import { motion as Motion } from 'framer-motion'
import Button from '@/components/ui/elements/button'

const MessageInput = ({ id }: Pick<Channel, 'id'>) => {
  const { register, reset, setError } = useForm<SendMessageSchemaType>({
    resolver: zodResolver(sendMessageSchema),
  })
  const { pending } = useFormStatus()
  const [state, formAction] = useFormState<ActionResponseState, FormData>(
    sendMessage,
    null
  )
  useEffect(() => {
    if (!state) {
      return
    }
    state.status === 'error' && toast.error(state.message)
    state.status === 'success' && reset()
  }, [state, setError, reset])

  const motionItem = {
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        ease: [0.17, 0.67, 0.83, 0.67],
        stiffness: 200,
        delay: 0.75,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        delay: 0.75,
      },
    },
  }

  return (
    <Motion.div
      variants={motionItem}
      initial={'hidden'}
      animate={'visible'}
      className={
        'sticky flex w-full bottom-0 py-3 bg-dark after:inline-flex after:-top-3 after:absolute after:-mt-3 after:bg-gradient-to-t after:from-dark after:content-empty after:w-full after:h-6'
      }
    >
      <form
        onSubmit={() => {
          document.getElementById('scrollToBottom-button--trigger')?.click()
        }}
        action={formAction}
        className={
          'flex gap-3 w-full py-1 px-1 items-center bottom-3 rounded-[16px] border border-light/10 overflow-hidden bg-gray/70 hover:bg-gray/80 backdrop-blur-xl transition-colors'
        }
      >
        <Input
          className={'hidden'}
          aria-hidden
          value={id}
          {...register('id')}
        />
        <Input
          autoComplete={'off'}
          hasOutline={false}
          type={'text'}
          placeholder={'Type here...'}
          className={
            'w-full relative bg-dark text--mono-base border-0 text-light outline-none bg-transparent focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-0'
          }
          {...register('message')}
        />
        <Button
          type={'submit'}
          size={'xl'}
          className={'h-[34px] w-[35px]'}
          loading={pending}
        >
          →
        </Button>
      </form>
    </Motion.div>
  )
}

export default MessageInput
