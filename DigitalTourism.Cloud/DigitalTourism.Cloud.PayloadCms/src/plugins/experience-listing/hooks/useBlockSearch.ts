'use client'

import React, { useEffect, useState, useCallback, useTransition, useRef, useMemo } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useBlockParams } from './useBlockParams'
import { useTranslations } from 'next-intl'
import { searchExperiences, SORT_TO_TYPESENSE, type ExperienceSearchResponse, type ExperienceSearchResult, type SortOption } from '@/lib/search'
import type { NomenclatureDisplayData } from '@/lib/search'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { cn } from '@/components/ui'
import type { BlockSearchFilters, FacetValue } from '../types'
import type { AppliedFilter } from '@/components/filters'

export interface UseBlockSearchOptions {
  locale: string
  initialResults: ExperienceSearchResponse
  defaults: {
    type?: string[]
    categories?: string[]
    tags?: string[]
    region?: string[]
    municipality?: string[]
    city?: string[]
    sort?: SortOption
  }
  itemsPerPage: number
  paginationMode: 'pagination' | 'loadMore'
  blockId: string
  nomenclatureMap?: Record<string, NomenclatureDisplayData>
  /** When true, page changes scroll to the top of the page instead of the block */
  scrollToPageTop?: boolean
}

export function useBlockSearch({
  locale,
  initialResults,
  defaults,
  itemsPerPage,
  paginationMode,
  blockId,
  nomenclatureMap,
  scrollToPageTop,
}: UseBlockSearchOptions) {
  const t = useTranslations('experienceListing')
  const { state, updateFilters, updatePage, hasActiveParams, buildUrl } = useBlockParams(defaults)

  // Compute which filter keys have admin-configured defaults — hide them from the drawer
  const hiddenFilters = useMemo(() => {
    const hidden = new Set<keyof BlockSearchFilters>()
    if (defaults.type?.length) hidden.add('type')
    if (defaults.categories?.length) hidden.add('categories')
    if (defaults.tags?.length) hidden.add('tags')
    if (defaults.region?.length) hidden.add('region')
    if (defaults.municipality?.length) hidden.add('municipality')
    if (defaults.city?.length) hidden.add('city')
    return hidden
  }, [defaults])

  // If URL has params that differ from server defaults, don't show stale initial results
  const needsClientFetch = hasActiveParams
  const [results, setResults] = useState<ExperienceSearchResult[]>(needsClientFetch ? [] : initialResults.hits)
  const [totalFound, setTotalFound] = useState(needsClientFetch ? 0 : initialResults.found)
  const [totalPages, setTotalPages] = useState(needsClientFetch ? 1 : initialResults.totalPages)
  // Baseline facets: the full set of values from the initial (unfiltered) search.
  // We merge every subsequent response into this baseline so that values with 0
  // matches after filtering still appear in the UI (with count=0).
  const baselineFacetsRef = useRef<Record<string, FacetValue[]> | undefined>(
    initialResults.facets as Record<string, FacetValue[]> | undefined,
  )

  const mergeFacets = useCallback(
    (responseFacets: Record<string, FacetValue[]> | undefined): Record<string, FacetValue[]> | undefined => {
      const baseline = baselineFacetsRef.current
      if (!baseline) return responseFacets
      if (!responseFacets) return baseline

      const merged: Record<string, FacetValue[]> = {}
      // Start from baseline keys so we never lose a facet group
      const allKeys = new Set([...Object.keys(baseline), ...Object.keys(responseFacets)])

      for (const key of allKeys) {
        const baseValues = baseline[key] ?? []
        const responseValues = responseFacets[key] ?? []
        const responseMap = new Map(responseValues.map((fv) => [fv.value, fv.count]))

        // Keep every baseline value, updating its count from the response (0 if absent)
        const mergedValues = baseValues.map((bv) => ({
          value: bv.value,
          count: responseMap.get(bv.value) ?? 0,
        }))

        // Add any new values from response that weren't in the baseline
        for (const rv of responseValues) {
          if (!baseValues.some((bv) => bv.value === rv.value)) {
            mergedValues.push(rv)
          }
        }

        merged[key] = mergedValues
      }
      return merged
    },
    [],
  )

  const [facets, setFacets] = useState<Record<string, FacetValue[]> | undefined>(
    needsClientFetch ? undefined : initialResults.facets as Record<string, FacetValue[]> | undefined,
  )
  const [searchTimeMs, setSearchTimeMs] = useState(needsClientFetch ? 0 : initialResults.searchTimeMs)
  const [isPending, startTransition] = useTransition()
  // True until the first client fetch completes (prevents "no results" flash)
  const [isHydrating, setIsHydrating] = useState(needsClientFetch)
  const [searchQuery, setSearchQuery] = useState(state.query)
  const debouncedQuery = useDebounce(searchQuery, 300)

  // For load-more mode: accumulated results
  const [accumulatedResults, setAccumulatedResults] = useState<ExperienceSearchResult[]>(
    needsClientFetch ? [] : initialResults.hits,
  )
  const isInitialMount = useRef(true)
  const lastSearchRef = useRef<string>('')

  // Perform search
  const performSearch = useCallback(
    async (page: number, append = false) => {
      const searchKey = JSON.stringify({ filters: state.filters, sort: state.sort, query: debouncedQuery, page })
      if (searchKey === lastSearchRef.current) return
      lastSearchRef.current = searchKey

      startTransition(async () => {
        const response = await searchExperiences({
          query: debouncedQuery || '*',
          locale,
          page,
          perPage: itemsPerPage,
          filters: state.filters,
          sortBy: SORT_TO_TYPESENSE[state.sort],
        })

        // On the first response (no baseline yet), store it as the baseline
        const responseFacets = response.facets as Record<string, FacetValue[]> | undefined
        if (!baselineFacetsRef.current && responseFacets) {
          baselineFacetsRef.current = responseFacets
        }

        setResults(response.hits)
        setTotalFound(response.found)
        setTotalPages(response.totalPages)
        setFacets(mergeFacets(responseFacets))
        setSearchTimeMs(response.searchTimeMs)
        setIsHydrating(false)

        if (append) {
          setAccumulatedResults((prev) => [...prev, ...response.hits])
        } else {
          setAccumulatedResults(response.hits)
        }
      })
    },
    [state.filters, state.sort, debouncedQuery, locale, itemsPerPage, mergeFacets],
  )

  // Search when filters/sort/query change — including on mount if URL has params
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      // If URL has active params, server-rendered results used defaults — re-fetch
      if (hasActiveParams) {
        performSearch(state.page)
      }
      return
    }
    performSearch(state.page)
  }, [state.filters, state.sort, state.page, debouncedQuery, performSearch, hasActiveParams])

  // Update URL when debounced query changes
  useEffect(() => {
    if (isInitialMount.current) return
    if (debouncedQuery !== state.query) {
      updateFilters({ query: debouncedQuery })
    }
  }, [debouncedQuery])

  // Scroll to block (or page top) — delayed to run after React commits the route transition
  const scrollToBlock = useCallback(() => {
    setTimeout(() => {
      if (scrollToPageTop) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      } else {
        const el = document.getElementById(`block-${blockId}`)
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' })
        }
      }
    }, 100)
  }, [blockId, scrollToPageTop])

  // Scroll to block on mount if URL has active params
  useEffect(() => {
    if (hasActiveParams && blockId) {
      scrollToBlock()
    }
  }, [])

  const buildPageUrl = useCallback(
    (page: number) => buildUrl({ page }),
    [buildUrl],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      updatePage(page)
      scrollToBlock()
    },
    [updatePage, scrollToBlock],
  )

  const handleLoadMore = useCallback(() => {
    const nextPage = state.page + 1
    updatePage(nextPage)
    performSearch(nextPage, true)
  }, [state.page, updatePage, performSearch])

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      updateFilters({ sort })
    },
    [updateFilters],
  )

  const handleMultiFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      const current = (state.filters[key as keyof BlockSearchFilters] as string[] | undefined) || []
      const updated = checked ? [...current, value] : current.filter((v) => v !== value)
      updateFilters({ filters: { ...state.filters, [key]: updated.length > 0 ? updated : undefined } })
    },
    [state.filters, updateFilters],
  )

  const handleSingleFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      // Single-select: replace current value or clear it
      updateFilters({ filters: { ...state.filters, [key]: checked ? [value] : undefined } })
    },
    [state.filters, updateFilters],
  )

  const clearFilters = useCallback(() => {
    // Reset to only the admin-configured defaults, clearing all user-applied filters
    updateFilters({
      filters: {
        type: defaults.type,
        categories: defaults.categories,
        tags: defaults.tags,
        region: defaults.region,
        municipality: defaults.municipality,
        city: defaults.city,
        starRating: undefined,
        amenities: undefined,
        cuisineType: undefined,
        dietaryOptions: undefined,
        difficultyLevel: undefined,
        seasonality: undefined,
        organizer: undefined,
      },
    })
  }, [updateFilters, defaults])

  const removeFilter = useCallback(
    (key: string, value: string) => {
      const current = (state.filters[key as keyof BlockSearchFilters] as string[] | undefined) || []
      const defaultValues = defaults[key as keyof typeof defaults] as string[] | undefined
      const updated = current.filter((v) => v !== value)
      const merged = updated.length > 0 ? updated : defaultValues
      updateFilters({ filters: { ...state.filters, [key]: merged } })
    },
    [state.filters, updateFilters, defaults],
  )

  // Compute active filter count (excluding defaults)
  const activeFilterCount = useMemo(() =>
    Object.entries(state.filters).reduce<number>((count, [key, values]) => {
      if (!values) return count
      const defaultValues = defaults[key as keyof typeof defaults] as string[] | undefined
      const extraCount = defaultValues
        ? values.filter((v: string) => !defaultValues.includes(v)).length
        : values.length
      return count + extraCount
    }, 0),
    [state.filters, defaults],
  )

  // Localized type labels for pills
  const typeLabels: Record<string, string> = useMemo(() => ({
    hotel: t('typeHotel'),
    restaurant: t('typeRestaurant'),
    activity: t('typeActivity'),
    attraction: t('typeAttraction'),
    event: t('typeEvent'),
  }), [t])

  // Build applied filter pills (only show non-default filters)
  const appliedFilters: AppliedFilter[] = useMemo(() => {
    const pills: AppliedFilter[] = []
    const nm = nomenclatureMap ?? {}
    for (const [key, values] of Object.entries(state.filters)) {
      if (!values) continue
      const defaultValues = (defaults[key as keyof typeof defaults] as string[] | undefined) || []
      for (const v of values) {
        if (!defaultValues.includes(v)) {
          let label = v
          let renderLabel: React.ReactNode | undefined
          if (key === 'type') {
            label = typeLabels[v] || v
          } else if (key === 'starRating') {
            const rating = parseInt(v, 10)
            label = `${v} stars`
            renderLabel = React.createElement('span', { className: 'flex items-center gap-0.5' },
              ...Array.from({ length: 5 }, (_, i) =>
                React.createElement(SpriteIcon, {
                  name: 'star-filled',
                  key: i,
                  className: cn('h-3.5 w-3.5', i < rating ? 'text-warning-100' : 'text-grey-100'),
                }),
              ),
            )
          } else if (nm[v]?.label) {
            label = nm[v].label
          }
          pills.push({ key, value: v, label, renderLabel })
        }
      }
    }
    return pills
  }, [state.filters, defaults, nomenclatureMap, typeLabels])

  const displayResults = paginationMode === 'loadMore' ? accumulatedResults : results

  return {
    // State
    state,
    results: displayResults,
    totalFound,
    totalPages,
    facets,
    searchTimeMs,
    isPending: isPending || isHydrating,
    searchQuery,
    setSearchQuery,
    debouncedQuery,

    // Filter state
    activeFilterCount,
    hasActiveFilters: activeFilterCount > 0,
    appliedFilters,
    hiddenFilters,

    // Handlers
    handleMultiFilter,
    handleSingleFilter,
    handleSortChange,
    handlePageChange,
    handleLoadMore,
    clearFilters,
    removeFilter,
    buildPageUrl,
  }
}
