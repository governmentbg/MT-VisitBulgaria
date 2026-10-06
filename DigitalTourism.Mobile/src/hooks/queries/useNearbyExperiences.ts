import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {searchApi} from '../../services/api/searchApi';
import {resolveMediaUrl} from '../../services/api/transforms/payloadHelpers';
import {stripTypesenseId} from '../../utils/searchHitTransforms';
import {haversineDistanceMeters} from '../../utils/mapHelpers';
import {CACHE_TIMES} from '../../constants';
import type {BaseEntity} from '../../models/BaseEntity';

export interface NearbyExperience {
  id: string;
  name: string;
  type: string;
  images: string[];
  distanceMeters?: number;
}

/**
 * Fetch the top `limit` experiences within `radiusKm` of the given entity,
 * sorted ascending by distance. Spans all entity types (attraction, event,
 * hotel, restaurant, activity) via the Typesense experiences collection.
 *
 * The current entity itself is excluded from the result.
 */
export function useNearbyExperiences(
  entity: BaseEntity | undefined | null,
  limit: number = 5,
  radiusKm: number = 10,
) {
  const {i18n} = useTranslation();
  const locale = i18n.language;

  return useQuery<NearbyExperience[]>({
    queryKey: ['nearby-experiences', entity?.id, locale, radiusKm, limit],
    queryFn: async () => {
      if (!entity) return [];
      const {latitude, longitude} = entity.location;

      const response = await searchApi.search({
        query: '*',
        locale,
        perPage: limit + 1, // +1 in case the current entity is in the result and must be dropped
        geoSort: {lat: latitude, lng: longitude},
        filters: {
          geoRadius: {lat: latitude, lng: longitude, radiusKm},
        },
      });

      const currentId = String(entity.id);

      return (response.hits || [])
        .map(hit => {
          const heroUrl = hit.heroImage?.url;
          const coords = hit.location?.coordinates;
          // `geoSort` gives us sort order server-side, but the API Service
          // no longer exposes per-hit distance — compute locally.
          const distanceMeters = coords
            ? haversineDistanceMeters(latitude, longitude, coords.latitude, coords.longitude)
            : undefined;
          return {
            id: stripTypesenseId(hit.id),
            name: hit.title,
            type: hit.type,
            images: heroUrl ? [resolveMediaUrl(heroUrl)] : [],
            distanceMeters,
          };
        })
        .filter(item => item.id !== currentId)
        .slice(0, limit);
    },
    enabled: !!entity,
    staleTime: CACHE_TIMES.SHORT,
  });
}
