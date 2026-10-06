import type { SortOption as _SortOption } from '@/lib/search/types'

// ==================== Plugin Config ====================

export interface ExperienceListingPluginConfig {
  enabled?: boolean
}

// ==================== Block Data (matches Payload block fields) ====================

export type DisplayMode = 'grid' | 'carouselStandard' | 'carouselOverlay' | 'carouselHorizontal'

export type SectionVariant = 'dark' | 'darkAlt' | 'teal' | 'light'

export interface ViewAllLinkData {
  type?: 'custom' | 'reference' | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: { slug?: string; title?: string; breadcrumbs?: { url?: string }[] } | string | number
  } | null
  url?: string | null
  label?: string | null
}

export interface ExperienceListingBlockData {
  id?: string
  blockType: 'experienceListing'

  // Display mode
  displayMode?: DisplayMode

  // Section header
  heading?: string
  description?: string
  sectionLabel?: string
  headerAlignment?: 'left' | 'center' | 'right'
  viewAllLink?: ViewAllLinkData

  // Carousel settings
  sectionVariant?: SectionVariant
  showMonthFilter?: boolean
  isFocused?: boolean
  decorationImage?: 'none' | 'watermark' | 'horizontalWatermark'
  decorationAlignment?: 'left' | 'right'
  backgroundShape?: 'full' | 'cutLeft' | 'cutRight'

  // Overlay-specific settings
  overlayCardStyle?: 'overlay' | 'standard'
  overlayLayout?: 'sideBySide' | 'stacked'

  // Default filters (admin-configured)
  defaultType?: string[]
  defaultCategories?: (number | { id: number; title?: string })[]
  defaultTags?: (number | { id: number; title?: string })[]
  defaultRegion?: (number | { id: number; name?: string })[]
  defaultMunicipality?: (number | { id: number; name?: string })[]
  defaultCity?: (number | { id: number; name?: string })[]

  // Display settings
  itemsPerPage?: number
  defaultSort?: _SortOption

  // Feature toggles
  showAdvancedSearch?: boolean
  showSearchInput?: boolean
  showFilters?: boolean
}

// ==================== Search ====================
// Centralized search types — re-exported from lib/search for convenience

export type { ExperienceSearchFilters as BlockSearchFilters } from '@/lib/search/types'
export type {
  ExperienceSearchParams as BlockSearchParams,
  ExperienceSearchResult as BlockSearchResult,
  ExperienceSearchResponse as BlockSearchResponse,
  FacetValue,
} from '@/lib/search/types'

// ==================== Sort ====================
// Re-exported from centralized search types

export type { SortOption } from '@/lib/search/types'
export { SORT_TO_TYPESENSE } from '@/lib/search/types'

// ==================== URL Params ====================

export const BLOCK_PARAM_KEYS = [
  'type',
  'categories',
  'tags',
  'region',
  'municipality',
  'city',
  'starRating',
  'amenities',
  'cuisineType',
  'dietaryOptions',
  'difficultyLevel',
  'seasonality',
  'organizer',
  'sort',
  'page',
  'q',
] as const

export type BlockParamKey = (typeof BLOCK_PARAM_KEYS)[number]
