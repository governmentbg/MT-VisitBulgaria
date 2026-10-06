/**
 * Payload Typesense Plugin - Type Definitions
 *
 * This file defines the public API surface of the plugin.
 * These interfaces serve as the contract between the plugin and consumers.
 */

import type { Plugin } from 'payload'
import type { Client } from 'typesense'

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

/**
 * Main plugin configuration
 */
export interface TypesensePluginConfig {
  /** Typesense server connection settings */
  connection: TypesenseConnection

  /** Collection-specific configuration */
  collections: Record<string, CollectionConfig>

  /** Global plugin settings */
  settings?: PluginSettings
}

export interface TypesenseConnection {
  /** API key for Typesense authentication */
  apiKey: string

  /** Typesense server nodes */
  nodes: TypesenseNode[]

  /** Connection timeout in seconds (default: 5) */
  connectionTimeoutSeconds?: number

  /** Number of retries on failure (default: 3) */
  numRetries?: number
}

export interface TypesenseNode {
  host: string
  port: number
  protocol: 'http' | 'https'
  path?: string
}

export interface CollectionConfig {
  /** Enable/disable sync for this collection (default: true) */
  enabled?: boolean

  /** Locales to index (creates separate collection per locale) */
  locales: string[]

  /** Whether this collection uses Payload drafts/versions (default: false) */
  drafts?: boolean

  /** Relationships to selectively populate before indexing.
   *  Keys are field names on the document, values specify which collection to fetch from and at what depth.
   *  This avoids expensive blanket deep fetches that cascade into all relationships. */
  populate?: Record<string, { collection: string; depth?: number }>

  /** Field mapping configuration */
  fields: Record<string, FieldConfig>

  /** Fields to exclude from indexing */
  exclude?: string[]

  /** Default sorting field (must be int32 or float) */
  defaultSortingField?: string

  /** Symbols to index verbatim */
  symbolsToIndex?: string[]

  /** Custom token separators */
  tokenSeparators?: string[]

  /** When set, multiple Payload collections write to a single shared Typesense collection.
   *  The Typesense collection name will be `{targetCollection}_{locale}` instead of `{slug}_{locale}`.
   *  Document IDs are prefixed with the Payload collection slug to prevent collisions. */
  targetCollection?: string

  /** Static fields injected into every document before indexing.
   *  Useful for adding discriminator fields when sharing a Typesense collection
   *  (e.g., `{ type: 'hotel' }` to distinguish between experience types). */
  staticFields?: Record<string, unknown>
}

export interface FieldConfig {
  /** Typesense field type */
  type: TypesenseFieldType

  /** Enable faceting (default: false) */
  facet?: boolean

  /** Allow null/missing values (default: false) */
  optional?: boolean

  /** Enable sorting (default: false) */
  sort?: boolean

  /** Enable range index for numerics (default: false) */
  rangeIndex?: boolean

  /** Enable infix search (default: false) */
  infix?: boolean

  /** Override locale for this field */
  locale?: string

  /** Source fields for geopoint [lat, lng] */
  source?: [string, string]

  /** Custom value transformer */
  transform?: (value: unknown, doc: unknown) => unknown
}

export type TypesenseFieldType =
  | 'string'
  | 'string[]'
  | 'int32'
  | 'int32[]'
  | 'int64'
  | 'int64[]'
  | 'float'
  | 'float[]'
  | 'bool'
  | 'bool[]'
  | 'geopoint'
  | 'geopoint[]'
  | 'object'
  | 'object[]'
  | 'auto'

export interface PluginSettings {
  /** Log level (default: 'warn') */
  logLevel?: 'debug' | 'info' | 'warn' | 'error'

  /** Retry failed syncs (default: true) */
  retryOnError?: boolean

  /** Maximum retry attempts (default: 3) */
  maxRetries?: number

  /** Batch size for bulk operations (default: 1000) */
  batchSize?: number
}

// =============================================================================
// TYPESENSE SCHEMA TYPES
// =============================================================================

export interface TypesenseSchema {
  /** Collection name (format: {payloadCollection}_{locale}) */
  name: string

  /** Field definitions */
  fields: TypesenseFieldSchema[]

  /** Default sorting field */
  default_sorting_field?: string

  /** Enable nested field support */
  enable_nested_fields?: boolean

  /** Token separators */
  token_separators?: string[]

  /** Symbols to index */
  symbols_to_index?: string[]
}

export interface TypesenseFieldSchema {
  name: string
  type: TypesenseFieldType
  facet?: boolean
  optional?: boolean
  index?: boolean
  store?: boolean
  sort?: boolean
  infix?: boolean
  locale?: string
  range_index?: boolean
  /** Allow additional properties for Typesense client compatibility */
  [key: string]: unknown
}

// =============================================================================
// SEARCH TYPES
// =============================================================================

/**
 * Search parameters for querying Typesense
 */
export interface SearchParams {
  /** Search query string */
  q: string

  /** Fields to search in */
  queryBy: string[]

  /** Filter expression (Typesense filter syntax) */
  filterBy?: string

  /** Sort expression */
  sortBy?: string

  /** Facet fields to return counts */
  facetBy?: string[]

  /** Page number (1-indexed, default: 1) */
  page?: number

  /** Results per page (default: 10, max: 250) */
  perPage?: number

  /** Typo tolerance 0-2 (default: 2) */
  numTypos?: number

  /** Fields to highlight */
  highlightFields?: string[]

  /** Group results by field */
  groupBy?: string

  /** Limit results per group (default: 3) */
  groupLimit?: number

  /** Include all fields in response (default: true) */
  includeFields?: string[]

  /** Exclude fields from response */
  excludeFields?: string[]

  /** Maximum number of facet values to return per field (default: 10) */
  maxFacetValues?: number

  /** Prefix search (default: true) */
  prefix?: boolean

  /** Drop tokens if no results (default: true) */
  dropTokensThreshold?: number
}

/**
 * Geo-based search parameters
 */
export interface GeoSearchParams extends SearchParams {
  /** Center point for geo search */
  point: GeoPoint

  /** Search radius in kilometers */
  radiusKm: number

  /** Geopoint field name */
  geoField: string

  /** Sort results by distance (default: false) */
  sortByDistance?: boolean
}

export interface GeoPoint {
  lat: number
  lng: number
}

/**
 * Individual search result
 */
export interface SearchHit<T> {
  /** The matched document */
  document: T

  /** Relevance score (higher is better) */
  textMatchScore: number

  /** Field highlights with matched tokens */
  highlights?: SearchHighlight[]

  /** Geo distance in meters (if geo search) */
  geoDistanceMeters?: number
}

export interface SearchHighlight {
  field: string
  snippet: string
  matchedTokens: string[]
}

/**
 * Search response
 */
export interface SearchResponse<T> {
  /** Matched documents */
  hits: SearchHit<T>[]

  /** Total matching documents */
  found: number

  /** Current page */
  page: number

  /** Results per page */
  perPage: number

  /** Total pages */
  totalPages: number

  /** Search latency in milliseconds */
  searchTimeMs: number

  /** Facet counts (if requested) */
  facetCounts?: FacetCounts

  /** Query used for search */
  query: string
}

export type FacetCounts = Record<string, FacetValue[]>

export interface FacetValue {
  value: string
  count: number
  highlighted?: string
}

/**
 * Multi-search request (search multiple collections at once)
 */
export interface MultiSearchRequest {
  collection: string
  locale: string
  params: SearchParams
}

/**
 * Multi-search response
 */
export interface MultiSearchResponse<T extends Record<string, unknown>> {
  results: {
    [K in keyof T]: SearchResponse<T[K]>
  }
  searchTimeMs: number
}

// =============================================================================
// SYNC TYPES
// =============================================================================

/**
 * Bulk sync options
 */
export interface BulkSyncOptions {
  /** Collection to sync */
  collection: string

  /** Specific locales to sync (default: all configured) */
  locales?: string[]

  /** Batch size (default: from settings) */
  batchSize?: number

  /** Progress callback */
  onProgress?: (progress: SyncProgress) => void

  /** Drop and recreate collection before sync */
  recreate?: boolean
}

export interface SyncProgress {
  collection: string
  locale: string
  processed: number
  total: number
  errors: number
  phase: 'fetching' | 'indexing' | 'complete'
}

export interface SyncResult {
  collection: string
  locale: string
  success: boolean
  indexed: number
  errors: SyncError[]
  durationMs: number
}

export interface SyncError {
  documentId: string
  error: string
  field?: string
}

// =============================================================================
// PLUGIN API
// =============================================================================

/**
 * Main plugin factory function
 */
export type TypesensePluginFactory = (config: TypesensePluginConfig) => Plugin

/**
 * Search service interface (accessible via getTypesenseService)
 */
export interface TypesenseService {
  /**
   * Search a collection
   * @param collection Payload collection slug
   * @param locale Locale code (e.g., 'en', 'bg')
   * @param params Search parameters
   */
  search<T = unknown>(
    collection: string,
    locale: string,
    params: SearchParams
  ): Promise<SearchResponse<T>>

  /**
   * Geo-based search
   * @param collection Payload collection slug
   * @param locale Locale code
   * @param params Geo search parameters
   */
  searchNearby<T = unknown>(
    collection: string,
    locale: string,
    params: GeoSearchParams
  ): Promise<SearchResponse<T>>

  /**
   * Search multiple collections at once
   * @param requests Array of search requests
   */
  multiSearch<T extends Record<string, unknown>>(
    requests: MultiSearchRequest[]
  ): Promise<MultiSearchResponse<T>>

  /**
   * Manually sync a single document
   * @param collection Payload collection slug
   * @param documentId Document ID
   */
  syncDocument(collection: string, documentId: string): Promise<void>

  /**
   * Manually delete a document from search index
   * @param collection Payload collection slug
   * @param documentId Document ID
   * @param locales Specific locales (default: all)
   */
  deleteDocument(
    collection: string,
    documentId: string,
    locales?: string[]
  ): Promise<void>

  /**
   * Bulk sync a collection
   * @param options Sync options
   */
  bulkSync(options: BulkSyncOptions): Promise<SyncResult[]>

  /**
   * Get underlying Typesense client for advanced operations
   */
  getClient(): Client

  /**
   * Health check
   */
  health(): Promise<HealthStatus>
}

export interface HealthStatus {
  ok: boolean
  typesenseVersion?: string
  collections: CollectionStatus[]
  error?: string
}

export interface CollectionStatus {
  name: string
  numDocuments: number
  locale: string
}

// =============================================================================
// HOOK TYPES (for advanced customization)
// =============================================================================

/**
 * Document transformer hook
 */
export type DocumentTransformer = (
  doc: unknown,
  collection: string,
  locale: string
) => unknown | Promise<unknown>

/**
 * Pre-index hook (can modify or skip document)
 */
export type PreIndexHook = (
  doc: unknown,
  collection: string,
  locale: string
) =>
  | { skip: true }
  | { skip: false; document: unknown }
  | Promise<{ skip: true } | { skip: false; document: unknown }>
