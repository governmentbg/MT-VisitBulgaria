'use client'

import React, { useCallback, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { Input } from '@/components/ui'
import { MonthFilterTabs, type MonthFilterValue } from '@/components/MonthFilterTabs'
import type { ExperienceSearchResponse, SortOption } from '@/lib/search'
import { searchExperiences } from '@/lib/search/searchExperiences'
import { BlockPagination } from '../../components/BlockPagination'
import { ResultGrid } from '../../components/ResultGrid'
import { AdvancedSearchLink } from '../../components/AdvancedSearchLink'
import { CarouselStandard } from '../../components/CarouselStandard'
import { CarouselOverlay } from '../../components/CarouselOverlay'
import { CarouselHorizontal } from '../../components/CarouselHorizontal'
import { CarouselSection } from '../../components/CarouselSection'
import { FilterPanel, AppliedFilterPills, FilterContent } from '@/components/filters'
import type { NomenclatureDisplayData } from '@/components/filters'
import type { FacetConfigItem } from '@/utilities/getSettings'
import { useFavorites } from '@/components/favorites'
import { useBlockSearch } from '../../hooks/useBlockSearch'
import { useDeferredLoading } from '../../hooks/useDeferredLoading'
import type { DisplayMode, SectionVariant, ViewAllLinkData } from '../../types'

export interface ExperienceListingClientProps {
  blockId: string
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
  gridColumns: 2 | 3 | 4
  paginationMode: 'pagination' | 'loadMore'
  showAdvancedSearch: boolean
  showSearchInput: boolean
  showFilters?: boolean
  displayMode?: DisplayMode
  heading?: string
  description?: string
  sectionLabel?: string
  headerAlignment?: 'left' | 'center' | 'right'
  viewAllLink?: ViewAllLinkData
  sectionVariant?: SectionVariant
  showMonthFilter?: boolean
  decorationImage?: 'none' | 'watermark' | 'horizontalWatermark'
  decorationAlignment?: 'left' | 'right'
  backgroundShape?: 'full' | 'cutLeft' | 'cutRight'
  isFocused?: boolean
  overlayCardStyle?: 'overlay' | 'standard'
  overlayLayout?: 'sideBySide' | 'stacked'
  nomenclatureMap?: Record<string, NomenclatureDisplayData>
  facetConfig?: FacetConfigItem[]
}

export const ExperienceListingClient: React.FC<ExperienceListingClientProps> = ({
  blockId,
  locale,
  initialResults,
  defaults,
  itemsPerPage,
  gridColumns,
  paginationMode,
  showAdvancedSearch,
  showSearchInput,
  showFilters = true,
  displayMode = 'grid',
  heading,
  description,
  sectionLabel,
  headerAlignment,
  viewAllLink,
  sectionVariant,
  showMonthFilter,
  isFocused,
  decorationImage,
  decorationAlignment,
  backgroundShape,
  overlayCardStyle,
  overlayLayout,
  nomenclatureMap,
  facetConfig,
}) => {
  if (displayMode === 'carouselStandard' || displayMode === 'carouselOverlay' || displayMode === 'carouselHorizontal') {
    return (
      <CarouselMode
        blockId={blockId}
        locale={locale}
        initialResults={initialResults}
        displayMode={displayMode}
        heading={heading}
        description={description}
        sectionLabel={sectionLabel}
        headerAlignment={headerAlignment}
        viewAllLink={viewAllLink}
        sectionVariant={sectionVariant}
        showMonthFilter={showMonthFilter}
        isFocused={isFocused}
        decorationImage={decorationImage}
        decorationAlignment={decorationAlignment}
        backgroundShape={backgroundShape}
        overlayCardStyle={overlayCardStyle}
        overlayLayout={overlayLayout}
      />
    )
  }

  // Grid mode — full interactive search/filter/pagination
  return (
    <GridMode
      blockId={blockId}
      locale={locale}
      initialResults={initialResults}
      defaults={defaults}
      itemsPerPage={itemsPerPage}
      gridColumns={gridColumns}
      paginationMode={paginationMode}
      showAdvancedSearch={showAdvancedSearch}
      showSearchInput={showSearchInput}
      showFilters={showFilters}
      nomenclatureMap={nomenclatureMap}
      facetConfig={facetConfig}
    />
  )
}

// ─── Carousel Mode ───
// Manages month filter state and wraps any carousel in CarouselSection

function getMonthFilters(offset: 0 | 1): { dateEndAfter: number; dateFrom: number; dateTo: number } {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59)
  return {
    dateEndAfter: now.getTime(),
    dateFrom: monthStart.getTime(),
    dateTo: monthEnd.getTime(),
  }
}

const CarouselMode: React.FC<{
  blockId: string
  locale: string
  initialResults: ExperienceSearchResponse
  displayMode: 'carouselStandard' | 'carouselOverlay' | 'carouselHorizontal'
  heading?: string
  description?: string
  sectionLabel?: string
  headerAlignment?: 'left' | 'center' | 'right'
  viewAllLink?: ViewAllLinkData
  sectionVariant?: SectionVariant
  showMonthFilter?: boolean
  isFocused?: boolean
  decorationImage?: 'none' | 'watermark' | 'horizontalWatermark'
  decorationAlignment?: 'left' | 'right'
  backgroundShape?: 'full' | 'cutLeft' | 'cutRight'
  overlayCardStyle?: 'overlay' | 'standard'
  overlayLayout?: 'sideBySide' | 'stacked'
}> = ({
  blockId,
  locale,
  initialResults,
  displayMode,
  heading,
  description,
  sectionLabel,
  headerAlignment,
  viewAllLink,
  sectionVariant = 'light',
  showMonthFilter = false,
  isFocused = false,
  decorationImage = 'none',
  decorationAlignment,
  backgroundShape,
  overlayCardStyle,
  overlayLayout,
}) => {
  const t = useTranslations('experienceListing')
  const [monthFilter, setMonthFilter] = useState<MonthFilterValue>('thisMonth')
  const [results, setResults] = useState(initialResults)
  const [isPending, startTransition] = useTransition()
  const showLoading = useDeferredLoading(isPending)

  const handleMonthChange = useCallback(
    (value: MonthFilterValue) => {
      setMonthFilter(value)
      const offset = value === 'nextMonth' ? 1 : 0
      const filters = getMonthFilters(offset)

      startTransition(async () => {
        const newResults = await searchExperiences({
          query: '*',
          locale,
          page: 1,
          perPage: 24,
          filters: {
            type: ['event'],
            ...filters,
          },
          sortBy: 'period.startDate:asc',
        })
        setResults(newResults)
      })
    },
    [locale],
  )

  const monthFilterSlot = showMonthFilter ? (
    <MonthFilterTabs
      value={monthFilter}
      onChange={handleMonthChange}
      labels={{ thisMonth: t('thisMonth'), nextMonth: t('nextMonth') }}
      variant={sectionVariant === 'dark' || sectionVariant === 'darkAlt' ? 'dark' : 'light'}
    />
  ) : null

  const resolvedViewAllLink = viewAllLink ? {
    ...viewAllLink,
    label: viewAllLink.label || t('viewAll'),
  } : undefined

  const items = results.hits

  const carouselProps = {
    id: blockId,
    items,
    heading,
    description,
    sectionLabel,
    headerAlignment,
    viewAllLink: resolvedViewAllLink,
    sectionVariant,
    monthFilterSlot,
    isFocused,
  }

  return (
    <CarouselSection
      displayMode={displayMode}
      sectionVariant={sectionVariant}
      decorationImage={decorationImage}
      decorationAlignment={decorationAlignment}
      backgroundShape={backgroundShape}
      isLoading={showLoading}
    >
      {displayMode === 'carouselStandard' && <CarouselStandard {...carouselProps} />}
      {displayMode === 'carouselOverlay' && <CarouselOverlay {...carouselProps} overlayCardStyle={overlayCardStyle} overlayLayout={overlayLayout} />}
      {displayMode === 'carouselHorizontal' && <CarouselHorizontal {...carouselProps} />}
    </CarouselSection>
  )
}

// ─── Grid Mode ───
// Extracted to its own component so hooks aren't conditionally called

const GridMode: React.FC<{
  blockId: string
  locale: string
  initialResults: ExperienceSearchResponse
  defaults: ExperienceListingClientProps['defaults']
  itemsPerPage: number
  gridColumns: 2 | 3 | 4
  paginationMode: 'pagination' | 'loadMore'
  showAdvancedSearch: boolean
  showSearchInput: boolean
  showFilters: boolean
  nomenclatureMap?: Record<string, NomenclatureDisplayData>
  facetConfig?: FacetConfigItem[]
}> = ({
  blockId,
  locale,
  initialResults,
  defaults,
  itemsPerPage,
  gridColumns,
  paginationMode,
  showAdvancedSearch,
  showSearchInput,
  showFilters,
  nomenclatureMap,
  facetConfig,
}) => {
  const t = useTranslations('experienceListing')
  const { toggleFavorite, isFavorite } = useFavorites()

  const {
    state,
    results,
    totalFound,
    totalPages,
    facets,
    isPending,
    searchQuery,
    setSearchQuery,
    activeFilterCount,
    hasActiveFilters,
    appliedFilters,
    hiddenFilters,
    handleMultiFilter,
    handleSingleFilter,
    handleSortChange: _handleSortChange,
    handlePageChange,
    handleLoadMore,
    clearFilters,
    removeFilter,
    buildPageUrl,
  } = useBlockSearch({
    locale,
    initialResults,
    defaults,
    itemsPerPage,
    paginationMode,
    blockId,
    nomenclatureMap,
    scrollToPageTop: true,
  })
  const showLoading = useDeferredLoading(isPending)

  return (
    <div className="container">
      {/* Applied Filter Pills */}
      {showFilters && appliedFilters.length > 0 && (
        <div className="mb-3">
          <AppliedFilterPills
            filters={appliedFilters}
            onRemove={removeFilter}
            onClearAll={clearFilters}
          />
        </div>
      )}

      {/* Header: search + filter + sort */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-3 mr-auto">
          {showSearchInput && (
            <div className="w-64">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                leftIcon={<SpriteIcon name="search" />}
                className="text-sm"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {t('resultsFound', { count: totalFound })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showFilters && (
            <FilterPanel activeFilterCount={activeFilterCount} onClearFilters={clearFilters}>
              <FilterContent
                filters={state.filters}
                facets={facets}
                onMultiFilter={handleMultiFilter}
                onSingleFilter={handleSingleFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                hiddenFilters={hiddenFilters}
                nomenclatureMap={nomenclatureMap}
                facetConfig={facetConfig}
              />
            </FilterPanel>
          )}
          {/* TODO: re-enable once sort UX is improved */}
          {/* <SortDropdown value={state.sort} onChange={handleSortChange} /> */}
        </div>
      </div>

      {/* Results Grid */}
      <ResultGrid
        results={results}
        gridColumns={gridColumns}
        isLoading={showLoading}
        itemsPerPage={itemsPerPage}
        compact
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      {/* Pagination / Load More */}
      {paginationMode === 'pagination' ? (
        <BlockPagination
          currentPage={state.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          buildPageUrl={buildPageUrl}
        />
      ) : (
        state.page < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? t('loading') : t('loadMore')}
            </button>
          </div>
        )
      )}

      {/* Advanced Search Link */}
      {showAdvancedSearch && (
        <div className="mt-6 text-center">
          <AdvancedSearchLink
            filters={state.filters}
            sort={state.sort}
            query={state.query}
          />
        </div>
      )}
    </div>
  )
}
