'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Spinner,
  Button,
} from '@/components/ui'
import { cn } from '@/components/ui/theme/cn'
import { FilterRegular, DismissRegular } from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { DestinationList } from '../DestinationList'
import { FilterContent } from '@/components/filters/FilterContent'
import { AppliedFilterPills, type AppliedFilter } from '@/components/filters/AppliedFilterPills'
import type { ExperienceSearchFilters, ExperienceSearchResponse, FacetValue } from '@/lib/search/types'
import type { DestinationItemData } from '../types'
import { useTranslations } from 'next-intl'

type AddDestinationTab = 'all' | 'favorites'

const TAB_VALUES: AddDestinationTab[] = ['all', 'favorites']

const FILTER_ARRAY_KEYS: (keyof ExperienceSearchFilters)[] = [
  'type', 'categories', 'tags', 'region', 'municipality', 'city',
  'starRating', 'amenities', 'cuisineType', 'dietaryOptions',
  'difficultyLevel', 'seasonality', 'organizer',
]

function buildAppliedFilters(filters: ExperienceSearchFilters): AppliedFilter[] {
  const pills: AppliedFilter[] = []
  for (const key of FILTER_ARRAY_KEYS) {
    const values = filters[key]
    if (Array.isArray(values)) {
      for (const value of values) {
        pills.push({ key, value, label: value })
      }
    }
  }
  return pills
}

function countActiveFilters(filters: ExperienceSearchFilters): number {
  let count = 0
  for (const key of FILTER_ARRAY_KEYS) {
    const values = filters[key]
    if (Array.isArray(values)) count += values.length
  }
  return count
}

function mapHitToDestination(hit: any): DestinationItemData {
  return {
    id: hit.id,
    title: hit.title || '',
    slug: hit.slug || '',
    address: hit.location?.city || '',
    category: hit.type || '',
    imageUrl: hit.heroImage?.sizes?.thumbnail?.url || hit.heroImage?.url || '',
    type: hit.type,
    coordinates: hit.location?.coordinates
      ? { lat: hit.location.coordinates.latitude, lng: hit.location.coordinates.longitude }
      : undefined,
  }
}

export interface AddDestinationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayNumber: number
  onAdd: (destination: DestinationItemData) => void
  locale: string
  /** Lazy loader for favorites — called on first switch to favorites tab */
  loadFavorites: () => Promise<DestinationItemData[]>
  searchAction: (params: {
    query: string
    locale: string
    perPage?: number
    filters?: Record<string, unknown>
  }) => Promise<ExperienceSearchResponse>
}

export const AddDestinationDialog: React.FC<AddDestinationDialogProps> = ({
  open,
  onOpenChange,
  dayNumber,
  onAdd,
  locale,
  loadFavorites,
  searchAction,
}) => {
  const t = useTranslations('tripPlanner')

  // Internal search/filter state
  const [activeTab, setActiveTab] = useState<AddDestinationTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DestinationItemData[]>([])
  const [searchFacets, setSearchFacets] = useState<Record<string, FacetValue[]>>({})
  const [searchTotalFound, setSearchTotalFound] = useState<number | undefined>(undefined)
  const [searchFilters, setSearchFilters] = useState<ExperienceSearchFilters>({})
  const [isSearching, setIsSearching] = useState(false)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  // Lazy-loaded favorites
  const [favoriteDestinations, setFavoriteDestinations] = useState<DestinationItemData[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const favoritesLoadedRef = useRef(false)

  // Track whether initial search has been done (persist across opens)
  const initialSearchDoneRef = useRef(false)

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchFiltersRef = useRef(searchFilters)
  searchFiltersRef.current = searchFilters

  const filterCount = useMemo(() => countActiveFilters(searchFilters), [searchFilters])
  const appliedFilters = useMemo(() => buildAppliedFilters(searchFilters), [searchFilters])

  // Search execution
  const loadSearchResults = useCallback(async (query = '', filters?: ExperienceSearchFilters) => {
    setIsSearching(true)
    try {
      const activeFilters = filters ?? searchFiltersRef.current
      const results = await searchAction({
        query,
        locale,
        perPage: 20,
        filters: activeFilters as Record<string, unknown>,
      })
      setSearchResults((results.hits || []).map(mapHitToDestination))
      setSearchFacets(results.facets || {})
      setSearchTotalFound(results.found)
    } catch {
      setSearchResults([])
      setSearchFacets({})
      setSearchTotalFound(undefined)
    } finally {
      setIsSearching(false)
    }
  }, [searchAction, locale])

  // Load initial results once, reset UI state on each open
  useEffect(() => {
    if (open) {
      setActiveTab('all')
      setSearchQuery('')
      setSearchFilters({})
      setFilterPanelOpen(false)
      if (!initialSearchDoneRef.current) {
        initialSearchDoneRef.current = true
        loadSearchResults('', {})
      }
    }
  }, [open, loadSearchResults])

  // Lazy-load favorites when tab switches to 'favorites'
  useEffect(() => {
    if (activeTab === 'favorites' && !favoritesLoadedRef.current) {
      favoritesLoadedRef.current = true
      setFavoritesLoading(true)
      loadFavorites()
        .then(setFavoriteDestinations)
        .catch(() => setFavoriteDestinations([]))
        .finally(() => setFavoritesLoading(false))
    }
  }, [activeTab, loadFavorites])

  // Filter handlers
  const handleMultiFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      setSearchFilters((prev) => {
        const current = (prev as any)[key] as string[] | undefined
        let next: string[]
        if (checked) {
          next = [...(current || []), value]
        } else {
          next = (current || []).filter((v: string) => v !== value)
        }
        const updated = { ...prev, [key]: next.length > 0 ? next : undefined }
        loadSearchResults(searchQuery, updated)
        return updated
      })
    },
    [searchQuery, loadSearchResults],
  )

  const handleSingleFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      setSearchFilters((prev) => {
        const updated = { ...prev, [key]: checked ? [value] : undefined }
        loadSearchResults(searchQuery, updated)
        return updated
      })
    },
    [searchQuery, loadSearchResults],
  )

  const handleClearFilters = useCallback(() => {
    setSearchFilters({})
    loadSearchResults(searchQuery, {})
  }, [searchQuery, loadSearchResults])

  const handleRemoveFilter = useCallback(
    (key: string, value: string) => handleMultiFilter(key, value, false),
    [handleMultiFilter],
  )

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (activeTab === 'all') {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
        searchTimerRef.current = setTimeout(() => loadSearchResults(query), 300)
      }
    },
    [activeTab, loadSearchResults],
  )

  // Compute visible destinations based on active tab
  const destinations = useMemo(() => {
    if (activeTab === 'favorites') {
      return favoriteDestinations.filter(
        (d) => !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    return searchResults
  }, [activeTab, searchResults, favoriteDestinations, searchQuery])

  const isLoading = activeTab === 'all' ? isSearching : favoritesLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[1237px] rounded-[12px] p-0 gap-0 overflow-hidden',
          'max-sm:max-w-full max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none',
          'sm:max-md:max-w-[900px]',
          'sm:h-[80vh] sm:max-h-[800px]',
        )}
      >
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
          {/* Filter backdrop */}
          {filterPanelOpen && activeTab === 'all' && (
            <div
              className="absolute inset-0 z-20 bg-black/30 transition-opacity"
              onClick={() => setFilterPanelOpen(false)}
            />
          )}

          {/* Filter overlay */}
          <div
            className={cn(
              'absolute inset-0 z-30 flex flex-col bg-white shadow-[-4px_0_16px_rgba(0,0,0,0.08)] transition-transform duration-300',
              'max-sm:w-full sm:left-auto sm:w-[400px]',
              filterPanelOpen && activeTab === 'all'
                ? 'translate-x-0'
                : 'translate-x-full',
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-grey-100 px-6 py-4">
              <h3 className="font-heading text-lg font-semibold text-grey-900">{t('filters')}</h3>
              <button
                onClick={() => setFilterPanelOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-grey-500 transition-colors hover:bg-grey-100 hover:text-grey-700"
                aria-label={t('closeFilters')}
              >
                <DismissRegular className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <FilterContent
                filters={searchFilters}
                facets={searchFacets}
                onMultiFilter={handleMultiFilter}
                onSingleFilter={handleSingleFilter}
                onClearFilters={handleClearFilters}
                hasActiveFilters={filterCount > 0}
                activeFilterCount={filterCount}
              />
              {filterCount > 0 && (
                <div className="mt-4 flex justify-center">
                  <Button variant="tertiary" size="sm" icon={null} onClick={handleClearFilters}>
                    {t('clearFilters')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="shrink-0 border-b border-grey-100 px-8 pt-8 pb-6 max-sm:px-4 max-sm:pt-6">
            <DialogHeader className="text-left">
              <DialogTitle className="font-heading text-xl font-bold text-grey-900">
                {t('addDestinationToDay', { day: dayNumber })}
              </DialogTitle>
              <DialogDescription className="text-sm text-grey-500">
                {t('selectDestinations')}
              </DialogDescription>
            </DialogHeader>

            {/* Search input */}
            <div className="mt-5">
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                leftIcon={<SpriteIcon name="search" />}
                className="h-11 rounded-xl"
              />
            </div>

            {/* Tab bar + filter */}
            <div className="mt-5 flex items-center gap-6">
              {TAB_VALUES.map((tabValue) => (
                <button
                  key={tabValue}
                  onClick={() => setActiveTab(tabValue)}
                  className={cn(
                    'relative pb-3 text-sm font-medium transition-colors',
                    activeTab === tabValue
                      ? 'text-primary-700'
                      : 'text-grey-500 hover:text-grey-700',
                  )}
                >
                  {tabValue === 'all' ? t('allTab') : t('favoritesTab')}
                  {activeTab === tabValue && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary-500" />
                  )}
                </button>
              ))}

              {/* Filter toggle (only for 'all' tab) */}
              {activeTab === 'all' && (
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                      filterPanelOpen || filterCount > 0
                        ? 'bg-grey-100 text-grey-900'
                        : 'text-grey-500 hover:bg-grey-50 hover:text-grey-700',
                    )}
                    aria-label={t('filters')}
                  >
                    {filterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[11px] font-bold text-white">
                        {filterCount}
                      </span>
                    )}
                    <FilterRegular className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Applied filter pills */}
            {activeTab === 'all' && appliedFilters.length > 0 && (
              <div className="mt-4">
                <AppliedFilterPills
                  filters={appliedFilters}
                  onRemove={handleRemoveFilter}
                  onClearAll={handleClearFilters}
                />
              </div>
            )}
          </div>

          {/* Body — results */}
          <div className="relative min-h-0 flex-1 overflow-y-auto pl-4 py-4">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                <Spinner size="lg" />
              </div>
            )}
            {searchTotalFound != null && activeTab === 'all' && !isSearching && (
              <p className="mb-3 px-4 text-xs font-medium text-grey-400">
                {t('resultsFound', { count: searchTotalFound })}
              </p>
            )}
            <DestinationList
              destinations={destinations}
              variant="add"
              onAdd={onAdd}
              emptyMessage={t('noResultsFound')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
