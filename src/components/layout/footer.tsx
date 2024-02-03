'use client'

import React from 'react'
import { cn, extractDomainAndExt } from '@/lib/utils'
import Link from 'next/link'
import CCLicenseIcon from '@/components/ui/icons/cc-license-icon'

const FooterDefault = ({ className }: { className?: string }) => {
  // Get name from enviroment var
  const getDomain = extractDomainAndExt(process.env.NEXT_PUBLIC_DOMAIN)
  const brandDomain = `${getDomain?.domain
    .charAt(0)
    .toUpperCase()}${getDomain?.domain.slice(1)}`
  const brandExt = getDomain?.ext

  return (
    <footer className={cn('flex flex-row pb-5', className)}>
      <Link href={'https://creativecommons.org/licenses/by-sa/4.0/'}>
        <CCLicenseIcon
          className={'opacity-30 transition-opacity hover:opacity-50'}
        />
      </Link>
      <p className={'text--body-xs text-light/30 max-w-[278px] ml-3'}>
        Released under the&nbsp;
        <Link
          className={'underline transition-all hover:text-light/50'}
          href={'https://creativecommons.org/licenses/by-sa/4.0/'}
        >
          CC BY-SA 4.0 DEED License
        </Link>
        . Copyright &copy;&nbsp;
        {new Date().getFullYear()}. {brandDomain}.{brandExt}
      </p>
    </footer>
  )
}

const TextOnly = ({ className }: { className?: string }) => {
  // Get name from enviroment var
  const getDomain = extractDomainAndExt(process.env.NEXT_PUBLIC_DOMAIN)
  const brandDomain = `${getDomain?.domain
    .charAt(0)
    .toUpperCase()}${getDomain?.domain.slice(1)}`
  const brandExt = getDomain?.ext

  return (
    <footer className={cn('text--body-xs max-w-[278px] m-auto', className)}>
      Released under the&nbsp;
      <Link href={'https://creativecommons.org/licenses/by-sa/4.0/'}>
        CC BY-SA 4.0 DEED License
      </Link>
      . Copyright &copy;&nbsp;
      {new Date().getFullYear()}. {brandDomain}.{brandExt}
    </footer>
  )
}

export { FooterDefault as Footer, TextOnly }
