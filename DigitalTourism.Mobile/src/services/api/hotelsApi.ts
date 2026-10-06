/**
 * Hotels API Service
 *
 * Communicates with the .NET API Service at /v1/hotels.
 */

import {createEntityApi} from './createEntityApi';
import {API_CONFIG} from './config';
import {
  transformPayloadHotelToApp,
  transformPayloadHotelsToApp,
} from './transforms';
import type {Hotel} from '../../models/Hotel';
import type {ApiHotelDto} from './types/apiServiceTypes';

export const hotelsApi = createEntityApi<Hotel, ApiHotelDto>({
  endpoint: API_CONFIG.endpoints.hotels,
  transformOne: transformPayloadHotelToApp,
  transformMany: transformPayloadHotelsToApp,
});
