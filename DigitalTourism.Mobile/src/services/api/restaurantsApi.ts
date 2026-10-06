/**
 * Restaurants API Service
 *
 * Communicates with the .NET API Service at /v1/restaurants.
 */

import {createEntityApi} from './createEntityApi';
import {API_CONFIG} from './config';
import {
  transformPayloadRestaurantToApp,
  transformPayloadRestaurantsToApp,
} from './transforms';
import type {Restaurant} from '../../models/Restaurant';
import type {ApiRestaurantDto} from './types/apiServiceTypes';

export const restaurantsApi = createEntityApi<Restaurant, ApiRestaurantDto>({
  endpoint: API_CONFIG.endpoints.restaurants,
  transformOne: transformPayloadRestaurantToApp,
  transformMany: transformPayloadRestaurantsToApp,
});
