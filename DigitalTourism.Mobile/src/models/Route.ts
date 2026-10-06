/**
 * Route (Trip) Data Models
 *
 * App-level models for the Routes feature.
 * Backend stores these as "Trips" in Payload CMS; the transform layer
 * maps Payload Trip responses to these interfaces.
 */

export type RouteExperienceType =
  | 'hotels'
  | 'restaurants'
  | 'activities'
  | 'attractions'
  | 'events';

export interface RouteStop {
  /** Composite key: `${experienceType}_${experienceId}` */
  id: string;
  /** Payload numeric ID of the experience */
  experienceId: number;
  /** Collection slug the experience belongs to */
  experienceType: RouteExperienceType;
  /** Display name (populated from experience) */
  name: string;
  /** Hero image URL (populated from experience) */
  image?: string;
  /** City name (populated from experience) */
  cityName?: string;
  /** Coordinates for map display */
  location?: {latitude: number; longitude: number};
  /** Optional user note for this stop */
  note?: string;
  /** Whether the user has visited this stop (tracked locally via MMKV) */
  visited: boolean;
}

export interface RouteDay {
  dayNumber: number;
  stops: RouteStop[];
}

export interface Route {
  id: number;
  name: string;
  /** ISO 8601 date string */
  startDate: string;
  /** Number of days */
  duration: number;
  days: RouteDay[];
  /** Unassigned experiences (not placed in a day) */
  pool: RouteStop[];
  createdAt: string;
  updatedAt: string;
}

/** Category emoji mapping for display — re-exported from centralized constants */
export {TYPE_EMOJI as EXPERIENCE_TYPE_EMOJI} from '../constants';

/** Singular display label keys per experience type */
export const EXPERIENCE_TYPE_LABEL: Record<RouteExperienceType, string> = {
  attractions: 'Attractions',
  events: 'Events',
  hotels: 'Hotels',
  restaurants: 'Restaurants',
  activities: 'Activities',
};
