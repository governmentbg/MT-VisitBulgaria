'use client'

import { Input, Label, Spinner } from '@/components/ui'
import React, { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { createClientLogger } from '@/plugins/logging/client'

const logger = createClientLogger('typesense-search')

export interface TypesenseSearchResult {
  id: string
  title: string
  slug: string
  doc: {
    relationTo: string
    value: string
  }
  meta?: {
    title?: string
    description?: string
    image?: unknown
  }
  categories?: Array<{
    id: string
    title: string
  }>
}

export interface TypesenseSearchResponse {
  docs: TypesenseSearchResult[]
  totalDocs: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface TypesenseSearchProps {
  collection?: string
  onResults?: (results: TypesenseSearchResult[]) => void
  minQueryLength?: number
  placeholder?: string
}

export const TypesenseSearch: React.FC<TypesenseSearchProps> = ({
  collection = 'pages',
  onResults,
  minQueryLength = 2,
  placeholder = 'Search...',
}) => {
  const [query, setQuery] = useState('')
  const [_results, setResults] = useState<TypesenseSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < minQueryLength) {
      setResults([])
      onResults?.([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Use the plugin's search endpoint
      const response = await fetch(
        `/api/search/${collection}?q=${encodeURIComponent(searchQuery)}&per_page=12`
      )

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }

      const data: TypesenseSearchResponse = await response.json()
      setResults(data.docs || [])
      onResults?.(data.docs || [])
    } catch (err) {
      logger.error('Search error', { error: err instanceof Error ? err.message : String(err) })
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
      onResults?.([])
    } finally {
      setIsLoading(false)
    }
  }, [collection, minQueryLength, onResults])

  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch])

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="typesense-search" className="sr-only">
          Search
        </Label>
        <div className="relative">
          <Input
            id="typesense-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            placeholder={placeholder}
            className="pr-10"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default TypesenseSearch
