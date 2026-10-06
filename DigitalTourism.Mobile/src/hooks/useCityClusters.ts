import {useMemo} from 'react';
import type {City} from '../models/City';
import type {Attraction} from '../models/Attraction';
import type {Event} from '../models/Event';
import type {Location} from '../models/Location';

const MAX_CITY_CLUSTERS = 50;

export interface CityCluster {
  cityId: string;
  cityName: string;
  count: number;
  coordinates: Location;
  heroImageUrl?: string;
}

type MapItem = Attraction | Event;

/**
 * Hook that produces city-level clusters for the map.
 *
 * Shows all cities that have coordinates (sorted by population, then count).
 * When attractions have cityId populated, the count reflects items per city.
 * Capped at MAX_CITY_CLUSTERS (50) to match web behavior.
 */
export function useCityClusters(
  cities: City[] | undefined,
  items: MapItem[],
  /** When true, only cities with matching items are shown (for search/filter) */
  isFiltered: boolean = false,
): CityCluster[] {
  return useMemo(() => {
    if (!cities || cities.length === 0) {
      return [];
    }

    // Count items per city (when cityId is available)
    const countMap = new Map<string, number>();
    for (const item of items) {
      const cityId = item.cityId;
      if (cityId) {
        countMap.set(cityId, (countMap.get(cityId) ?? 0) + 1);
      }
    }

    // When filtering/searching, only show cities that have matching items
    // When not filtering, show all cities (even those without cityId data yet)
    const sourceCities = isFiltered
      ? cities.filter(city => (countMap.get(city.id) ?? 0) > 0)
      : cities;

    const clusters: CityCluster[] = sourceCities.map(city => ({
      cityId: city.id,
      cityName: city.name,
      count: countMap.get(city.id) ?? 0,
      coordinates: city.coordinates,
      heroImageUrl: city.heroImageUrl,
    }));

    clusters.sort((a, b) => b.count - a.count);
    return clusters.slice(0, MAX_CITY_CLUSTERS);
  }, [cities, items, isFiltered]);
}
