/**
 * Routes (Trips) API Service — talks directly to Payload CMS (not the .NET API Service).
 *
 * Handles all route/trip-related operations against the Payload CMS Trips collection.
 * The mobile app shows these as "Routes" but the backend collection is "Trips".
 *
 * Unlike other entity APIs that use `createEntityApi`, routes require:
 * - Direct Payload CMS access with `docs`/`depth` params
 * - Per-route mutation serialization to prevent race conditions
 * - Complex read-modify-write operations (addStop, removeStop, reorderStops)
 * - PDF download integration via RNFS
 */

import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {AxiosError} from 'axios';
import {apiClient, getAuthToken} from './apiClient';
import {API_CONFIG} from './config';
import type {Route, RouteExperienceType} from '../../models/Route';
import {
  transformPayloadTripToApp,
  transformPayloadTripsToApp,
  type PayloadPaginatedTrips,
  type PayloadTripResponse,
} from './transforms/routeTransform';

interface PayloadDayPayload {
  dayNumber: number;
  stops: Array<{
    experience: {relationTo: string; value: number};
    note?: string | null;
    visited?: boolean;
  }>;
}

interface CreateRouteData {
  name: string;
  startDate: string;
  duration: number;
}

interface UpdateRouteData {
  name?: string;
  startDate?: string;
  duration?: number;
  days?: PayloadDayPayload[];
  pool?: Array<{experience: {relationTo: string; value: number}}>;
}

// Per-route mutation queue to prevent read-modify-write race conditions.
// Operations on the same route are serialized; different routes run in parallel.
const routeQueues = new Map<number, Promise<unknown>>();

function withRouteLock<T>(routeId: number, fn: () => Promise<T>): Promise<T> {
  const prev = routeQueues.get(routeId) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  routeQueues.set(routeId, next);
  next.finally(() => {
    if (routeQueues.get(routeId) === next) {
      routeQueues.delete(routeId);
    }
  });
  return next;
}

export const routesApi = {
  /**
   * Get all routes for the current authenticated user.
   */
  async getAll(locale = 'en'): Promise<Route[]> {
    const response = await apiClient.get<PayloadPaginatedTrips>(
      API_CONFIG.endpoints.trips,
      {params: {depth: 2, limit: 100, locale}},
    );
    return transformPayloadTripsToApp(response.data.docs);
  },

  /**
   * Get a single route by ID with fully populated stop data.
   */
  async getById(id: number, locale = 'en'): Promise<Route | null> {
    try {
      const response = await apiClient.get<PayloadTripResponse>(
        `${API_CONFIG.endpoints.trips}/${id}`,
        {params: {depth: 2, locale}},
      );
      return transformPayloadTripToApp(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new route.
   */
  async create(data: CreateRouteData): Promise<Route> {
    // Generate empty days array based on duration
    const days = Array.from({length: data.duration}, (_, i) => ({
      dayNumber: i + 1,
      stops: [],
    }));

    const response = await apiClient.post<{doc: PayloadTripResponse}>(
      API_CONFIG.endpoints.trips,
      {...data, days},
    );
    return transformPayloadTripToApp(response.data.doc);
  },

  /**
   * Update route metadata or days/pool structure.
   */
  async update(id: number, updates: UpdateRouteData): Promise<Route> {
    const response = await apiClient.patch<{doc: PayloadTripResponse}>(
      `${API_CONFIG.endpoints.trips}/${id}`,
      updates,
    );
    return transformPayloadTripToApp(response.data.doc);
  },

  /**
   * Delete a route.
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.endpoints.trips}/${id}`);
  },

  /**
   * Add a stop (experience) to a specific day in the route.
   */
  async addStop(
    routeId: number,
    dayIndex: number,
    experienceType: RouteExperienceType,
    experienceId: number,
    locale = 'en',
  ): Promise<Route> {
    return withRouteLock(routeId, async () => {
      const current = await this.getById(routeId, locale);
      if (!current) throw new Error('Route not found');

      if (dayIndex < 0 || dayIndex >= current.days.length) {
        throw new Error(`Invalid dayIndex ${dayIndex}, route has ${current.days.length} days`);
      }

      const days = current.days.map((day, i) => {
        const stops = day.stops.map(stop => ({
          experience: {relationTo: stop.experienceType, value: stop.experienceId},
          note: stop.note,
          visited: stop.visited,
        }));

        if (i === dayIndex) {
          stops.push({
            experience: {relationTo: experienceType, value: experienceId},
            note: undefined,
            visited: false,
          });
        }

        return {dayNumber: day.dayNumber, stops};
      });

      return this.update(routeId, {days});
    });
  },

  /**
   * Remove a stop from a route by finding and removing it from all days.
   */
  async removeStop(
    routeId: number,
    experienceType: RouteExperienceType,
    experienceId: number,
  ): Promise<Route> {
    return withRouteLock(routeId, async () => {
      const response = await apiClient.get<PayloadTripResponse>(
        `${API_CONFIG.endpoints.trips}/${routeId}`,
        {params: {depth: 0}},
      );
      const raw = response.data;
      const days = (raw.days ?? []).map((day, i) => ({
        dayNumber: day.dayNumber ?? i + 1,
        stops: (day.stops ?? [])
          .filter(stop => {
            const exp = stop.experience;
            if (!exp) return true;
            const valId =
              typeof exp.value === 'number' ? exp.value : (exp.value as {id?: string | number})?.id;
            return !(exp.relationTo === experienceType && valId === experienceId);
          })
          .filter(stop => stop.experience != null)
          .map(stop => ({
            experience: {
              relationTo: stop.experience!.relationTo,
              value: typeof stop.experience!.value === 'number'
                ? stop.experience!.value
                : (stop.experience!.value as {id: number}).id,
            },
            note: stop.note ?? null,
            visited: stop.visited,
          })),
      }));

      return this.update(routeId, {days});
    });
  },

  /**
   * Reorder stops — sends the full updated days array.
   */
  async reorderStops(
    routeId: number,
    days: Array<{dayNumber: number; stops: Array<{experienceType: string; experienceId: number; note?: string; visited?: boolean}>}>,
  ): Promise<Route> {
    return withRouteLock(routeId, async () => {
      const payloadDays = days.map(day => ({
        dayNumber: day.dayNumber,
        stops: (day.stops ?? []).map(stop => ({
          experience: {
            relationTo: stop.experienceType,
            value: stop.experienceId,
          },
          note: stop.note,
          visited: stop.visited,
        })),
      }));
      return this.update(routeId, {days: payloadDays});
    });
  },

  /**
   * Toggle the visited state of a specific stop in a route.
   */
  async toggleStopVisited(
    routeId: number,
    stopId: string,
    visited: boolean,
    locale = 'en',
  ): Promise<Route> {
    return withRouteLock(routeId, async () => {
      const current = await this.getById(routeId, locale);
      if (!current) throw new Error('Route not found');

      const days = current.days.map(day => ({
        dayNumber: day.dayNumber,
        stops: day.stops.map(stop => ({
          experience: {relationTo: stop.experienceType, value: stop.experienceId},
          note: stop.note,
          visited: stop.id === stopId ? visited : stop.visited,
        })),
      }));

      return this.update(routeId, {days});
    });
  },

  /**
   * Download the route's PDF itinerary.
   * Returns the local file path of the saved PDF.
   * Uses the API Service endpoint which fetches trip data and generates PDF server-side.
   */
  async downloadPdf(tripId: number, locale = 'en'): Promise<string> {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.endpoints.trips}/${tripId}/pdf?locale=${locale}`;
    const destDir =
      Platform.OS === 'ios'
        ? RNFS.DocumentDirectoryPath
        : RNFS.DownloadDirectoryPath;
    const destPath = `${destDir}/route_${tripId}.pdf`;

    // RNFS.downloadFile bypasses apiClient — manually add auth header
    const token = await getAuthToken();

    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: destPath,
      headers: token ? {Authorization: `Bearer ${token}`} : {},
    }).promise;

    if (result.statusCode !== 200) {
      throw new Error(`PDF download failed with status ${result.statusCode}`);
    }

    return destPath;
  },
};
