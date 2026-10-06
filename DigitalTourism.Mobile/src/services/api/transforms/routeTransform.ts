/**
 * Route (Trip) Transformation Layer
 *
 * Converts Payload CMS Trip responses to app Route model format.
 * Handles polymorphic experience references and server-side visited state.
 *
 * @module api/transforms/routeTransform
 */

import type {
  Route,
  RouteDay,
  RouteStop,
  RouteExperienceType,
} from '../../../models/Route';
import {resolveMediaUrl} from './payloadHelpers';

// --- Payload CMS response shapes ---

interface PayloadExperienceRef {
  relationTo: string;
  value:
    | number
    | {
        id: number;
        title?: string;
        name?: string;
        slug?: string;
        heroImage?: {
          url?: string;
          alt?: string;
          sizes?: {
            medium?: {url?: string};
            thumbnail?: {url?: string};
          };
        };
        city?: {name?: string} | number;
        location?: Record<string, unknown>; // Payload may return different shapes depending on collection/depth
        categories?: Array<{title?: string} | number>;
      };
}

interface PayloadTripStop {
  experience?: PayloadExperienceRef;
  note?: string;
  visited?: boolean;
  id?: string;
}

interface PayloadTripDay {
  dayNumber?: number;
  stops?: PayloadTripStop[];
  id?: string;
}

export interface PayloadTripResponse {
  id: number;
  name: string;
  startDate: string;
  duration: number;
  days?: PayloadTripDay[];
  pool?: PayloadTripStop[];
  visitor?: number | {id: number};
  createdAt: string;
  updatedAt: string;
}

export interface PayloadPaginatedTrips {
  docs: PayloadTripResponse[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// --- Transform functions ---

/**
 * Extract lat/lng from Payload location field.
 * Handles multiple formats:
 *  - { coordinates: { latitude, longitude } }  (nested group)
 *  - { latitude, longitude }                   (flat group)
 *  - [latitude, longitude]                     (point array)
 */
function extractCoordinates(
  location: unknown,
): {latitude: number; longitude: number} | undefined {
  if (!location) return undefined;

  // Point array: [lat, lng]
  if (Array.isArray(location) && location.length >= 2) {
    return {latitude: location[0] as number, longitude: location[1] as number};
  }

  if (typeof location !== 'object') return undefined;
  const loc = location as Record<string, unknown>;

  // Nested: location.coordinates.latitude
  if (loc.coordinates && typeof loc.coordinates === 'object') {
    const coords = loc.coordinates as Record<string, unknown>;
    if (coords.latitude != null) {
      return {
        latitude: coords.latitude as number,
        longitude: (coords.longitude as number) ?? 0,
      };
    }
  }

  // Flat: location.latitude
  if (loc.latitude != null) {
    return {
      latitude: loc.latitude as number,
      longitude: (loc.longitude as number) ?? 0,
    };
  }

  return undefined;
}

function extractImageUrl(heroImage: unknown): string | undefined {
  if (!heroImage || typeof heroImage !== 'object') return undefined;
  const img = heroImage as Record<string, unknown>;
  const sizes = img.sizes as Record<string, Record<string, string>> | undefined;
  const raw =
    sizes?.medium?.url ||
    sizes?.thumbnail?.url ||
    (img.url as string | undefined);
  return raw ? resolveMediaUrl(raw) : undefined;
}

function transformStop(stop: PayloadTripStop): RouteStop | null {
  const exp = stop.experience;
  if (!exp?.relationTo || exp.value == null) return null;

  const relationTo = exp.relationTo as RouteExperienceType;

  // Use Payload's auto-generated stop.id as unique key (supports duplicate experiences)
  // Fall back to composite key for unpopulated stops without a Payload id
  const experienceId = typeof exp.value === 'number' ? exp.value : exp.value.id;
  const compositeKey = `${relationTo}_${experienceId}`;
  const stopId = stop.id || compositeKey;
  const visited = stop.visited ?? false;

  // Handle unpopulated (just numeric ID) vs populated (full object)
  if (typeof exp.value === 'number') {
    return {
      id: stopId,
      experienceId: exp.value,
      experienceType: relationTo,
      name: '',
      note: stop.note,
      visited,
    };
  }

  const inner = exp.value;
  const cityName =
    typeof inner.city === 'object' && inner.city
      ? inner.city.name
      : undefined;

  return {
    id: stopId,
    experienceId: inner.id,
    experienceType: relationTo,
    name: inner.title || inner.name || '',
    image: extractImageUrl(inner.heroImage),
    cityName,
    location: extractCoordinates(inner.location),
    note: stop.note,
    visited,
  };
}

function transformDay(day: PayloadTripDay): RouteDay {
  return {
    dayNumber: day.dayNumber ?? 1,
    stops: (day.stops ?? [])
      .map(s => transformStop(s))
      .filter((s): s is RouteStop => s !== null),
  };
}

/**
 * Transform a single Payload CMS trip response to app Route model.
 */
export function transformPayloadTripToApp(
  trip: PayloadTripResponse,
): Route {
  return {
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate,
    duration: trip.duration,
    days: (trip.days ?? []).map(d => transformDay(d)),
    pool: (trip.pool ?? [])
      .map(s => transformStop(s))
      .filter((s): s is RouteStop => s !== null),
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

/**
 * Transform an array of Payload trip responses to app Route models.
 */
export function transformPayloadTripsToApp(
  trips: PayloadTripResponse[],
): Route[] {
  return trips.map(transformPayloadTripToApp);
}
