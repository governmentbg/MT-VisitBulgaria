import {useMemo} from 'react';
import {resolveMediaUrl} from '../../../services/api/transforms/payloadHelpers';
import {palette} from '../../../theme/palette';
import type {MapItem} from '../../../types/map';
import type {CityCluster} from '../../../hooks/useCityClusters';
import type {Location} from '../../../models/Location';

interface City {
  id?: string;
  name: string;
  coordinates?: Location;
  heroImageUrl?: string;
}

interface MapSearchResult {
  markers?: Array<{
    id: string | number;
    title: string;
    descriptionShort?: string;
    latitude: number;
    longitude: number;
    type: string;
    heroImageUrl?: string;
    cityName?: string;
  }>;
  cities?: Array<{name: string; count: number}>;
}

export function useMapDataTransforms(params: {
  mapData: MapSearchResult | undefined;
  cities: City[] | undefined;
}) {
  const {mapData, cities} = params;

  // Join Typesense city counts with city coordinates for country-level pins
  const cityClusters = useMemo<CityCluster[]>(() => {
    if (!cities || !mapData?.cities) return [];
    return mapData.cities
      .map((tc): CityCluster | null => {
        const city = cities.find(c => c.name === tc.name);
        if (!city?.coordinates) return null;
        return {
          cityId: city.id ?? tc.name,
          cityName: tc.name,
          count: tc.count,
          coordinates: city.coordinates,
          heroImageUrl: city.heroImageUrl,
        };
      })
      .filter((c): c is CityCluster => c !== null);
  }, [cities, mapData?.cities]);

  // Transform Typesense markers to MapItem format for map components
  const mapMarkers = useMemo<MapItem[]>(() => {
    if (!mapData?.markers) return [];
    return mapData.markers.map(m => ({
      id: String(m.id),
      name: m.title,
      description: m.descriptionShort ?? '',
      location: {latitude: m.latitude, longitude: m.longitude},
      category: {
        id: m.type,
        name: m.type,
        type: m.type,
        icon: 'map-marker',
        color: palette.green700,
      },
      images: m.heroImageUrl ? [resolveMediaUrl(m.heroImageUrl)] : [],
      cityId: m.cityName,
      __source: m.type,
    }));
  }, [mapData?.markers]);

  // Convert markers to GeoJSON features for the Clusterer component
  const markerFeatures = useMemo(() => {
    return mapMarkers.map(item => ({
      type: 'Feature' as const,
      properties: item,
      geometry: {
        type: 'Point' as const,
        coordinates: [item.location.longitude, item.location.latitude],
      },
    }));
  }, [mapMarkers]);

  return {cityClusters, mapMarkers, markerFeatures};
}
