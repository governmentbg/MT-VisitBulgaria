'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useField, useLocale } from '@payloadcms/ui'
import type { FieldBase } from 'payload'
import './ExperienceListingPreview.scss'

interface PreviewHit {
  id: string
  title: string
  slug: string
  type: string
  city?: string
  heroImage?: { url?: string; alt?: string }
}

interface PreviewResponse {
  hits: PreviewHit[]
  found: number
  totalPages: number
}

interface ExperienceListingPreviewProps {
  path: string
  field: FieldBase
}

const baseClass = 'experience-listing-preview'

const typeLabels: Record<string, string> = {
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  activity: 'Activity',
  attraction: 'Attraction',
  event: 'Event',
}

const ExperienceListingPreview: React.FC<ExperienceListingPreviewProps> = ({ path }) => {
  const locale = useLocale()

  // Compute parent path (remove the ui field name to get block root path)
  const pathParts = path.split('.')
  pathParts.pop()
  const parentPath = pathParts.join('.')
  const fieldPath = (name: string) => (parentPath ? `${parentPath}.${name}` : name)

  // Read sibling field values
  const { value: defaultType } = useField<string[]>({ path: fieldPath('defaultType') })
  const { value: defaultCategories } = useField<(number | { id: number })[]>({
    path: fieldPath('defaultCategories'),
  })
  const { value: defaultTags } = useField<(number | { id: number })[]>({
    path: fieldPath('defaultTags'),
  })
  const { value: defaultRegion } = useField<(number | { id: number })[]>({
    path: fieldPath('defaultRegion'),
  })
  const { value: defaultMunicipality } = useField<(number | { id: number })[]>({
    path: fieldPath('defaultMunicipality'),
  })
  const { value: defaultCity } = useField<(number | { id: number })[]>({
    path: fieldPath('defaultCity'),
  })
  const { value: gridColumns } = useField<string>({ path: fieldPath('gridColumns') })
  const { value: itemsPerPage } = useField<number>({ path: fieldPath('itemsPerPage') })

  const [results, setResults] = useState<PreviewHit[]>([])
  const [_found, setFound] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const extractIds = (items: (number | { id: number })[] | undefined): string[] => {
    if (!items?.length) return []
    return items
      .map((item) => (typeof item === 'number' ? String(item) : String(item?.id)))
      .filter(Boolean)
  }

  const buildParams = useCallback(() => {
    const params = new URLSearchParams()
    const localeCode = typeof locale === 'object' ? locale.code : locale
    params.set('locale', localeCode || 'en')
    params.set('page', '1')
    params.set('perPage', String(itemsPerPage || 8))

    if (defaultType?.length) {
      params.set('type', defaultType.join(','))
    }
    if (defaultCategories?.length) {
      const ids = extractIds(defaultCategories)
      if (ids.length) params.set('categories', ids.join(','))
    }
    if (defaultTags?.length) {
      const ids = extractIds(defaultTags)
      if (ids.length) params.set('tags', ids.join(','))
    }
    if (defaultRegion?.length) {
      const ids = extractIds(defaultRegion)
      if (ids.length) params.set('region', ids.join(','))
    }
    if (defaultMunicipality?.length) {
      const ids = extractIds(defaultMunicipality)
      if (ids.length) params.set('municipality', ids.join(','))
    }
    if (defaultCity?.length) {
      const ids = extractIds(defaultCity)
      if (ids.length) params.set('city', ids.join(','))
    }

    return params.toString()
  }, [
    defaultType,
    defaultCategories,
    defaultTags,
    defaultRegion,
    defaultMunicipality,
    defaultCity,
    locale,
    itemsPerPage,
  ])

  const fetchPreview = useCallback(async () => {
    setIsLoading(true)
    try {
      const queryString = buildParams()
      const response = await fetch(`/api/experience-listing-preview?${queryString}`)
      if (response.ok) {
        const data: PreviewResponse = await response.json()
        setResults(data.hits)
        setFound(data.found)
      }
    } catch {
      // Silently fail in admin preview
    } finally {
      setIsLoading(false)
    }
  }, [buildParams])

  // Debounced fetch when field values change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchPreview()
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fetchPreview])

  const cols = Number(gridColumns) || 4

  return (
    <div className={baseClass}>
      {/* Preview grid */}
      <div
        className={`${baseClass}__grid${isLoading ? ` ${baseClass}__grid--loading` : ''}`}
        style={{ '--preview-cols': cols } as React.CSSProperties}
      >
        {/* Skeleton loading cards */}
        {isLoading &&
          results.length === 0 &&
          Array.from({ length: cols * 2 }).map((_, i) => (
            <div key={i} className={`${baseClass}__card`}>
              <div className={`${baseClass}__card-thumbnail`} />
              <div className={`${baseClass}__card-info`}>
                <div
                  className={`${baseClass}__skeleton-bar ${baseClass}__skeleton-bar--type`}
                />
                <div
                  className={`${baseClass}__skeleton-bar ${baseClass}__skeleton-bar--title`}
                />
                <div
                  className={`${baseClass}__skeleton-bar ${baseClass}__skeleton-bar--city`}
                />
              </div>
            </div>
          ))}

        {/* Result cards */}
        {results.map((hit) => (
          <div key={hit.id} className={`${baseClass}__card`}>
            <div className={`${baseClass}__card-thumbnail`}>
              {hit.heroImage?.url ? (
                <img
                  src={hit.heroImage.url}
                  alt={hit.heroImage.alt || hit.title}
                  className={`${baseClass}__card-image`}
                />
              ) : (
                <div className={`${baseClass}__card-placeholder`}>&#x1f4cd;</div>
              )}
            </div>
            <div className={`${baseClass}__card-info`}>
              <div className={`${baseClass}__card-type`}>
                {typeLabels[hit.type] || hit.type}
              </div>
              <div className={`${baseClass}__card-title`}>{hit.title}</div>
              {hit.city && (
                <div className={`${baseClass}__card-city`}>&#x1f4cd; {hit.city}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {results.length === 0 && !isLoading && (
        <div className={`${baseClass}__empty`}>
          <p>No matching experiences found with current filters.</p>
        </div>
      )}
    </div>
  )
}

export default ExperienceListingPreview
