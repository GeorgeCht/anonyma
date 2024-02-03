'use client'

import React, { useEffect, useState } from 'react'
import { useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { getResults } from '@/app/actions/get-results'
import ChannelBanner from '@/features/channels/banner'
import * as Search from './'

const SearchResults = () => {
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<Array<Omit<Channel, 'id'>>>([])
  const searchParams = useSearchParams().get('search')

  useEffect(() => {
    searchParams &&
      startTransition(async () => {
        const searchResults = await getResults(searchParams)
        setResults(searchResults)
      })
  }, [searchParams])

  return (
    <React.Fragment>
      {isPending ? (
        <Search.Skeleton />
      ) : searchParams && results.length > 0 ? (
        results.map((result, index) => (
          <ChannelBanner
            key={index}
            title={result.name}
            className={'mt-1'}
            access={result.access}
            tags={result.tags!}
          />
        ))
      ) : (
        <Search.NoResults />
      )}
    </React.Fragment>
  )
}

export default SearchResults
