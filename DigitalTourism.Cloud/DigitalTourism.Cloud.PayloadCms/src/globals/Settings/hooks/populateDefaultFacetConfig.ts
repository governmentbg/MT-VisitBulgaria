import type { GlobalBeforeChangeHook, GlobalBeforeReadHook } from 'payload'

const DEFAULT_FACET_CONFIG = [
  { id: 'facet-type', facetKey: 'type', enabled: true, defaultExpanded: true, maxVisible: null, sortOrder: 10, selectionMode: 'multi' },
  { id: 'facet-categories', facetKey: 'categories', enabled: true, defaultExpanded: true, maxVisible: 5, sortOrder: 20, selectionMode: 'multi' },
  { id: 'facet-tags', facetKey: 'tags', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 30, selectionMode: 'multi' },
  { id: 'facet-region', facetKey: 'region', enabled: false, defaultExpanded: true, maxVisible: 7, sortOrder: 40, selectionMode: 'multi' },
  { id: 'facet-municipality', facetKey: 'municipality', enabled: true, defaultExpanded: false, maxVisible: 7, sortOrder: 50, selectionMode: 'multi' },
  { id: 'facet-city', facetKey: 'city', enabled: true, defaultExpanded: true, maxVisible: 7, sortOrder: 60, selectionMode: 'multi' },
  { id: 'facet-starRating', facetKey: 'starRating', enabled: true, defaultExpanded: false, maxVisible: null, sortOrder: 70, selectionMode: 'multi' },
  { id: 'facet-amenities', facetKey: 'amenities', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 80, selectionMode: 'multi' },
  { id: 'facet-cuisineType', facetKey: 'cuisineType', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 90, selectionMode: 'multi' },
  { id: 'facet-dietaryOptions', facetKey: 'dietaryOptions', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 100, selectionMode: 'multi' },
  { id: 'facet-difficultyLevel', facetKey: 'difficultyLevel', enabled: true, defaultExpanded: false, maxVisible: null, sortOrder: 110, selectionMode: 'multi' },
  { id: 'facet-seasonality', facetKey: 'seasonality', enabled: true, defaultExpanded: false, maxVisible: null, sortOrder: 120, selectionMode: 'multi' },
  { id: 'facet-organizer', facetKey: 'organizer', enabled: true, defaultExpanded: false, maxVisible: 5, sortOrder: 130, selectionMode: 'multi' },
]

/**
 * Populates facetConfig with defaults on read when empty (so the frontend always has config).
 */
export const populateDefaultFacetConfig: GlobalBeforeReadHook = ({ doc }) => {
  if (!doc.facetConfig?.length) {
    doc.facetConfig = DEFAULT_FACET_CONFIG
  }
  return doc
}

/**
 * Persists default facetConfig into the database on first save if empty.
 * This ensures the rows are truly saved, so the admin UI respects initCollapsed.
 */
export const seedFacetConfigOnChange: GlobalBeforeChangeHook = ({ data }) => {
  if (!data.facetConfig?.length) {
    data.facetConfig = DEFAULT_FACET_CONFIG
  }
  return data
}
