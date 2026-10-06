'use client'

import React, { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { cn } from '@/components/ui'
import { FacetFilter } from './FilterComponents'
import type { FacetValue, NomenclatureDisplayData } from './FilterComponents'
import { FilterSection } from './FilterComponents'
import type { ExperienceSearchFilters } from '@/lib/search/types'
import type { FacetConfigItem } from '@/utilities/getSettings'

// ==================== Star Rating Filter ====================

const StarRatingFilter: React.FC<{
  title: string
  facets: FacetValue[]
  selectedValues?: string[]
  onSelect: (value: string, checked: boolean) => void
  defaultExpanded?: boolean
}> = ({ title, facets, selectedValues = [], onSelect, defaultExpanded = false }) => {
  // Hide if no facets, or all counts are 0 and nothing is selected
  const hasAnyCount = facets?.some((f) => f.count > 0)
  if (!facets || facets.length === 0 || (!hasAnyCount && selectedValues.length === 0)) return null

  return (
    <FilterSection title={title} defaultExpanded={defaultExpanded}>
      {facets.map((facet) => {
        const rating = parseInt(facet.value, 10)
        return (
          <div key={facet.value} className="flex items-center justify-between py-1">
            <label
              htmlFor={`star-${facet.value}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id={`star-${facet.value}`}
                type="checkbox"
                checked={selectedValues.includes(facet.value)}
                onChange={(e) => onSelect(facet.value, e.target.checked)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-sm border',
                  selectedValues.includes(facet.value)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input',
                )}
              >
                {selectedValues.includes(facet.value) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SpriteIcon
                    name="star-filled"
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < rating ? 'text-warning-100' : 'text-grey-100',
                    )}
                  />
                ))}
              </span>
            </label>
            <span className="text-sm text-muted-foreground">{facet.count}</span>
          </div>
        )
      })}
    </FilterSection>
  )
}

// ==================== Helpers ====================

const hasValues = (arr?: string[]) => arr != null && arr.length > 0

/** Maps facet keys to the Typesense facet field names */
const FACET_FIELD_MAP: Record<string, string> = {
  type: 'type',
  categories: 'categories.title',
  tags: 'tags.title',
  region: 'region.name',
  municipality: 'municipality.name',
  city: 'city.name',
  starRating: 'starRating',
  amenities: 'amenities',
  cuisineType: 'cuisineType',
  dietaryOptions: 'dietaryOptions',
  difficultyLevel: 'difficultyLevel',
  seasonality: 'seasonality',
  organizer: 'organizer',
}

/** Maps facet keys to their translation keys for titles */
const FACET_TITLE_KEY: Record<string, string> = {
  type: 'experienceType',
  categories: 'categories',
  tags: 'tags',
  region: 'region',
  municipality: 'municipality',
  city: 'city',
  starRating: 'starRating',
  amenities: 'amenities',
  cuisineType: 'cuisine',
  dietaryOptions: 'dietaryOptions',
  difficultyLevel: 'difficulty',
  seasonality: 'bestSeason',
  organizer: 'organizer',
}

/** Facets that use nomenclature map for labels/icons */
const NOMENCLATURE_FACETS = new Set([
  'amenities', 'cuisineType', 'dietaryOptions', 'difficultyLevel', 'seasonality',
])

// ==================== FilterContent ====================

export interface FilterContentProps {
  filters: ExperienceSearchFilters
  facets?: Record<string, FacetValue[]>
  onMultiFilter: (key: string, value: string, checked: boolean) => void
  /** Handler for single-select facets (replaces value instead of accumulating) */
  onSingleFilter: (key: string, value: string, checked: boolean) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
  /** Filter keys that are admin-configured defaults - hidden from the drawer */
  hiddenFilters?: Set<keyof ExperienceSearchFilters>
  /** Nomenclature display map for localized labels and icons */
  nomenclatureMap?: Record<string, NomenclatureDisplayData>
  /** Facet configuration from global settings (order, visibility, maxVisible, etc.) */
  facetConfig?: Omit<FacetConfigItem, 'tsField'>[]
}

/** Hardcoded default config used when no settings are provided */
const DEFAULT_FACET_CONFIG: Omit<FacetConfigItem, 'tsField'>[] = [
  { facetKey: 'type', enabled: true, defaultExpanded: true, sortOrder: 10, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'categories', enabled: true, defaultExpanded: true, maxVisible: 5, sortOrder: 20, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'tags', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 30, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'region', enabled: false, defaultExpanded: true, maxVisible: 7, sortOrder: 40, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'municipality', enabled: true, defaultExpanded: false, maxVisible: 7, sortOrder: 50, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'city', enabled: true, defaultExpanded: true, maxVisible: 7, sortOrder: 60, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'starRating', enabled: true, defaultExpanded: false, sortOrder: 70, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'amenities', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 80, selectionMode: 'multi', filterMode: 'and' },
  { facetKey: 'cuisineType', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 90, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'dietaryOptions', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 100, selectionMode: 'multi', filterMode: 'and' },
  { facetKey: 'difficultyLevel', enabled: true, defaultExpanded: false, sortOrder: 110, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'seasonality', enabled: true, defaultExpanded: false, sortOrder: 120, selectionMode: 'multi', filterMode: 'or' },
  { facetKey: 'organizer', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 130, selectionMode: 'multi', filterMode: 'or' },
]

export const FilterContent: React.FC<FilterContentProps> = ({
  filters,
  facets,
  onMultiFilter,
  onSingleFilter,
  onClearFilters: _onClearFilters,
  hasActiveFilters: _hasActiveFilters,
  hiddenFilters,
  nomenclatureMap = {},
  facetConfig,
}) => {
  const t = useTranslations('experienceListing')
  const hidden = hiddenFilters ?? new Set()
  const config = facetConfig ?? DEFAULT_FACET_CONFIG

  const typeLabels: Record<string, string> = {
    hotel: t('typeHotel'),
    restaurant: t('typeRestaurant'),
    activity: t('typeActivity'),
    attraction: t('typeAttraction'),
    event: t('typeEvent'),
  }

  // Build a set of single-select facet keys for routing to the correct handler
  const singleSelectKeys = new Set(
    config.filter((c) => c.selectionMode === 'single').map((c) => c.facetKey),
  )

  /** Routes to onSingleFilter or onMultiFilter based on facet config */
  const handleSelect = useCallback(
    (facetKey: string, value: string, checked: boolean) => {
      if (singleSelectKeys.has(facetKey)) {
        onSingleFilter(facetKey, value, checked)
      } else {
        onMultiFilter(facetKey, value, checked)
      }
    },
    [onMultiFilter, onSingleFilter, singleSelectKeys],
  )

  return (
    <>
      {config.map((item) => {
        const { facetKey, enabled, defaultExpanded, maxVisible, selectionMode } = item

        // Skip disabled facets and facets hidden by block-level defaults
        if (!enabled || hidden.has(facetKey as keyof ExperienceSearchFilters)) return null

        const facetField = FACET_FIELD_MAP[facetKey]
        const titleKey = FACET_TITLE_KEY[facetKey]
        if (!facetField || !titleKey) return null

        const facetValues = facets?.[facetField] || []
        const filterValues = filters[facetKey as keyof ExperienceSearchFilters] as string[] | undefined
        const isExpanded = defaultExpanded || hasValues(filterValues)
        const isMultiSelect = selectionMode !== 'single'
        const useNomenclature = NOMENCLATURE_FACETS.has(facetKey)

        // Star rating uses a special component
        if (facetKey === 'starRating') {
          return (
            <StarRatingFilter
              key={facetKey}
              title={t(titleKey)}
              facets={facetValues}
              selectedValues={filterValues}
              onSelect={(value, checked) => handleSelect(facetKey, value, checked)}
              defaultExpanded={isExpanded}
            />
          )
        }

        return (
          <FacetFilter
            key={facetKey}
            title={t(titleKey)}
            facets={facetValues}
            labels={facetKey === 'type' ? typeLabels : undefined}
            selectedValues={isMultiSelect ? filterValues : undefined}
            selectedValue={!isMultiSelect ? filterValues?.[0] : undefined}
            isMultiSelect={isMultiSelect}
            onSelect={(value, checked) => handleSelect(facetKey, value, checked)}
            defaultExpanded={isExpanded}
            maxVisible={maxVisible ?? undefined}
            nomenclatureMap={useNomenclature ? nomenclatureMap : undefined}
          />
        )
      })}
    </>
  )
}
