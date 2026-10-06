/**
 * Attractions API Service
 *
 * Communicates with the .NET API Service at /v1/attractions.
 */

import {apiClient} from './apiClient';
import {API_CONFIG} from './config';
import {createEntityApi} from './createEntityApi';
import {
  transformPayloadAttractionToApp,
  transformPayloadAttractionsToApp,
} from './transforms';
import type {Attraction} from '../../models/Attraction';
import type {ApiListResponse, ApiAttractionDto} from './types/apiServiceTypes';

const baseApi = createEntityApi<Attraction, ApiAttractionDto>({
  endpoint: API_CONFIG.endpoints.attractions,
  transformOne: transformPayloadAttractionToApp,
  transformMany: transformPayloadAttractionsToApp,
});

export const attractionsApi = {
  ...baseApi,

  /**
   * Get attractions by category ID
   */
  async getByCategory(
    categoryId: string,
    locale: string = 'en',
  ): Promise<Attraction[]> {
    const response = await apiClient.get<ApiListResponse<ApiAttractionDto>>(
      API_CONFIG.endpoints.attractions,
      {params: {locale, category: categoryId, limit: 100}},
    );
    return transformPayloadAttractionsToApp(response.data.data);
  },
};
