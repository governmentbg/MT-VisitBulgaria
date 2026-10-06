/**
 * Pagination Transformation Layer
 * 
 * Utilities for extracting and transforming pagination metadata from
 * Payload CMS paginated responses.
 * 
 * @module api/transforms/paginationTransform
 */

import type { PayloadPaginatedResponse } from '../types/payloadTypes';

/**
 * Pagination metadata extracted from Payload CMS response
 * 
 * Provides navigation information for paginated collections
 */
export interface PaginationMeta {
  /** Total number of documents across all pages */
  totalDocs: number;
  
  /** Number of documents per page */
  limit: number;
  
  /** Total number of pages available */
  totalPages: number;
  
  /** Current page number (1-indexed) */
  page: number;
  
  /** Whether there is a previous page */
  hasPrevPage: boolean;
  
  /** Whether there is a next page */
  hasNextPage: boolean;
  
  /** Next page number (null if none) */
  nextPage: number | null;
  
  /** Previous page number (null if none) */
  prevPage: number | null;
}

/**
 * Extract pagination metadata from Payload CMS response
 * 
 * Separates pagination information from document data for easier
 * consumption by UI components and hooks.
 * 
 * @param response - Payload paginated response with docs and pagination fields
 * @returns Pagination metadata object
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/attractions?limit=20&page=2');
 * const pagination = extractPaginationMeta(response);
 * // pagination.hasNextPage === true
 * // pagination.page === 2
 * ```
 */
export function extractPaginationMeta(
  response: PayloadPaginatedResponse<unknown>,
): PaginationMeta {
  return {
    totalDocs: response.totalDocs,
    limit: response.limit,
    totalPages: response.totalPages,
    page: response.page,
    hasPrevPage: response.hasPrevPage,
    hasNextPage: response.hasNextPage,
    nextPage: response.nextPage,
    prevPage: response.prevPage,
  };
}

/**
 * Transform paginated response with document transformation
 * 
 * Generic utility that applies a transformation function to the docs array
 * while extracting pagination metadata. Useful for combining document
 * transformation with pagination extraction in a single step.
 * 
 * @template T - Type of source documents (Payload format)
 * @template R - Type of transformed documents (App format)
 * @param response - Payload paginated response
 * @param transformFn - Function to transform docs array
 * @returns Object with transformed docs and pagination metadata
 * 
 * @example
 * ```typescript
 * const response = await apiClient.get<PayloadPaginatedResponse<PayloadAttractionResponse>>('/api/attractions');
 * const result = await transformPaginatedResponse(
 *   response.data,
 *   transformPayloadAttractionsToApp
 * );
 * // result.docs is Attraction[]
 * // result.pagination is PaginationMeta
 * ```
 */
/**
 * Synchronous version of transformPaginatedResponse
 * 
 * For cases where the transformation function is synchronous.
 * 
 * @template T - Type of source documents (Payload format)
 * @template R - Type of transformed documents (App format)
 * @param response - Payload paginated response
 * @param transformFn - Synchronous function to transform docs array
 * @returns Object with transformed docs and pagination metadata
 */
export function transformPaginatedResponseSync<T, R>(
  response: PayloadPaginatedResponse<T>,
  transformFn: (data: T[]) => R[],
): { docs: R[]; pagination: PaginationMeta } {
  return {
    docs: transformFn(response.docs),
    pagination: extractPaginationMeta(response),
  };
}
