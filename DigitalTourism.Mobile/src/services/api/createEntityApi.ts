/**
 * Entity API Factory
 *
 * Creates standardized CRUD API services for .NET API Service entity collections.
 * Each entity type uses this factory for getAll/getById/search, then extends
 * with entity-specific methods as needed.
 */

import {isAxiosError} from 'axios';
import {apiClient} from './apiClient';
import {API_CONFIG} from './config';
import type {PaginationMeta} from './transforms';
import {type ApiListResponse, mapApiPagination} from './types/apiServiceTypes';

export interface EntityApiConfig<T, D = unknown> {
  /** API endpoint path, e.g. '/hotels' */
  endpoint: string;
  /** Transform a single API response to app model */
  transformOne: (data: D) => T;
  /** Transform an array of API responses to app models */
  transformMany: (data: D[]) => T[];
}

export interface EntityApi<T> {
  getAll(
    locale?: string,
    limit?: number,
    page?: number,
  ): Promise<{items: T[]; pagination: PaginationMeta}>;
  getById(id: string, locale?: string): Promise<T | null>;
}

export function createEntityApi<T, D = unknown>(config: EntityApiConfig<T, D>): EntityApi<T> {
  const {endpoint, transformOne, transformMany} = config;

  return {
    async getAll(
      locale: string = 'en',
      limit: number = API_CONFIG.defaults.limit,
      page: number = 1,
    ) {
      const response = await apiClient.get<ApiListResponse<D>>(endpoint, {
        params: {locale, limit, page},
      });
      const {data: raw, ...paging} = response.data;
      return {
        items: transformMany(raw),
        pagination: mapApiPagination(paging),
      };
    },

    async getById(id: string, locale: string = 'en') {
      // The C# API exposes two endpoints per entity:
      //   GET /v1/{entity}/{id:int}        — numeric id lookup
      //   GET /v1/{entity}/by-slug/{slug}  — slug lookup
      // Deep links from shared URLs pass slugs through the same `{id}` param,
      // so auto-detect: numeric → id endpoint, else → by-slug endpoint.
      const isNumericId = /^\d+$/.test(id);
      const path = isNumericId ? `${endpoint}/${id}` : `${endpoint}/by-slug/${encodeURIComponent(id)}`;
      try {
        const response = await apiClient.get<D>(path, {
          params: {locale},
        });
        return transformOne(response.data);
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 404) return null;
        throw error;
      }
    },

  };
}
