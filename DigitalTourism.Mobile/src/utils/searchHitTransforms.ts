import {resolveMediaUrl} from '../services/api/transforms/payloadHelpers';
import type {ExperienceSearchResult} from '../services/api/types/searchTypes';
import {palette} from '../theme/palette';
import type {MapItem} from '../types/map';

/**
 * Transforms between normalized `ExperienceSearchResult` (returned by
 * the API Service's `/v1/search/*` endpoints) and the mobile-side UI
 * shapes (`MapItem`, `SearchSuggestionItem`). The client no longer
 * sees any raw Typesense shapes — filter building and response
 * normalization both happen server-side.
 */

/**
 * Strip the collection-prefix from a Typesense document ID
 * (e.g. `restaurants_137` → `137`). The server preserves the prefixed
 * form as `ExperienceSearchResult.id` since it's what Typesense indexes
 * natively; clients strip it when they need the bare entity ID.
 */
export function stripTypesenseId(id: string): string {
  return id.includes('_') ? id.split('_').pop()! : id;
}

/**
 * Transform a search hit to a map-compatible item.
 */
export function hitToMapItem(hit: ExperienceSearchResult): MapItem {
  const coords = hit.location?.coordinates;
  return {
    id: String(hit.id),
    name: hit.title,
    description: hit.description || '',
    location: {
      latitude: coords?.latitude ?? 0,
      longitude: coords?.longitude ?? 0,
    },
    category: {
      id: hit.type,
      name: hit.type,
      type: hit.type,
      icon: 'map-marker',
      color: palette.green700,
    },
    images: hit.heroImage?.url ? [resolveMediaUrl(hit.heroImage.url)] : [],
    __source: hit.type,
    cityName: hit.location?.city,
  };
}

/**
 * Search suggestion shape.
 */
export interface SearchSuggestionItem {
  id: string;
  title: string;
  type: string;
  /** Tuple [latitude, longitude] for backwards compatibility with map callers */
  location?: [number, number];
}

/**
 * Transform a search hit to an autocomplete suggestion.
 */
export function hitToSearchSuggestion(hit: ExperienceSearchResult): SearchSuggestionItem {
  const coords = hit.location?.coordinates;
  return {
    id: stripTypesenseId(String(hit.id)),
    title: hit.title,
    type: hit.type,
    location: coords ? [coords.latitude, coords.longitude] : undefined,
  };
}
