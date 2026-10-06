/**
 * Unified search types for all experience listing contexts:
 * - Search page
 * - Experience Listing block
 * - Archive pages
 */

export interface ExperienceSearchResult {
  id: string
  title: string
  slug: string
  type: string
  description?: string
  categories?: string[]
  tags?: string[]
  location?: {
    city?: string
    municipality?: string
    region?: string
    coordinates?: { latitude: number; longitude: number }
  }
  heroImage?: {
    url?: string
    alt?: string
  }
  starRating?: number
  amenities?: string[]
  cuisineType?: string
  dietaryOptions?: string[]
  difficultyLevel?: string
  seasonality?: string[]
  minimumAge?: number
  equipmentProvided?: boolean
  organizer?: string
  rating?: number
  priceLevel?: string
  date?: string
  endDate?: string
}

export type FacetValue = { value: string; count: number }

/**
 * Unified search filters — all faceted values use string[] for consistent
 * multi-select handling. The search function converts to Typesense types.
 */
export interface ExperienceSearchFilters {
  type?: string[]
  categories?: string[]
  tags?: string[]
  region?: string[]
  municipality?: string[]
  city?: string[]
  starRating?: string[]
  amenities?: string[]
  cuisineType?: string[]
  dietaryOptions?: string[]
  difficultyLevel?: string[]
  seasonality?: string[]
  organizer?: string[]
  // Geo bounding box filter
  geoBoundingBox?: {
    topLeft: { lat: number; lng: number }
    bottomRight: { lat: number; lng: number }
  }
  // Geo radius filter: results within radiusKm of a point
  geoRadius?: {
    lat: number
    lng: number
    radiusKm: number
  }
  // Non-faceted filters (single value)
  minimumAge?: number
  equipmentProvided?: boolean
  // Date range filters (Unix timestamps in milliseconds)
  dateFrom?: number
  dateTo?: number
  /** Filter events whose endDate is >= this value (i.e. not yet ended) */
  dateEndAfter?: number
}

export interface ExperienceSearchParams {
  query: string
  locale: string
  page?: number
  perPage?: number
  filters?: ExperienceSearchFilters
  sortBy?: string
  /** Sort results by distance from this point (nearest first). Overrides sortBy. */
  geoSort?: { lat: number; lng: number }
}

export interface ExperienceSearchResponse {
  hits: ExperienceSearchResult[]
  found: number
  page: number
  totalPages: number
  searchTimeMs: number
  facets?: Record<string, FacetValue[]>
}

export type SortOption = 'relevance' | 'title_asc' | 'title_desc' | 'newest'

export const SORT_TO_TYPESENSE: Record<SortOption, string> = {
  relevance: '_text_match:desc',
  title_asc: 'title:asc',
  title_desc: 'title:desc',
  newest: 'publishedAt:desc',
}
