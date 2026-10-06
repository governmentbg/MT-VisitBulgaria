'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Checkbox } from '@/components/ui'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { NomenclatureIcon } from '@/components/NomenclatureIcon'
import { useTranslations } from 'next-intl'

// ==================== Types ====================

export interface FacetValue {
  value: string
  count: number
}

export interface NomenclatureDisplayData {
  icon?: string
  label: string
}

// ==================== Filter Section ====================

export interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-bold text-sm">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  )
}

// ==================== Filter Checkbox ====================

export interface FilterCheckboxProps {
  id: string
  label: string
  count?: number
  checked: boolean
  onChange: (checked: boolean) => void
  iconName?: string | null
  /** Render as a radio-style control (for single-select facets) */
  isRadio?: boolean
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  id,
  label,
  count,
  checked,
  onChange,
  iconName,
  isRadio,
}) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2">
      {isRadio ? (
        <button
          type="button"
          role="radio"
          id={id}
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`h-4 w-4 shrink-0 rounded-full border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            checked ? 'border-primary bg-primary' : 'border-primary'
          } flex items-center justify-center`}
        >
          {checked && <span className="block h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
        </button>
      ) : (
        <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      )}
      {iconName && <NomenclatureIcon iconName={iconName} size={14} />}
      <label htmlFor={id} className="text-sm cursor-pointer">
        {label}
      </label>
    </div>
    {count !== undefined && <span className="text-sm text-muted-foreground">{count}</span>}
  </div>
)

// ==================== Facet Filter ====================

export interface FacetFilterProps {
  title: string
  facets: FacetValue[]
  labels?: Record<string, string>
  selectedValue?: string
  selectedValues?: string[]
  isMultiSelect?: boolean
  onSelect: (value: string, checked: boolean) => void
  defaultExpanded?: boolean
  nomenclatureMap?: Record<string, NomenclatureDisplayData>
  /** Max facet values to show before "Show more" toggle. Undefined = show all. */
  maxVisible?: number
}

export const FacetFilter: React.FC<FacetFilterProps> = ({
  title,
  facets,
  labels = {},
  selectedValue,
  selectedValues = [],
  isMultiSelect = false,
  onSelect,
  defaultExpanded = true,
  nomenclatureMap = {},
  maxVisible,
}) => {
  const t = useTranslations('experienceListing')
  const [isShowingAll, setIsShowingAll] = useState(false)

  // For single-select facets, cache all seen values so users can always switch.
  // When filtering narrows results, previously seen options stay visible (with count 0).
  const seenValuesRef = useRef<Map<string, FacetValue>>(new Map())

  const mergedFacets = useMemo(() => {
    if (!facets) return facets
    if (isMultiSelect) return facets

    // Update cache with current facet values
    const currentMap = new Map(facets.map((f) => [f.value, f]))
    for (const f of facets) {
      seenValuesRef.current.set(f.value, f)
    }
    // Merge: use current counts where available, 0 for cached-only values
    const merged: FacetValue[] = []
    for (const [value, cached] of seenValuesRef.current) {
      merged.push(currentMap.get(value) ?? { value, count: 0 })
    }
    return merged
  }, [facets, isMultiSelect])

  // Sort facets: selected items first (so they're never hidden by truncation), then by count descending
  const sortedFacets = useMemo(() => {
    if (!mergedFacets) return mergedFacets
    const vals = isMultiSelect ? selectedValues : selectedValue ? [selectedValue] : []
    const byCount = (a: FacetValue, b: FacetValue) => b.count - a.count
    if (maxVisible) {
      const selected = mergedFacets.filter((f) => vals.includes(f.value)).sort(byCount)
      const unselected = mergedFacets.filter((f) => !vals.includes(f.value)).sort(byCount)
      return [...selected, ...unselected]
    }
    return [...mergedFacets].sort(byCount)
  }, [mergedFacets, selectedValues, selectedValue, isMultiSelect, maxVisible])

  // Hide facet entirely if all options have 0 count and nothing is selected
  const hasAnyCount = mergedFacets?.some((f) => f.count > 0) ?? false
  const hasSelection = isMultiSelect ? selectedValues.length > 0 : !!selectedValue
  if (!mergedFacets || mergedFacets.length === 0 || (!hasAnyCount && !hasSelection)) return null

  const shouldTruncate = maxVisible != null && sortedFacets.length > maxVisible
  const visibleFacets = shouldTruncate && !isShowingAll
    ? sortedFacets.slice(0, maxVisible)
    : sortedFacets
  const hiddenCount = shouldTruncate ? sortedFacets.length - maxVisible : 0

  return (
    <FilterSection title={title} defaultExpanded={defaultExpanded}>
      {visibleFacets.map((facet) => {
        const isChecked = isMultiSelect
          ? selectedValues.includes(facet.value)
          : selectedValue === facet.value

        return (
          <FilterCheckbox
            key={facet.value}
            id={`${title}-${facet.value}`}
            label={labels[facet.value] || nomenclatureMap[facet.value]?.label || facet.value}
            count={facet.count}
            checked={isChecked}
            onChange={(checked) => onSelect(facet.value, checked)}
            iconName={nomenclatureMap[facet.value]?.icon}
            isRadio={!isMultiSelect}
          />
        )
      })}
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setIsShowingAll(!isShowingAll)}
          className="mt-2 text-sm text-primary hover:underline cursor-pointer"
        >
          {isShowingAll ? t('showLess') : t('showMore', { count: hiddenCount })}
        </button>
      )}
    </FilterSection>
  )
}
