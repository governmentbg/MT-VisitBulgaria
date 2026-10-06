'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/routing'
import { useCallback, useMemo } from 'react'
import type { BlockSearchFilters, SortOption } from '../types'
import { BLOCK_PARAM_KEYS } from '../types'

export interface BlockParamsState {
  filters: BlockSearchFilters
  sort: SortOption
  page: number
  query: string
}

const parseCommaParam = (value: string | null, fallback?: string[]): string[] | undefined => {
  if (value) return value.split(',').filter(Boolean)
  return fallback
}

const arraysEqual = (a?: string[], b?: string[]) => JSON.stringify(a) === JSON.stringify(b)

export function useBlockParams(defaults: {
  type?: string[]
  categories?: string[]
  tags?: string[]
  region?: string[]
  municipality?: string[]
  city?: string[]
  sort?: SortOption
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const state: BlockParamsState = useMemo(() => {
    return {
      filters: {
        type: parseCommaParam(searchParams.get('type'), defaults.type),
        categories: parseCommaParam(searchParams.get('categories'), defaults.categories),
        tags: parseCommaParam(searchParams.get('tags'), defaults.tags),
        region: parseCommaParam(searchParams.get('region'), defaults.region),
        municipality: parseCommaParam(searchParams.get('municipality'), defaults.municipality),
        city: parseCommaParam(searchParams.get('city'), defaults.city),
        starRating: parseCommaParam(searchParams.get('starRating')),
        amenities: parseCommaParam(searchParams.get('amenities')),
        cuisineType: parseCommaParam(searchParams.get('cuisineType')),
        dietaryOptions: parseCommaParam(searchParams.get('dietaryOptions')),
        difficultyLevel: parseCommaParam(searchParams.get('difficultyLevel')),
        seasonality: parseCommaParam(searchParams.get('seasonality')),
        organizer: parseCommaParam(searchParams.get('organizer')),
      },
      sort: (searchParams.get('sort') as SortOption) ?? defaults.sort ?? 'relevance',
      page: parseInt(searchParams.get('page') ?? '1', 10),
      query: searchParams.get('q') ?? '',
    }
  }, [searchParams, defaults])

  const buildUrl = useCallback(
    (newState: Partial<BlockParamsState>) => {
      // Preserve non-block params from the URL
      const params = new URLSearchParams()
      for (const [key, value] of searchParams.entries()) {
        if (!(BLOCK_PARAM_KEYS as readonly string[]).includes(key)) {
          params.set(key, value)
        }
      }

      const mergedFilters = { ...state.filters, ...newState.filters }
      const mergedSort = newState.sort ?? state.sort
      const mergedPage = newState.page ?? 1
      const mergedQuery = newState.query ?? state.query

      const setOrDelete = (key: string, value: string | undefined) => {
        if (value) params.set(key, value)
        else params.delete(key)
      }

      const setArrayParam = (key: string, values?: string[], defaultValues?: string[]) => {
        setOrDelete(
          key,
          values?.length && !arraysEqual(values, defaultValues)
            ? values.join(',')
            : undefined,
        )
      }

      // Only set params that differ from defaults
      setArrayParam('type', mergedFilters.type, defaults.type)
      setArrayParam('categories', mergedFilters.categories, defaults.categories)
      setArrayParam('tags', mergedFilters.tags, defaults.tags)
      setArrayParam('region', mergedFilters.region, defaults.region)
      setArrayParam('municipality', mergedFilters.municipality, defaults.municipality)
      setArrayParam('city', mergedFilters.city, defaults.city)
      setArrayParam('starRating', mergedFilters.starRating)
      setArrayParam('amenities', mergedFilters.amenities)
      setArrayParam('cuisineType', mergedFilters.cuisineType)
      setArrayParam('dietaryOptions', mergedFilters.dietaryOptions)
      setArrayParam('difficultyLevel', mergedFilters.difficultyLevel)
      setArrayParam('seasonality', mergedFilters.seasonality)
      setArrayParam('organizer', mergedFilters.organizer)
      setOrDelete(
        'sort',
        mergedSort !== (defaults.sort ?? 'relevance') ? mergedSort : undefined,
      )
      setOrDelete('page', mergedPage > 1 ? String(mergedPage) : undefined)
      setOrDelete('q', mergedQuery || undefined)

      const queryString = params.toString()
      return `${pathname}${queryString ? `?${queryString}` : ''}`
    },
    [searchParams, state, pathname, defaults],
  )

  const updateFilters = useCallback(
    (newState: Partial<BlockParamsState>) => {
      const url = buildUrl({ ...newState, page: 1 })
      router.replace(url, { scroll: false })
    },
    [buildUrl, router],
  )

  const updatePage = useCallback(
    (page: number) => {
      const url = buildUrl({ page })
      router.push(url, { scroll: false })
    },
    [buildUrl, router],
  )

  const hasActiveParams = useMemo(() => {
    for (const key of BLOCK_PARAM_KEYS) {
      if (searchParams.has(key)) return true
    }
    return false
  }, [searchParams])

  return { state, updateFilters, updatePage, hasActiveParams, buildUrl }
}
