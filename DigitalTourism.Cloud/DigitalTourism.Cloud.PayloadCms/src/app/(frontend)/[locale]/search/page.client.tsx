'use client'

import React from 'react'
import { Input, Spinner } from '@/components/ui'
import type { ExperienceSearchResponse } from '@/lib/search'
import type { NomenclatureDisplayData } from '@/lib/search'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { useTranslations } from 'next-intl'
import { useFavorites } from '@/components/favorites'
import { ResultGrid } from '@/plugins/experience-listing/components/ResultGrid'
import { BlockPagination } from '@/plugins/experience-listing/components/BlockPagination'
import { FilterPanel, FilterContent, AppliedFilterPills } from '@/components/filters'
import type { FacetConfigItem } from '@/utilities/getSettings'
import { useBlockSearch } from '@/plugins/experience-listing/hooks/useBlockSearch'

interface SearchPageClientProps {
  locale: string
  initialResults: ExperienceSearchResponse
  nomenclatureMap?: Record<string, NomenclatureDisplayData>
  facetConfig?: FacetConfigItem[]
}

const SearchPageClient: React.FC<SearchPageClientProps> = ({
  locale,
  initialResults,
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
    searchTimeMs: _searchTimeMs,
    isPending,
    searchQuery,
    setSearchQuery,
    activeFilterCount,
    hasActiveFilters,
    appliedFilters,
    handleMultiFilter,
    handleSingleFilter,
    handleSortChange: _handleSortChange,
    handlePageChange,
    clearFilters,
    removeFilter,
    buildPageUrl,
  } = useBlockSearch({
    locale,
    initialResults,
    defaults: { sort: 'relevance' },
    itemsPerPage: 12,
    paginationMode: 'pagination',
    blockId: 'search',
    nomenclatureMap,
    scrollToPageTop: true,
  })

  return (
    <div id="block-search" className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-card border-b py-3 sm:py-4">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              leftIcon={<SpriteIcon name="search" />}
              rightIcon={
                isPending ? (
                  <Spinner size="sm" className="text-primary" />
                ) : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-4 sm:py-6">
        {/* Results Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="mr-auto">
            {/* Applied Filter Pills */}
            {appliedFilters.length > 0 && (
              <div className="mb-3">
                <AppliedFilterPills
                  filters={appliedFilters}
                  onRemove={removeFilter}
                  onClearAll={clearFilters}
                />
              </div>
            )}
            <p className="text-lg sm:text-md font-bold">
              {t('resultsFound', { count: totalFound })}
            </p>
            
          </div>

          <div className="flex items-center gap-2">
            <FilterPanel activeFilterCount={activeFilterCount} onClearFilters={clearFilters}>
              <FilterContent
                filters={state.filters}
                facets={facets}
                onMultiFilter={handleMultiFilter}
                onSingleFilter={handleSingleFilter}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                activeFilterCount={activeFilterCount}
                nomenclatureMap={nomenclatureMap}
                facetConfig={facetConfig}
              />
            </FilterPanel>

            {/* TODO: re-enable once sort UX is improved */}
            {/* <SortDropdown value={state.sort} onChange={handleSortChange} /> */}
          </div>
        </div>

        {/* Results Grid */}
        <ResultGrid
          results={results}
          gridColumns={3}
          isLoading={isPending}
          itemsPerPage={12}
          compact
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <BlockPagination
            currentPage={state.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            buildPageUrl={buildPageUrl}
          />
        )}
      </div>
    </div>
  )
}

export default SearchPageClient
