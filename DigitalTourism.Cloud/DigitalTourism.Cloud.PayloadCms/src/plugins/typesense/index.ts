/**
 * Payload Typesense Plugin - Main Entry Point 
 *
 * A custom PayloadCMS plugin for Typesense integration with:
 * - Proper field type mapping (int32, float, geopoint, bool)
 * - Locale-aware indexing and search
 * - Automatic document sync via hooks
 * - Typed search API
 *
 * @example
 * ```typescript
 * // payload.config.ts
 * import { typesensePlugin } from './plugins/typesense'
 *
 * export default buildConfig({
 *   plugins: [
 *     typesensePlugin({
 *       connection: {
 *         apiKey: process.env.TYPESENSE_API_KEY!,
 *         nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
 *       },
 *       collections: {
 *         experiences: {
 *           locales: ['en', 'bg'],
 *           fields: {
 *             title: { type: 'string', facet: false },
 *             type: { type: 'string', facet: true },
 *             location: {
 *               type: 'geopoint',
 *               source: ['coordinates.lat', 'coordinates.lng'],
 *             },
 *           },
 *         },
 *       },
 *     }),
 *   ],
 * })
 * ```
 */

import type { Config, Plugin } from 'payload'
import type { TypesensePluginConfig, CollectionConfig } from './types'
import { validateConfig } from './config'
import { initializeClient } from './client'
import { ensureAllLocaleCollections } from './locale'
import { createAfterChangeHook, createAfterDeleteHook } from './hooks'
import { initializeService, getTypesenseService, isServiceInitialized } from './service'
import { createReindexEndpoint } from './reindexEndpoint'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense')

/**
 * Create the Typesense plugin for Payload (T069)
 *
 * @param config Plugin configuration
 * @returns Payload plugin
 */
export function typesensePlugin(config: TypesensePluginConfig): Plugin {
  // Validate config early
  validateConfig(config)

  return (incomingConfig: Config,): Config => {
    // Initialize service singleton
    const service = initializeService(config)

    // Initialize the Typesense client
    initializeClient(config.connection)

    logger.debug('Typesense plugin initialized', {
      collections: Object.keys(config.collections),
    })

    // Add hooks to configured collections
    const collections = (incomingConfig.collections || []).map((collection) => {
      // Skip non-object collections (shouldn't happen in practice)
      if (typeof collection !== 'object') {
        return collection
      }

      const collectionSlug = collection.slug
      const typesenseConfig = config.collections[collectionSlug]

      if (!typesenseConfig || typesenseConfig.enabled === false) {
        return collection
      }

      // Add sync hooks
      const existingHooks = collection.hooks || {}

      const afterChangeHooks = [
        ...(existingHooks.afterChange || []),
        createAfterChangeHook(collectionSlug, typesenseConfig),
      ]

      const afterDeleteHooks = [
        ...(existingHooks.afterDelete || []),
        createAfterDeleteHook(collectionSlug, typesenseConfig),
      ]

      logger.debug(`Added Typesense hooks to ${collectionSlug}`)

      return {
        ...collection,
        hooks: {
          ...existingHooks,
          afterChange: afterChangeHooks,
          afterDelete: afterDeleteHooks          
        },
      }
    })

    // Return modified config with onInit handler
    return {
      ...incomingConfig,
      collections,
      endpoints: [...(incomingConfig.endpoints || []), createReindexEndpoint()],
      onInit: async (payload) => {
        // Call existing onInit if present
        if (incomingConfig.onInit) {
          await incomingConfig.onInit(payload)
        }

        // Initialize service
        await service.initialize()

        // Ensure all configured collections exist in Typesense.
        // When multiple Payload collections share a targetCollection, merge their
        // field configs so the unified schema includes fields from ALL collections.
        logger.info('Ensuring Typesense collections exist...')

        // Group collections by their effective Typesense slug
        const targetGroups = new Map<string, CollectionConfig[]>()
        for (const [collectionSlug, collectionConfig] of Object.entries(config.collections)) {
          if (collectionConfig.enabled === false) continue
          const typesenseSlug = collectionConfig.targetCollection || collectionSlug
          const group = targetGroups.get(typesenseSlug) || []
          group.push(collectionConfig)
          targetGroups.set(typesenseSlug, group)
        }

        for (const [typesenseSlug, configs] of targetGroups) {
          // Merge fields from all sibling collections into a single config
          const mergedConfig: CollectionConfig = { ...configs[0] }
          if (configs.length > 1) {
            const mergedFields = { ...mergedConfig.fields }
            for (let i = 1; i < configs.length; i++) {
              for (const [fieldName, fieldConfig] of Object.entries(configs[i].fields)) {
                if (!(fieldName in mergedFields)) {
                  mergedFields[fieldName] = fieldConfig
                }
              }
            }
            mergedConfig.fields = mergedFields
          }

          try {
            const results = await ensureAllLocaleCollections(typesenseSlug, mergedConfig)

            for (const result of results) {
              if (result.created) {
                logger.info(`Created collection: ${result.name}`)
              } else {
                logger.debug(`Collection exists: ${result.name}`)
              }
            }
          } catch (error) {
            logger.error(`Failed to ensure collection ${typesenseSlug}`, {
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }

        logger.info('Typesense collections ready')
      },
    }
  }
}

// ==================== Public Exports ====================

// Service accessor
export { getTypesenseService, isServiceInitialized }

// Types
export type {
  TypesensePluginConfig,
  TypesenseConnection,
  TypesenseNode,
  CollectionConfig,
  FieldConfig,
  TypesenseFieldType,
  PluginSettings,
  TypesenseSchema,
  TypesenseFieldSchema,
  SearchParams,
  GeoSearchParams,
  GeoPoint,
  SearchHit,
  SearchHighlight,
  SearchResponse,
  FacetCounts,
  FacetValue,
  MultiSearchRequest,
  SyncError,
} from './types'

// Service class
export { TypesenseService } from './service'

// Search functions (direct access if needed)
export {
  search,
  searchNearby,
  multiSearch,
  searchAllLocales,
  fuzzySearch,
} from './search'

// Sync functions
export { bulkSync, resyncLocale, fetchAllDocuments } from './sync'

// Hook factories
export {
  createAfterChangeHook,
  createAfterDeleteHook,
  createSyncHooks,
  syncDocumentToTypesense,
  deleteDocumentFromTypesense,
  populateRelationships,
} from './hooks'

// Locale utilities
export {
  getCollectionName,
  extractLocalizedValues,
  getCollectionSchema,
  ensureCollection,
  ensureAllLocaleCollections,
  deleteCollection,
  collectionExists,
  getAllCollectionNames,
  resolveTypesenseCollectionName,
  resolveDocumentId,
} from './locale'

// Schema mapping
export {
  mapFieldConfig,
  mapCollectionConfig,
  validateSchema,
} from './schema-mapper'

// Document mapping
export {
  mapDocument,
  mapDocumentField,
  validateDocument,
  getNestedValue,
  extractRichText,
} from './document-mapper'

// Client utilities
export {
  initializeClient,
  getClient,
  isClientReady,
  testConnection,
  resetClient,
} from './client'

// Config utilities
export { validateConfig, getDefaultSettings, ConfigValidationError } from './config'

