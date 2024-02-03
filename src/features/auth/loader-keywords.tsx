'use client'

import { useEffect, useMemo, useState } from 'react'

const LoaderKeywords = ({ almostReady = false }: { almostReady?: boolean }) => {
  const keywords = useMemo(
    () => [
      'Encrypting data',
      'Testing connection',
      'Connecting to proxy',
      'Verifying host address',
      'Optimizing algorithms',
      'Analyzing data',
      'Securing authentication',
      'Managing configurations',
      'Updating protocols',
      'Resolving dependencies',
    ],
    []
  )
  const [keyword, setKeyword] = useState<string>(keywords[0])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * keywords.length)
      setKeyword(keywords[randomIndex])
    }, Math.random() * 1200 + 350)

    return () => clearInterval(intervalId)
  }, [keywords])
  return (
    <span className={'text--body-lg mt-8'}>
      {almostReady ? 'Almost ready' : keyword}
    </span>
  )
}

export default LoaderKeywords
