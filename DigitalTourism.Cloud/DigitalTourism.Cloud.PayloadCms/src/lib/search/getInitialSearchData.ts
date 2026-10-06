'use server'

import { searchExperiences } from './searchExperiences'
import { getNomenclatureDisplayMap } from './nomenclature'
import { getFacetConfig } from '@/utilities/getSettings'
import type { ExperienceSearchFilters, ExperienceSearchResponse } from './types'
import type { NomenclatureDisplayData } from './nomenclature'
import type { FacetConfigItem } from '@/utilities/getSettings'

export interface InitialSearchDataOptions {
  locale: string
  filters?: ExperienceSearchFilters
  query?: string
  page?: number
  perPage?: number
  sortBy?: string
}

export interface InitialSearchData {
  initialResults: ExperienceSearchResponse
  nomenclatureMap: Record<string, NomenclatureDisplayData>
  facetConfig: FacetConfigItem[]
}

/**
 * Fetches initial search results, nomenclature display data, and facet config in parallel.
 * Used by archive pages, CMS blocks, and the search page.
 */
export async function getInitialSearchData({
  locale,
  filters,
  query = '*',
  page = 1,
  perPage = 12,
  sortBy,
}: InitialSearchDataOptions): Promise<InitialSearchData> {
  const [initialResults, nomenclatureMap, facetConfig] = await Promise.all([
    searchExperiences({ query, locale, page, perPage, filters, sortBy }),
    getNomenclatureDisplayMap(locale),
    getFacetConfig(),
  ])

  return { initialResults, nomenclatureMap, facetConfig }
}
