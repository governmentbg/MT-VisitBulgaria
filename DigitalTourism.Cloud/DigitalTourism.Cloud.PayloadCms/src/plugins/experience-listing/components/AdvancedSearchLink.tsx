'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import type { BlockSearchFilters, SortOption } from '../types'

interface AdvancedSearchLinkProps {
  filters: BlockSearchFilters
  sort: SortOption
  query: string
}

export const AdvancedSearchLink: React.FC<AdvancedSearchLinkProps> = ({ filters, query }) => {
  const t = useTranslations('experienceListing')

  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (filters.type?.length) params.set('type', filters.type.join(','))
  if (filters.region?.length) params.set('region', filters.region.join(','))
  if (filters.municipality?.length) params.set('municipality', filters.municipality.join(','))
  if (filters.city?.length) params.set('city', filters.city.join(','))
  if (filters.categories?.length) params.set('categories', filters.categories.join(','))
  if (filters.tags?.length) params.set('tags', filters.tags.join(','))

  const queryString = params.toString()
  const href = `/search${queryString ? `?${queryString}` : ''}`

  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm text-primary hover:text-primary/80 hover:underline font-medium"
    >
      {t('advancedSearch')}
      <span className="ml-1">&rarr;</span>
    </Link>
  )
}
