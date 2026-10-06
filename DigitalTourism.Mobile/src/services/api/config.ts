/**
 * API Configuration for Payload CMS Integration
 *
 * Centralized configuration for API endpoints, query defaults, and base URLs.
 * This module provides consistent configuration across all API services for
 * communication with the Payload CMS backend.
 *
 * @module api/config
 */

import Config from 'react-native-config';

/**
 * API Configuration Object
 *
 * @property baseURL - Base URL for the API (configurable via environment variable)
 * @property endpoints - Object containing all API endpoint paths
 * @property defaults - Default query parameters for Payload CMS requests
 */
export const API_CONFIG = {
  /**
   * Base URL for all API requests
   * Points to the API Gateway which routes to backend services
   */
  BASE_URL: Config.API_GATEWAY_URL || 'http://localhost:5107/api',

  REQUEST_TIMEOUT: 10000, // 10 seconds

  /**
   * API endpoint paths
   * All paths are relative to baseURL
   */
  endpoints: {
    /** Attractions endpoint (via API Service) */
    attractions: '/v1/attractions',

    /** Events endpoint (via API Service) */
    events: '/v1/events',

    /** Cities endpoint (via API Service) */
    cities: '/v1/cities',

    /** Hotels endpoint (via API Service) */
    hotels: '/v1/hotels',

    /** Restaurants endpoint (via API Service) */
    restaurants: '/v1/restaurants',

    /** Activities endpoint (via API Service) */
    activities: '/v1/activities',

    /** Favourites endpoint (via API Service) */
    favorites: '/v1/favorites',

    /** Trips (Routes) endpoint (via API Service) */
    trips: '/v1/trips',

    /** Account lifecycle endpoint (via API Service) — DELETE anonymizes the caller */
    account: '/v1/account',

    /** Locales endpoint - fetches available locales from backend */
    locales: '/locales',
  },

  /**
   * Default query parameters for API requests
   * These align with Payload CMS conventions
   */
  defaults: {
    /** Default page size for paginated requests (Payload default is 10, we prefer 20) */
    limit: 20,

    /** Default depth for relationship population (1 = populate immediate relationships) */
    depth: 1,

    /** Default locale for content retrieval */
    locale: 'en',
  },
} as const;

/**
 * Type definition for API configuration keys
 * Useful for type-safe access to config properties
 */
export type ApiConfigKey = keyof typeof API_CONFIG;
