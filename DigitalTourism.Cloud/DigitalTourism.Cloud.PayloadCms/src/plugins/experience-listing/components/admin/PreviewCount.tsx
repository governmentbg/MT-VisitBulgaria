'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useField, useLocale } from '@payloadcms/ui'
import type { FieldBase } from 'payload'

interface PreviewCountProps {
  path: string
  field: FieldBase
}

const extractIds = (items: (number | { id: number })[] | undefined): string[] => {
  if (!items?.length) return []
  return items
    .map((item) => (typeof item === 'number' ? String(item) : String(item?.id)))
    .filter(Boolean)
}

const PreviewCount: React.FC<PreviewCountProps> = ({ path }) => {
  const locale = useLocale()

  const pathParts = path.split('.')
  pathParts.pop()
  const parentPath = pathParts.join('.')
  const fp = (name: string) => (parentPath ? `${parentPath}.${name}` : name)

  const { value: defaultType } = useField<string[]>({ path: fp('defaultType') })
  const { value: defaultCategories } = useField<(number | { id: number })[]>({ path: fp('defaultCategories') })
  const { value: defaultTags } = useField<(number | { id: number })[]>({ path: fp('defaultTags') })
  const { value: defaultRegion } = useField<(number | { id: number })[]>({ path: fp('defaultRegion') })
  const { value: defaultMunicipality } = useField<(number | { id: number })[]>({ path: fp('defaultMunicipality') })
  const { value: defaultCity } = useField<(number | { id: number })[]>({ path: fp('defaultCity') })
  const { value: itemsPerPage } = useField<number>({ path: fp('itemsPerPage') })

  const [found, setFound] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buildParams = useCallback(() => {
    const params = new URLSearchParams()
    const localeCode = typeof locale === 'object' ? locale.code : locale
    params.set('locale', localeCode || 'en')
    params.set('page', '1')
    params.set('perPage', String(itemsPerPage || 12))

    if (defaultType?.length) params.set('type', defaultType.join(','))
    const catIds = extractIds(defaultCategories)
    if (catIds.length) params.set('categories', catIds.join(','))
    const tagIds = extractIds(defaultTags)
    if (tagIds.length) params.set('tags', tagIds.join(','))
    const regIds = extractIds(defaultRegion)
    if (regIds.length) params.set('region', regIds.join(','))
    const munIds = extractIds(defaultMunicipality)
    if (munIds.length) params.set('municipality', munIds.join(','))
    const cityIds = extractIds(defaultCity)
    if (cityIds.length) params.set('city', cityIds.join(','))

    return params.toString()
  }, [defaultType, defaultCategories, defaultTags, defaultRegion, defaultMunicipality, defaultCity, locale, itemsPerPage])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/experience-listing-preview?${buildParams()}`)
        if (response.ok) {
          const data = await response.json()
          setFound(data.found ?? 0)
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false)
      }
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [buildParams])

  return (
    <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: '#888' }}>
      {isLoading ? 'Loading...' : `${found} results match current filters`}
    </p>
  )
}

export default PreviewCount
