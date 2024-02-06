'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { querySearchResults } from '@/app/actions/query-search-results'

import ChannelBanner from '@/features/channels/banner'
import * as Search from './'

const SearchResults = ({ query }: { query: string }) => {
  const searchQuery = query
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const { isLoading, data: searchResults } = useQuery<
    Array<Omit<Channel, 'id'>>
  >({
    queryKey: [`search-results-${searchQuery}`],
    queryFn: () => querySearchResults(searchQuery),
    staleTime: 5 * 60 * 1000, // 5mins
  })

  return (
    <React.Fragment>
      {isLoading ? (
        <Search.Skeleton />
      ) : searchResults && searchResults.length > 0 ? (
        searchResults.map((result, index) => (
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
