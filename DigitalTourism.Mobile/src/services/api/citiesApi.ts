/**
 * Cities API Service
 *
 * Communicates with the .NET API Service at /v1/cities.
 */

import type {City} from '../../models/City';
import {apiClient} from './apiClient';
import {API_CONFIG} from './config';
import {resolveMediaUrl} from './transforms/payloadHelpers';

interface ApiCityListResponse {
  data: Array<{
    id: number;
    name: string;
    latitude?: number | null;
    longitude?: number | null;
    heroImageUrl?: string | null;
    population?: number | null;
    isCapital?: boolean | null;
  }>;
}

export const citiesApi = {
  async getAll(locale: string = 'en'): Promise<City[]> {
    const response = await apiClient.get<ApiCityListResponse>(
      API_CONFIG.endpoints.cities,
      {params: {locale}},
    );

    return response.data.data
      .filter(c => c.latitude != null && c.longitude != null)
      .map(c => ({
        id: String(c.id),
        name: c.name,
        coordinates: {
          latitude: c.latitude!,
          longitude: c.longitude!,
        },
        heroImageUrl: c.heroImageUrl ? resolveMediaUrl(c.heroImageUrl) : undefined,
        population: c.population ?? undefined,
      }));
  },
};
