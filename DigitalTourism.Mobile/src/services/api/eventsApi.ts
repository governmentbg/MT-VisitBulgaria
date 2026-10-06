/**
 * Events API Service
 *
 * Communicates with the .NET API Service at /v1/events.
 */

import {apiClient} from './apiClient';
import {API_CONFIG} from './config';
import {createEntityApi} from './createEntityApi';
import {
  transformPayloadEventToApp,
  transformPayloadEventsToApp,
} from './transforms';
import type {Event} from '../../models/Event';
import type {ApiListResponse, ApiEventDto} from './types/apiServiceTypes';

const baseApi = createEntityApi<Event, ApiEventDto>({
  endpoint: API_CONFIG.endpoints.events,
  transformOne: transformPayloadEventToApp,
  transformMany: transformPayloadEventsToApp,
});

export const eventsApi = {
  ...baseApi,

  /**
   * Get only active events (endDate >= now).
   * Fetches all events and filters client-side — the API Service does not
   * yet support server-side date filtering.
   */
  async getActive(locale: string = 'en'): Promise<Event[]> {
    const response = await apiClient.get<ApiListResponse<ApiEventDto>>(
      API_CONFIG.endpoints.events,
      {params: {locale, limit: 100}},
    );
    const now = new Date();
    const events = transformPayloadEventsToApp(response.data.data);
    return events.filter(evt => {
      if (!evt.period?.endDate) return true;
      return new Date(evt.period.endDate) >= now;
    });
  },
};
