/**
 * Search API — calls the structured search endpoints exposed by the
 * .NET API Service:
 *
 *   POST /v1/search/experiences  — main experience/listing search
 *   POST /v1/search/map          — map search with city grouping
 *
 * These forward to Payload custom endpoints which in turn reuse the
 * exact same `searchExperiences()` / `searchMapExperiences()` logic the
 * Next.js frontend runs. That means per-facet AND/OR filter modes, admin
 * `facetConfig` ordering and every other web behaviour applies identically
 * on mobile — the client never builds Typesense filter strings and never
 * hits Typesense directly.
 */

import {apiClient} from './apiClient';
import type {
  ExperienceSearchResponse,
  MapSearchResponse,
  MapSearchRequestParams,
  SearchParams,
  SearchFilters,
} from './types/searchTypes';

interface ExperienceSearchRequestBody {
  query?: string;
  locale: string;
  page?: number;
  perPage?: number;
  filters?: SearchFilters;
  sortBy?: string;
  geoSort?: { lat: number; lng: number };
}

/**
 * Mobile search API. All methods return the normalized server shape —
 * hits are `ExperienceSearchResult` (flat), facets are
 * `Record<field, FacetValue[]>` (not raw Typesense arrays).
 */
export const searchApi = {
  /**
   * Main search with optional pagination, filters, sort and facets.
   */
  async search(params: SearchParams = {}): Promise<ExperienceSearchResponse> {
    const body: ExperienceSearchRequestBody = {
      query: params.query ?? '*',
      locale: params.locale || 'en',
      page: params.page,
      perPage: params.perPage,
      filters: params.filters,
      sortBy: params.sortBy,
      geoSort: params.geoSort,
    };

    const response = await apiClient.post<ExperienceSearchResponse>(
      '/v1/search/experiences',
      body,
    );
    return response.data;
  },

  /**
   * Autocomplete suggestions (lightweight search).
   * Optionally sorted by proximity to a point.
   */
  async suggest(
    query: string,
    locale?: string,
    limit: number = 5,
    geoSort?: {lat: number; lng: number},
  ): Promise<ExperienceSearchResponse> {
    return this.search({
      query,
      locale,
      perPage: limit,
      geoSort,
    });
  },

  /**
   * Facets only — requests perPage=0 so no hits are serialized, just the
   * facet counts needed by the filter drawer.
   *
   * Note: JavaScript destructuring defaults only apply to `undefined`, not
   * `0` — so `perPage: 0` survives all the way into the server call and
   * Typesense returns an empty `hits` array but the full facet counts.
   */
  async facets(
    locale?: string,
    filters?: SearchFilters,
  ): Promise<ExperienceSearchResponse> {
    return this.search({
      query: '*',
      locale,
      filters,
      perPage: 0,
    });
  },

  /**
   * Map search — city clustering at country zoom, individual markers with
   * filter facets at city zoom. Mirrors `searchMapExperiences()` on web.
   */
  async mapSearch(
    params: MapSearchRequestParams,
  ): Promise<MapSearchResponse> {
    const body = {
      query: params.query ?? '*',
      locale: params.locale || 'en',
      filters: params.filters,
      groupByCity: params.groupByCity,
    };

    const response = await apiClient.post<MapSearchResponse>(
      '/v1/search/map',
      body,
    );
    return response.data;
  },
};
