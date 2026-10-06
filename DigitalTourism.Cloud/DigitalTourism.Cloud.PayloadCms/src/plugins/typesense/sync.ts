/**
 * Bulk sync operations for initial sync and resync (T052-T055)
 */

import type { Payload, Where } from 'payload'
import type { CollectionConfig } from './types'
import { getClient } from './client'
import {
  ensureCollection,
  deleteCollection,
  resolveTypesenseCollectionName,
  resolveDocumentId,
} from './locale'
import { mapDocument } from './document-mapper'
import { populateRelationships } from './hooks'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:sync')

/**
 * Progress callback type
 */
export interface SyncProgress {
  locale: string
  total: number
  processed: number
  percentage: number
}

/**
 * Options for bulk sync operations
 */
export interface BulkSyncOptions {
  /** Batch size for Payload fetch (default: 1000) */
  batchSize?: number
  /** Drop and recreate collection before sync */
  recreate?: boolean
  /** Progress callback */
  onProgress?: (progress: SyncProgress) => void
}

/**
 * Result of a batch import operation
 */
export interface BatchImportResult {
  success: boolean
  imported: number
  failed: number
  errors: string[]
}

/**
 * Result of a locale sync operation
 */
export interface LocaleSyncResult {
  locale: string
  collectionName: string
  success: boolean
  imported: number
  failed: number
  errors: string[]
}

/**
 * Result of a complete bulk sync operation
 */
export interface BulkSyncResult {
  success: boolean
  totalDocuments: number
  localeResults: LocaleSyncResult[]
  errors: string[]
  durationMs: number
}

/**
 * Options for fetching documents from Payload
 */
export interface FetchOptions {
  /** Depth for relationship population (default: 0) */
  depth?: number
  /** Where filter (e.g., for _status filtering) */
  where?: Where
  /** Locale to fetch for */
  locale?: string
}

/**
 * Fetch all documents from a Payload collection with pagination (T052)
 */
export async function fetchAllDocuments(
  payload: Payload,
  collectionSlug: string,
  batchSize: number = 1000,
  options: FetchOptions = {}
): Promise<unknown[]> {
  const allDocs: unknown[] = []
  let page = 1
  let hasMore = true

  logger.info(`Fetching documents from ${collectionSlug}`)

  while (hasMore) {
     
    const result = await payload.find({
      collection: collectionSlug as any, // Dynamic collection slug
      limit: batchSize,
      page,
      depth: options.depth ?? 0,
      ...(options.where ? { where: options.where } : {}),
      ...(options.locale ? { locale: options.locale as any } : {}),
    })

    allDocs.push(...result.docs)

    hasMore = result.hasNextPage
    if (result.nextPage) {
      page = result.nextPage
    } else {
      hasMore = false
    }

    logger.debug(`Fetched page ${page - 1}, total docs: ${allDocs.length}`)
  }

  logger.info(`Fetched ${allDocs.length} documents from ${collectionSlug}`)
  return allDocs
}

/**
 * Import documents to Typesense using batch API (T053)
 */
export async function batchImport(
  collectionName: string,
  documents: Record<string, unknown>[]
): Promise<BatchImportResult> {
  if (documents.length === 0) {
    return {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
    }
  }

  const client = getClient()
  const errors: string[] = []
  let imported = 0
  let failed = 0

  try {
    const results = await client
      .collections(collectionName)
      .documents()
      .import(documents, { action: 'upsert' })

    for (const result of results) {
      if (result.success) {
        imported++
      } else {
        failed++
        if (result.error) {
          errors.push(result.error)
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    errors.push(errorMessage)
    failed = documents.length
  }

  return {
    success: failed === 0,
    imported,
    failed,
    errors,
  }
}

/**
 * Bulk sync a Payload collection to Typesense (T054)
 */
export async function bulkSync(
  payload: Payload,
  collectionSlug: string,
  config: CollectionConfig,
  options: BulkSyncOptions = {}
): Promise<BulkSyncResult> {
  const startTime = Date.now()
  const { batchSize = 1000, recreate = false, onProgress } = options
  const errors: string[] = []
  const localeResults: LocaleSyncResult[] = []

  // Build where filter for draft-enabled collections (only sync published docs)
  const where = config.drafts ? { _status: { equals: 'published' } } : undefined

  logger.info(`Starting bulk sync for ${collectionSlug}`, {
    locales: config.locales,
    recreate,
    drafts: config.drafts ?? false,
  })

  // Resolve effective Typesense collection slug (may differ from Payload slug)
  const typesenseSlug = config.targetCollection || collectionSlug

  // T055: Handle recreate option
  if (recreate) {
    logger.info(`Recreating collections for ${typesenseSlug}`)
    for (const locale of config.locales) {
      await deleteCollection(typesenseSlug, locale)
    }
  }

  // Ensure all locale collections exist
  for (const locale of config.locales) {
    await ensureCollection(typesenseSlug, config, locale)
  }

  // Track total documents across all locales (use first locale's count as reference)
  let totalDocuments = 0

  // Sync per-locale: fetch locale-specific documents to get correct localized relationship data
  for (const locale of config.locales) {
    const collectionName = resolveTypesenseCollectionName(collectionSlug, config, locale)

    try {
      // Fetch locale-specific documents with depth 0 and published filter
      const allDocs = await fetchAllDocuments(payload, collectionSlug, batchSize, {
        depth: 0,
        where,
        locale,
      })

      if (totalDocuments === 0) {
        totalDocuments = allDocs.length
      }

      if (allDocs.length === 0) {
        localeResults.push({
          locale,
          collectionName,
          success: true,
          imported: 0,
          failed: 0,
          errors: [],
        })
        continue
      }

      logger.info(`Syncing ${allDocs.length} documents to ${collectionName}`)

      // Transform all documents for this locale
      const typesenseDocs: Record<string, unknown>[] = []

      for (let i = 0; i < allDocs.length; i++) {
        const doc = allDocs[i] as Record<string, unknown>

        // Selectively populate only the relationships Typesense needs
        const populatedDoc = await populateRelationships(payload, doc, config, locale)

        // Map to Typesense format
        const typesenseDoc = mapDocument(populatedDoc, config, locale)

        // Ensure id is the resolved (possibly prefixed) id
        typesenseDoc.id = resolveDocumentId(collectionSlug, String(doc.id || ''), config)

        // Inject static fields (e.g., { type: 'hotel' })
        if (config.staticFields) {
          Object.assign(typesenseDoc, config.staticFields)
        }

        typesenseDocs.push(typesenseDoc)

        // Report progress
        if (onProgress && (i + 1) % 100 === 0) {
          onProgress({
            locale,
            total: allDocs.length,
            processed: i + 1,
            percentage: Math.round(((i + 1) / allDocs.length) * 100),
          })
        }
      }

      // Batch import
      const importResult = await batchImport(collectionName, typesenseDocs)

      localeResults.push({
        locale,
        collectionName,
        success: importResult.success,
        imported: importResult.imported,
        failed: importResult.failed,
        errors: importResult.errors,
      })

      // Final progress callback
      if (onProgress) {
        onProgress({
          locale,
          total: allDocs.length,
          processed: allDocs.length,
          percentage: 100,
        })
      }

      logger.info(`Completed sync to ${collectionName}`, {
        imported: importResult.imported,
        failed: importResult.failed,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      errors.push(`${locale}: ${errorMessage}`)
      logger.error(`Failed to sync to ${collectionName}`, { error: errorMessage })

      localeResults.push({
        locale,
        collectionName,
        success: false,
        imported: 0,
        failed: 0,
        errors: [errorMessage],
      })
    }
  }

  const durationMs = Date.now() - startTime
  const success = errors.length === 0 && localeResults.every((r) => r.success)

  logger.info(`Bulk sync completed for ${collectionSlug}`, {
    success,
    totalDocuments,
    durationMs,
  })

  return {
    success,
    totalDocuments,
    localeResults,
    errors,
    durationMs,
  }
}

/**
 * Resync a single locale collection
 */
export async function resyncLocale(
  payload: Payload,
  collectionSlug: string,
  config: CollectionConfig,
  locale: string,
  options: Omit<BulkSyncOptions, 'recreate'> & { recreate?: boolean } = {}
): Promise<LocaleSyncResult> {
  const collectionName = resolveTypesenseCollectionName(collectionSlug, config, locale)
  const typesenseSlug = config.targetCollection || collectionSlug
  const { batchSize = 1000, recreate = false, onProgress } = options

  // Build where filter for draft-enabled collections (only sync published docs)
  const where = config.drafts ? { _status: { equals: 'published' } } : undefined

  logger.info(`Resyncing locale ${locale} for ${collectionSlug}`)

  // Recreate collection if requested
  if (recreate) {
    await deleteCollection(typesenseSlug, locale)
    await ensureCollection(typesenseSlug, config, locale)
  }

  // Fetch locale-specific documents with published filter
  const allDocs = await fetchAllDocuments(payload, collectionSlug, batchSize, {
    depth: 0,
    where,
    locale,
  })

  // Transform documents
  const typesenseDocs: Record<string, unknown>[] = []

  for (let i = 0; i < allDocs.length; i++) {
    const doc = allDocs[i] as Record<string, unknown>

    // Selectively populate only the relationships Typesense needs
    const populatedDoc = await populateRelationships(payload, doc, config, locale)

    const typesenseDoc = mapDocument(populatedDoc, config, locale)
    typesenseDoc.id = resolveDocumentId(collectionSlug, String(doc.id || ''), config)

    // Inject static fields (e.g., { type: 'hotel' })
    if (config.staticFields) {
      Object.assign(typesenseDoc, config.staticFields)
    }

    typesenseDocs.push(typesenseDoc)

    if (onProgress && (i + 1) % 100 === 0) {
      onProgress({
        locale,
        total: allDocs.length,
        processed: i + 1,
        percentage: Math.round(((i + 1) / allDocs.length) * 100),
      })
    }
  }

  // Import
  const importResult = await batchImport(collectionName, typesenseDocs)

  if (onProgress) {
    onProgress({
      locale,
      total: allDocs.length,
      processed: allDocs.length,
      percentage: 100,
    })
  }

  return {
    locale,
    collectionName,
    success: importResult.success,
    imported: importResult.imported,
    failed: importResult.failed,
    errors: importResult.errors,
  }
}
