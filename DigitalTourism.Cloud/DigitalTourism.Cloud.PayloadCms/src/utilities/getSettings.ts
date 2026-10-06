import type { Setting } from '@/payload-types'
import type { PayloadLocale } from '@/i18n/localization'

import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getCachedGlobal } from './getGlobals'

/**
 * Returns the cached global settings object
 */
const getSettings = async (): Promise<Setting> => {
  const settings = await getCachedGlobal('settings', 0)()
  return settings
}

/**
 * Returns the home page ID from global settings, or null if not configured
 */
export const getHomePageId = cache(async (): Promise<number | null> => {
  const settings = await getSettings()
  const homePage = settings.homePage
  if (typeof homePage === 'number') return homePage
  if (typeof homePage === 'object' && homePage !== null) return homePage.id
  return null
})

export type SiteIdentity = {
  siteName: string
  siteTagline: string
  defaultMetaDescription: string
}

export const getSiteIdentity = cache(
  async (locale: PayloadLocale): Promise<SiteIdentity> => {
    const settings = (await getCachedGlobal('settings', 0, locale)()) as Setting
    return {
      siteName: settings.siteName || 'Visit Bulgaria',
      siteTagline: settings.siteTagline || '',
      defaultMetaDescription: settings.defaultMetaDescription || '',
    }
  },
)

export type MapSettings = {
  maxCityMarkers: number
  maxExperienceMarkers: number
  zoomThreshold: number
}

const DEFAULT_MAP_SETTINGS: MapSettings = {
  maxCityMarkers: 50,
  maxExperienceMarkers: 200,
  zoomThreshold: 12,
}

/**
 * Returns map-specific settings with aggressive caching.
 * These values rarely change so we cache with a very long revalidation window.
 */
export const getMapSettings = cache(async (): Promise<MapSettings> => {
  const settings = await getSettings()
  return {
    maxCityMarkers: settings.mapMaxCityMarkers ?? DEFAULT_MAP_SETTINGS.maxCityMarkers,
    maxExperienceMarkers: settings.mapMaxExperienceMarkers ?? DEFAULT_MAP_SETTINGS.maxExperienceMarkers,
    zoomThreshold: settings.mapZoomThreshold ?? DEFAULT_MAP_SETTINGS.zoomThreshold,
  }
})

export type FacetConfigItem = {
  facetKey: string
  /**
   * Typesense field name this facet maps to (e.g. `city` → `city.name`).
   * Derived from the facet-key-to-field mapping in
   * `lib/search/filterBuilder.ts#FACET_TS_FIELDS`; exposed here so
   * non-web clients (mobile filter UI) can read facet counts under the
   * correct Typesense field without duplicating the map.
   */
  tsField: string
  enabled: boolean
  defaultExpanded: boolean
  maxVisible?: number | null
  sortOrder: number
  selectionMode: 'multi' | 'single'
  /** How multiple selected values combine: 'or' = any match, 'and' = all must match */
  filterMode: 'or' | 'and'
}

/**
 * Maps an admin `facetKey` to the Typesense field name the server returns
 * counts under. Imported from `filterBuilder.ts` as the single source of
 * truth, so adding a new facet only requires updating one map.
 */
import { FACET_TS_FIELDS } from '@/lib/search/filterBuilder'

/** Default facet configuration used when no settings are saved */
const DEFAULT_FACET_CONFIG_RAW: Omit<FacetConfigItem, 'tsField'>[] = [
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

/** Attach the Typesense field to a raw facet config entry; drops entries without a mapping. */
function withTsField(item: Omit<FacetConfigItem, 'tsField'>): FacetConfigItem | null {
  const mapping = FACET_TS_FIELDS[item.facetKey]
  if (!mapping) return null
  return { ...item, tsField: mapping.tsField }
}

const DEFAULT_FACET_CONFIG: FacetConfigItem[] = DEFAULT_FACET_CONFIG_RAW
  .map(withTsField)
  .filter((item): item is FacetConfigItem => item !== null)

/**
 * Returns facet filter configuration from global settings.
 * Sorted by sortOrder, with defaults applied for any missing fields.
 * Aggressively cached across requests via unstable_cache, invalidated by global_settings tag.
 */
export const getFacetConfig = cache(
  () => unstable_cache(
    async (): Promise<FacetConfigItem[]> => {
      const settings = (await getCachedGlobal('settings', 0)()) as Setting
      const raw = settings.facetConfig
      if (!raw?.length) return DEFAULT_FACET_CONFIG

      return raw
        .map((item) =>
          withTsField({
            facetKey: item.facetKey,
            enabled: item.enabled ?? true,
            defaultExpanded: item.defaultExpanded ?? false,
            maxVisible: item.maxVisible ?? undefined,
            sortOrder: item.sortOrder ?? 10,
            selectionMode: item.selectionMode ?? 'multi',
            filterMode: item.filterMode ?? 'or',
          }),
        )
        .filter((item): item is FacetConfigItem => item !== null)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    },
    ['facet-config'],
    { tags: ['global_settings'] },
  )(),
)

export default getSettings
