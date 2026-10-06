import { Region } from '../models/Location';
import type { BaseEntity } from '../models/BaseEntity';

/**
 * Map zoom levels matching the web's two-layer system.
 * - 'country': zoomed out, shows city cluster pins
 * - 'city': zoomed in, shows individual attraction/event markers
 */
export type ZoomLevel = 'country' | 'city';

/**
 * Haversine distance between two coordinates in kilometers.
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Haversine distance in meters (convenience wrapper). */
export function haversineDistanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  return haversineDistance(lat1, lng1, lat2, lng2) * 1000;
}

/**
 * Tile zoom threshold that switches between country and city layers.
 * Matches the web MapExplorer's DEFAULT_ZOOM_THRESHOLD.
 */
export const ZOOM_THRESHOLD = 10;

/**
 * Calculate zoom level from tile zoom (from useThrottledRegion)
 */
export function calculateZoomLevel(tileZoom: number): ZoomLevel {
  return tileZoom < ZOOM_THRESHOLD ? 'country' : 'city';
}

/** Geo bounding box type used for Typesense geo filters */
export interface GeoBbox {
  topLeft: { lat: number; lng: number };
  bottomRight: { lat: number; lng: number };
}

/**
 * Convert a map Region to a Typesense geo bounding box.
 * Adds buffer percentage to prefetch markers outside visible area.
 */
export function regionToGeoBbox(
  region: Region,
  bufferPercent: number = 0.15,
): GeoBbox {
  const latBuffer = region.latitudeDelta * bufferPercent;
  const lngBuffer = region.longitudeDelta * bufferPercent;
  return {
    topLeft: {
      lat: region.latitude + region.latitudeDelta / 2 + latBuffer,
      lng: region.longitude - region.longitudeDelta / 2 - lngBuffer,
    },
    bottomRight: {
      lat: region.latitude - region.latitudeDelta / 2 - latBuffer,
      lng: region.longitude + region.longitudeDelta / 2 + lngBuffer,
    },
  };
}

/**
 * Check whether coordinates fall within Bulgaria's geographic bounds.
 */
export function isInBulgaria(lat: number, lng: number): boolean {
  return lat >= 41.2 && lat <= 44.2 && lng >= 22.4 && lng <= 28.6;
}

/**
 * Format distance in meters to human-readable string.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Compute "Similar" items for the detail screen: top `limit` entities of the same
 * type as the current entity, sorted by distance.
 *
 * Entity type is the de-facto category for now (real CMS categories aren't populated
 * yet). The caller passes in a same-type list via `useAllEntities`, so this helper just
 * excludes the current entity, attaches distance, sorts, and slices.
 *
 * Nearby (cross-type, radius-based) is NOT computed here — it comes from Typesense via
 * `useNearbyExperiences`, because it requires querying across all entity collections.
 */
export function computeSimilarItems<T extends BaseEntity>(
  entity: T,
  all: T[],
  limit: number = 5,
): (T & {distanceMeters: number})[] {
  const {latitude, longitude} = entity.location;
  return all
    .filter(a => a.id !== entity.id)
    .map(a => ({
      ...a,
      distanceMeters:
        haversineDistance(latitude, longitude, a.location.latitude, a.location.longitude) * 1000,
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
}