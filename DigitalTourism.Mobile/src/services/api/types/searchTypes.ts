/**
 * Search types for the mobile app.
 *
 * These mirror the normalized response shapes returned by the API Service
 * (`/v1/search/experiences`, `/v1/search/map`, `/v1/settings/facet-config`),
 * which in turn delegate to Payload CMS custom endpoints that reuse the
 * exact same `searchExperiences()` / `searchMapExperiences()` logic the
 * web frontend runs. No Typesense raw shapes are exposed to the client —
 * all per-facet AND/OR filtering and admin facet config is handled
 * server-side.
 */

export type FacetValue = {
  value: string;
  count: number;
};

export interface ExperienceLocation {
  city?: string;
  municipality?: string;
  region?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ExperienceHeroImage {
  url?: string;
  alt?: string;
}

export interface ExperienceSearchResult {
  id: string;
  title: string;
  slug: string;
  type: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  location?: ExperienceLocation;
  heroImage?: ExperienceHeroImage;
  starRating?: number;
  amenities?: string[];
  cuisineType?: string;
  dietaryOptions?: string[];
  difficultyLevel?: string;
  seasonality?: string[];
  minimumAge?: number;
  equipmentProvided?: boolean;
  organizer?: string;
  /** ISO timestamp for period.startDate (events only) */
  date?: string;
  /** ISO timestamp for period.endDate (events only) */
  endDate?: string;
}

export interface ExperienceSearchResponse {
  hits: ExperienceSearchResult[];
  found: number;
  page: number;
  totalPages: number;
  searchTimeMs: number;
  facets?: Record<string, FacetValue[]>;
}

export interface CityGroup {
  city: string;
  count: number;
  location: { lat: number; lng: number };
  previewImageUrl?: string;
}

export interface MapSearchResponse {
  hits: ExperienceSearchResult[];
  cityGroups?: CityGroup[];
  found: number;
  facets?: Record<string, FacetValue[]>;
}

/**
 * Filter shape sent to the server. 1:1 with Payload's
 * `ExperienceSearchFilters` — per-facet AND/OR mode is decided server-side
 * from the admin `facetConfig`, so the client only expresses "user picked
 * these values" and never builds Typesense expressions.
 */
export interface SearchFilters {
  type?: string[];
  categories?: string[];
  tags?: string[];
  region?: string[];
  municipality?: string[];
  city?: string[];
  starRating?: number[];
  amenities?: string[];
  cuisineType?: string[];
  dietaryOptions?: string[];
  difficultyLevel?: string[];
  seasonality?: string[];
  organizer?: string[];

  minimumAge?: number;
  equipmentProvided?: boolean;

  /** Unix ms — period.startDate >= */
  dateFrom?: number;
  /** Unix ms — period.startDate <= */
  dateTo?: number;
  /** Unix ms — period.endDate >= (exclude past events) */
  dateEndAfter?: number;

  /** Find results within a rectangle (typically derived from map viewport) */
  geoBoundingBox?: {
    topLeft: { lat: number; lng: number };
    bottomRight: { lat: number; lng: number };
  };
  /** Find results within radiusKm of a point */
  geoRadius?: { lat: number; lng: number; radiusKm: number };
}

export interface SearchParams {
  query?: string;
  locale?: string;
  page?: number;
  perPage?: number;
  filters?: SearchFilters;
  sortBy?: string;
  /** Sort by distance from this point (nearest first); overrides sortBy */
  geoSort?: { lat: number; lng: number };
}

export interface MapSearchRequestParams {
  query?: string;
  locale?: string;
  filters?: SearchFilters;
  groupByCity?: boolean;
}

/**
 * Admin-configured facet definition (mirrors Payload's `FacetConfigItem`).
 * Drives the mobile filter UI — ordering, enabled state, default expanded,
 * max visible options, single/multi selection.
 *
 * `tsField` is the Typesense field name the server returns counts under
 * (e.g. `city` → `city.name`). Populated server-side so mobile doesn't
 * duplicate the facet-key-to-field mapping.
 */
export interface FacetConfigItem {
  facetKey: string;
  tsField: string;
  enabled: boolean;
  defaultExpanded: boolean;
  /**
   * Max options shown before a "Show more" toggle appears. `null` (the
   * wire default for "unlimited") and `undefined` both mean "no truncation"
   * — check with `typeof maxVisible === 'number'` before comparing.
   */
  maxVisible?: number | null;
  sortOrder: number;
  selectionMode: 'multi' | 'single';
  filterMode: 'or' | 'and';
}
