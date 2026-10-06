import {resolveMediaUrl} from './payloadHelpers';
import type {ExperienceSearchResult} from '../types/searchTypes';
import {palette} from '../../../theme/palette';
import {stripTypesenseId} from '../../../utils/searchHitTransforms';
import type {MapItem} from '../../../types/map';

export interface MapMarker extends MapItem {
  type: string;
}

/**
 * Transform a structured search hit (from the API Service's
 * `/v1/search/*` endpoints) into a MapMarker compatible with the
 * existing map components.
 */
export function hitToMapMarker(hit: ExperienceSearchResult): MapMarker {
  const coords = hit.location?.coordinates;
  return {
    id: stripTypesenseId(hit.id),
    name: hit.title,
    type: hit.type,
    location: {
      latitude: coords?.latitude ?? 0,
      longitude: coords?.longitude ?? 0,
    },
    category: {
      id: hit.type,
      name: hit.categories?.[0] || hit.type,
      type: hit.type,
      icon: 'map-marker',
      color: palette.green700,
    },
    images: hit.heroImage?.url ? [resolveMediaUrl(hit.heroImage.url)] : [],
    description: hit.description || '',
    __source: hit.type,
  };
}

/**
 * Transform an array of hits to MapMarker array.
 */
export function hitsToMapMarkers(hits: ExperienceSearchResult[]): MapMarker[] {
  return hits.map(hitToMapMarker);
}
