import { useMemo, useEffect } from 'react';
import { SpatialIndex, createBoundsFromRegion } from '../utils/spatialIndex';
import type { Region } from 'react-native-maps';
import type { Supercluster } from 'react-native-clusterer';

export interface MapDataItem {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface UseSpatiallyIndexedMapDataParams<T extends MapDataItem> {
  data: T[];
  region: Region | null;
  minZoom?: number;
  maxZoom?: number;
  /**
   * Strict mode for viewport queries (default: false for maximum performance)
   * - false: Returns all items from tiles (~10-20% extra, possible duplicates, 30-50% faster)
   * - true: Exact bounds checking and deduplication (slower, uses more memory)
   */
  strict?: boolean;
}

interface UseSpatiallyIndexedMapDataResult<T extends MapDataItem> {
  visibleFeatures: Supercluster.PointFeature<T>[];
  totalItems: number;
  stats: {
    totalPoints: number;
    totalTiles: number;
    zoomRange: [number, number];
    avgPointsPerTile: number;
  } | null;
}

/**
 * High-performance hook for spatially indexing map data.
 *
 * This hook:
 * - Converts data to Supercluster.PointFeature format ONCE
 * - Builds a spatial index in O(n) when data changes
 * - Returns only features visible in the current viewport in O(1) time
 * - Eliminates redundant array transformations on every render
 *
 * Performance characteristics:
 * - Initial build: O(n) where n is total points (one time per data change)
 * - Viewport query: O(1) - returns only visible features
 * - No mapping overhead on viewport changes
 * - Memory: O(n * z) where z is zoom levels (constant factor)
 *
 * @example
 * const { visibleFeatures, totalItems } = useSpatiallyIndexedMapData({
 *   data: [...attractions, ...events],
 *   region: currentRegion,
 * });
 * // visibleFeatures are ready to use with Clusterer, no transformation needed!
 */
export function useSpatiallyIndexedMapData<T extends MapDataItem>({
  data,
  region,
  minZoom = 5,  // City level
  maxZoom = 18, // Street level
  strict = false, // Default to fast path for maximum performance
}: UseSpatiallyIndexedMapDataParams<T>): UseSpatiallyIndexedMapDataResult<T> {
  // Recreate the spatial index when zoom range changes
  const index = useMemo(
    () =>
      new SpatialIndex<Supercluster.PointFeature<T>>(
        (feature) => ({
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        }),
        minZoom,
        maxZoom,
      ),
    [minZoom, maxZoom],
  );

  // Build the spatial index when data or index changes (O(n) operation)
  useEffect(() => {
    // Convert to Supercluster.PointFeature format ONCE
    const features: Supercluster.PointFeature<T>[] = data.map(item => ({
      type: 'Feature' as const,
      properties: item,
      geometry: {
        type: 'Point' as const,
        coordinates: [item.location.longitude, item.location.latitude],
      },
    }));

    index.build(features);
  }, [data, index]);

  // Query visible features based on viewport (O(1) operation)
  const visibleFeatures = useMemo(() => {
    if (!region) {
      // No region yet, return all features
      return index.getAllPoints();
    }

    const bounds = createBoundsFromRegion(region);
    return index.queryViewport(bounds, region.latitudeDelta, strict);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- data reference changes trigger spatial index rebuild; region/strict control viewport query
  }, [region, data, strict, index]);

  // Get index statistics (re-compute when data length changes)
  const dataLength = data.length;
  const stats = useMemo(() => {
    return index.getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dataLength triggers re-computation after rebuild
  }, [dataLength, index]);

  return {
    visibleFeatures,
    totalItems: data.length,
    stats,
  };
}
