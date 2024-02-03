'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { Tag } from '@/components/ui/elements'
import { cn, extractDomainAndExt } from '@/lib/utils'

const Logo = ({ state }: { state: 'dark' | 'light' }) => {
  // Get domain from enviroment var
  const getDomain = extractDomainAndExt(process.env.NEXT_PUBLIC_DOMAIN)
  const logoDomain = getDomain?.domain
  const logoExt = getDomain?.ext

  return (
    <Link
      className={'flex flex-col justify-center items-start gap-[2px]'}
      href={'/'}
    >
      <div
        className={
          'group flex justify-center items-center gap-[2px] transition-all *:transition-all'
        }
      >
        <span
          role={'heading'}
          aria-label={'logo'}
          className={cn(
            state === 'dark' && 'bg-dark',
            state === 'light' && 'bg-light',
            'w-[14px] h-[13px] mb-[1px] rounded-[2px]'
          )}
        />
        <h2
          className={clsx(
            state === 'dark' && 'text-dark',
            state === 'light' && 'text-light',
            'text-logo'
          )}
        >
          <React.Fragment>
            {getDomain &&
              logoDomain?.split('').map((char, index) => {
                let styleInner: React.CSSProperties = {
                  animationDelay: `${8.475 + index / 10}s`,
                }
                return (
                  <span
                    className={'relative animate-logo-shine'}
                    aria-hidden={'true'}
                    key={index}
                    style={styleInner}
                  >
                    {char}
                  </span>
                )
              })}
            <span className={'opacity-20'}>{logoExt}</span>
          </React.Fragment>
        </h2>
      </div>

      <Tag theme={state}>v{process.env.version}</Tag>
    </Link>
  )
}

export default Logo
