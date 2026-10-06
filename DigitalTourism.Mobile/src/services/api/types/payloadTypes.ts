/**
 * Payload CMS Response Types
 * 
 * Type definitions for responses from Payload CMS REST API.
 * These types represent the raw structure returned by Payload before
 * transformation to app models.
 * 
 * @module api/types/payloadTypes
 */

/**
 * Generic pagination wrapper used by Payload CMS for collection responses
 * 
 * @template T - The type of documents in the docs array
 */
export interface PayloadPaginatedResponse<T> {
  /** Array of documents for the current page */
  docs: T[];
  
  /** Total number of documents across all pages */
  totalDocs: number;
  
  /** Number of documents per page (limit parameter) */
  limit: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** Current page number (1-indexed) */
  page: number;
  
  /** Counter for pagination display (starting index) */
  pagingCounter: number;
  
  /** Whether there is a previous page */
  hasPrevPage: boolean;
  
  /** Whether there is a next page */
  hasNextPage: boolean;
  
  /** Previous page number (null if no previous page) */
  prevPage: number | null;
  
  /** Next page number (null if no next page) */
  nextPage: number | null;
}

/**
 * Base document interface with common Payload CMS fields
 * All Payload documents include id, createdAt, and updatedAt
 */
export interface PayloadDocument {
  /** Unique document identifier */
  id: string;
  
  /** ISO 8601 timestamp of document creation */
  createdAt: string;
  
  /** ISO 8601 timestamp of last update */
  updatedAt: string;
}

