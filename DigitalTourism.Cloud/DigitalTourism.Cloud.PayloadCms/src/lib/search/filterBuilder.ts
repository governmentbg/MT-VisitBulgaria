/**
 * Shared Typesense filter expression builder.
 *
 * Each facet field can be configured as 'or' (default) or 'and':
 *  - 'or':  type:=[hotel,restaurant]         → matches hotel OR restaurant
 *  - 'and': amenities:=pool && amenities:=spa → matches pool AND spa
 */

import type { ExperienceSearchFilters } from './types'
import type { FacetConfigItem } from '@/utilities/getSettings'

type FilterMode = 'or' | 'and'

export interface FacetFilterConfig {
  /** The key on ExperienceSearchFilters */
  filterKey: keyof ExperienceSearchFilters
  /** The Typesense field name */
  tsField: string
  /** 'or' = any match, 'and' = all must match. Default: 'or' */
  mode?: FilterMode
  /** If true, values are numeric and should not be backtick-quoted. */
  numeric?: boolean
}

/**
 * Maps facet keys to their Typesense field names and numeric flag.
 * Exported so `getFacetConfig()` can decorate each `FacetConfigItem`
 * with its Typesense field — the single source of truth for the
 * key-to-field mapping across web, API Service, and mobile clients.
 */
export const FACET_TS_FIELDS: Record<string, { tsField: string; numeric?: boolean }> = {
  type: { tsField: 'type' },
  categories: { tsField: 'categories.title' },
  tags: { tsField: 'tags.title' },
  region: { tsField: 'region.name' },
  municipality: { tsField: 'municipality.name' },
  city: { tsField: 'city.name' },
  starRating: { tsField: 'starRating', numeric: true },
  amenities: { tsField: 'amenities' },
  cuisineType: { tsField: 'cuisineType' },
  dietaryOptions: { tsField: 'dietaryOptions' },
  difficultyLevel: { tsField: 'difficultyLevel' },
  seasonality: { tsField: 'seasonality' },
  organizer: { tsField: 'organizer' },
}

/** Default facet filter configuration used when no admin config is available. */
export const FACET_FILTER_CONFIG: FacetFilterConfig[] = [
  { filterKey: 'type', tsField: 'type', mode: 'or' },
  { filterKey: 'categories', tsField: 'categories.title', mode: 'or' },
  { filterKey: 'tags', tsField: 'tags.title', mode: 'or' },
  { filterKey: 'region', tsField: 'region.name', mode: 'or' },
  { filterKey: 'municipality', tsField: 'municipality.name', mode: 'or' },
  { filterKey: 'city', tsField: 'city.name', mode: 'or' },
  { filterKey: 'starRating', tsField: 'starRating', mode: 'or', numeric: true },
  { filterKey: 'amenities', tsField: 'amenities', mode: 'and' },
  { filterKey: 'cuisineType', tsField: 'cuisineType', mode: 'or' },
  { filterKey: 'dietaryOptions', tsField: 'dietaryOptions', mode: 'and' },
  { filterKey: 'difficultyLevel', tsField: 'difficultyLevel', mode: 'or' },
  { filterKey: 'seasonality', tsField: 'seasonality', mode: 'or' },
  { filterKey: 'organizer', tsField: 'organizer', mode: 'or' },
]

/** Build FacetFilterConfig[] from admin-configured FacetConfigItem[], using admin filterMode. */
export function buildFacetFilterConfig(facetConfig: FacetConfigItem[]): FacetFilterConfig[] {
  const result: FacetFilterConfig[] = []
  for (const item of facetConfig) {
    if (!item.enabled) continue
    const mapping = FACET_TS_FIELDS[item.facetKey]
    if (!mapping) continue
    result.push({
      filterKey: item.facetKey as keyof ExperienceSearchFilters,
      tsField: mapping.tsField,
      mode: item.filterMode ?? 'or',
      numeric: mapping.numeric,
    })
  }
  return result
}

/**
 * Wrap a facet value in backticks so Typesense treats the whole thing as a
 * single literal (spaces, Cyrillic, commas are all OK inside the quotes).
 * Strip any embedded backticks first — they would terminate the quoted
 * literal and break the surrounding `filter_by` expression. This
 * centralizes sanitization that used to live on the mobile client
 * (`sanitizeFilterValue`) so both platforms get the same safety net.
 */
const quote = (v: string) => '`' + v.replace(/`/g, '') + '`'

/** Build a single Typesense filter expression for an array of values. */
function buildArrayFilter(field: string, values: string[], mode: FilterMode, numeric?: boolean): string {
  const wrap = numeric ? (v: string) => v : quote
  if (mode === 'and') {
    // Each value becomes its own `:=` filter, joined with &&
    return values.map((v) => `${field}:=${wrap(v)}`).join(' && ')
  }
  // OR: single expression with all values
  return `${field}:=[${values.map(wrap).join(',')}]`
}

/**
 * Build Typesense filter expressions from ExperienceSearchFilters.
 * Handles geo bounding box + all configured facet fields.
 */
export function buildFilterExpressions(
  filters: ExperienceSearchFilters,
  config: FacetFilterConfig[] = FACET_FILTER_CONFIG,
): string[] {
  const expressions: string[] = []

  // Geo bounding box — Typesense polygon (NW, NE, SE, SW)
  if (filters.geoBoundingBox) {
    const { topLeft, bottomRight } = filters.geoBoundingBox
    const hasArea =
      Math.abs(topLeft.lat - bottomRight.lat) > 0.001 &&
      Math.abs(topLeft.lng - bottomRight.lng) > 0.001
    if (hasArea) {
      expressions.push(
        `location:(${topLeft.lat}, ${topLeft.lng}, ${topLeft.lat}, ${bottomRight.lng}, ${bottomRight.lat}, ${bottomRight.lng}, ${bottomRight.lat}, ${topLeft.lng})`,
      )
    }
  }

  // Geo radius — Typesense circle filter
  if (filters.geoRadius) {
    const { lat, lng, radiusKm } = filters.geoRadius
    expressions.push(`location:(${lat}, ${lng}, ${radiusKm} km)`)
  }

  // Facet filters
  for (const { filterKey, tsField, mode, numeric } of config) {
    const values = filters[filterKey]
    if (Array.isArray(values) && values.length > 0) {
      expressions.push(buildArrayFilter(tsField, values as string[], mode ?? 'or', numeric))
    }
  }

  return expressions
}
