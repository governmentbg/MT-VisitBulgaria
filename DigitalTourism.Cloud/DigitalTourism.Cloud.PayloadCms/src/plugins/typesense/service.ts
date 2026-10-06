/**
 * TypesenseService - aggregates all Typesense operations (T067-T068)
 */

import type { Payload } from 'payload'
import type {
  TypesensePluginConfig,
  CollectionConfig,
  SearchParams,
  GeoSearchParams,
} from './types'
import { initializeClient, getClient, testConnection, resetClient } from './client'
import { validateConfig } from './config'
import {
  getCollectionName,
  ensureAllLocaleCollections,
  deleteCollection,
  collectionExists,
} from './locale'
import {
  syncDocumentToTypesense,
  deleteDocumentFromTypesense,
  createAfterChangeHook,
  createAfterDeleteHook,
  createSyncHooks,
} from './hooks'
import { bulkSync, resyncLocale } from './sync'
import { search, searchNearby, multiSearch, searchAllLocales, fuzzySearch } from './search'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:service')

/**
 * Health check result
 */
export interface HealthCheckResult {
  ok: boolean
  version?: string
  error?: string
  latencyMs: number
}

/**
 * TypesenseService - main entry point for all Typesense operations (T067)
 *
 * Provides a unified interface for:
 * - Search operations (search, searchNearby, multiSearch)
 * - Sync operations (sync, resync, bulkSync)
 * - Collection management (ensureCollections, deleteCollection)
 * - Health monitoring
 *
 * @example
 * ```typescript
 * const service = getTypesenseService()
 *
 * // Search
 * const results = await service.search<Experience>('experiences', 'en', {
 *   q: 'hotel',
 *   queryBy: ['title', 'description'],
 * })
 *
 * // Bulk sync
 * await service.bulkSync(payload, 'experiences')
 *
 * // Health check
 * const health = await service.health()
 * ```
 */
export class TypesenseService {
  private config: TypesensePluginConfig
  private initialized = false

  constructor(config: TypesensePluginConfig) {
    this.config = config
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    // Validate configuration
    validateConfig(this.config)

    // Initialize client
    initializeClient(this.config.connection)

    this.initialized = true
    logger.info('TypesenseService initialized')
  }

  /**
   * Get collection configuration
   */
  getCollectionConfig(collection: string): CollectionConfig | undefined {
    return this.config.collections[collection]
  }

  /**
   * Check if a collection is configured
   */
  hasCollection(collection: string): boolean {
    return collection in this.config.collections
  }

  /**
   * Get all configured collection names
   */
  getConfiguredCollections(): string[] {
    return Object.keys(this.config.collections)
  }

  // ==================== Search Operations ====================

  /**
   * Search a collection
   */
  async search<T = Record<string, unknown>>(
    collection: string,
    locale: string,
    params: SearchParams,
  ) {
    return search<T>(collection, locale, params)
  }

  /**
   * Geo-distance search
   */
  async searchNearby<T = Record<string, unknown>>(
    collection: string,
    locale: string,
    params: GeoSearchParams,
  ) {
    return searchNearby<T>(collection, locale, params)
  }

  /**
   * Multi-collection search
   */
  async multiSearch<T = Record<string, unknown>>(
    requests: Array<{ collection: string; locale: string; params: SearchParams }>,
  ) {
    return multiSearch<T>(requests)
  }

  /**
   * Search all locales
   */
  async searchAllLocales<T = Record<string, unknown>>(
    collection: string,
    locales: string[],
    params: SearchParams,
  ) {
    return searchAllLocales<T>(collection, locales, params)
  }

  /**
   * Fuzzy search with max typo tolerance
   */
  async fuzzySearch<T = Record<string, unknown>>(
    collection: string,
    locale: string,
    params: Omit<SearchParams, 'numTypos'>,
  ) {
    return fuzzySearch<T>(collection, locale, params)
  }

  // ==================== Sync Operations ====================

  /**
   * Sync a single document
   */
  async syncDocument(collection: string, doc: unknown) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }
    return syncDocumentToTypesense(collection, config, doc)
  }

  /**
   * Delete a document
   */
  async deleteDocument(collection: string, documentId: string) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }
    return deleteDocumentFromTypesense(collection, config, documentId)
  }

  /**
   * Bulk sync a collection.
   * When `recreate` is true and the collection uses a shared `targetCollection`,
   * merges fields from all sibling collections so the recreated schema is complete.
   */
  async bulkSync(
    payload: Payload,
    collection: string,
    options?: { recreate?: boolean; batchSize?: number; onProgress?: (progress: any) => void },
  ) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }

    // When recreating a shared targetCollection, merge fields from all siblings
    // so the schema includes fields from every collection that writes to this index.
    let effectiveConfig = config
    if (options?.recreate && config.targetCollection) {
      effectiveConfig = this.mergeTargetCollectionConfig(config)
    }

    return bulkSync(payload, collection, effectiveConfig, options)
  }

  /**
   * Merge field configs from all collections that share the same targetCollection.
   */
  private mergeTargetCollectionConfig(baseConfig: CollectionConfig): CollectionConfig {
    const target = baseConfig.targetCollection
    if (!target) return baseConfig

    const mergedFields = { ...baseConfig.fields }
    for (const [, siblingConfig] of Object.entries(this.config.collections)) {
      if (siblingConfig.targetCollection !== target || siblingConfig === baseConfig) continue
      for (const [fieldName, fieldConfig] of Object.entries(siblingConfig.fields)) {
        if (!(fieldName in mergedFields)) {
          mergedFields[fieldName] = fieldConfig
        }
      }
    }

    return { ...baseConfig, fields: mergedFields }
  }

  /**
   * Resync a specific locale
   */
  async resyncLocale(
    payload: Payload,
    collection: string,
    locale: string,
    options?: { recreate?: boolean; batchSize?: number; onProgress?: (progress: any) => void },
  ) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }
    return resyncLocale(payload, collection, config, locale, options)
  }

  // ==================== Collection Management ====================

  /**
   * Ensure all collections exist for a configured collection
   */
  async ensureCollections(collection: string) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }
    return ensureAllLocaleCollections(collection, config)
  }

  /**
   * Delete a locale collection
   */
  async deleteLocaleCollection(collection: string, locale: string) {
    return deleteCollection(collection, locale)
  }

  /**
   * Check if a locale collection exists
   */
  async collectionExists(collection: string, locale: string) {
    return collectionExists(collection, locale)
  }

  /**
   * Get collection name for a locale
   */
  getCollectionName(collection: string, locale: string) {
    return getCollectionName(collection, locale)
  }

  // ==================== Hook Factories ====================

  /**
   * Create Payload hooks for a collection
   */
  createHooks(collection: string) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }
    return createSyncHooks(collection, config)
  }

  /**
   * Create afterChange hook
   */
  createAfterChangeHook(collection: string) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }
    return createAfterChangeHook(collection, config)
  }

  /**
   * Create afterDelete hook
   */
  createAfterDeleteHook(collection: string) {
    const config = this.getCollectionConfig(collection)
    if (!config) {
      throw new Error(`Collection ${collection} not configured`)
    }
    return createAfterDeleteHook(collection, config)
  }

  // ==================== Health & Status ====================

  /**
   * Check service health (T068)
   */
  async health(): Promise<HealthCheckResult> {
    const startTime = Date.now()

    try {
      const result = await testConnection()
      return {
        ok: result.ok,
        version: result.version,
        error: result.error,
        latencyMs: Date.now() - startTime,
      }
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        latencyMs: Date.now() - startTime,
      }
    }
  }

  /**
   * Get the underlying Typesense client
   */
  getClient() {
    return getClient()
  }

  /**
   * Reset the client (useful for testing)
   */
  resetClient() {
    resetClient()
    this.initialized = false
  }
}

// ==================== Singleton Instance ====================

let serviceInstance: TypesenseService | null = null

/**
 * Initialize the TypesenseService singleton
 */
export function initializeService(config: TypesensePluginConfig): TypesenseService {
  if (serviceInstance) {
    logger.warn('TypesenseService already initialized, resetting')
    serviceInstance.resetClient()
  }

  serviceInstance = new TypesenseService(config)
  return serviceInstance
}

/**
 * Get the TypesenseService singleton (T071)
 *
 * @throws Error if service not initialized
 */
export function getTypesenseService(): TypesenseService {
  if (!serviceInstance) {
    throw new Error(
      'TypesenseService not initialized. Call typesensePlugin() in your Payload config first.',
    )
  }
  return serviceInstance
}

/**
 * Check if the service is initialized
 */
export function isServiceInitialized(): boolean {
  return serviceInstance !== null
}
