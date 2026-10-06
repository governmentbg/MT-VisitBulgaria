/**
 * Document sync hooks - Payload afterChange/afterDelete integration (T043-T047)
 */

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Payload,
} from 'payload'
import type { CollectionConfig } from './types'
import { getClient } from './client'
import { extractLocalizedValues, resolveTypesenseCollectionName, resolveDocumentId } from './locale'
import { mapDocument } from './document-mapper'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:hooks')

/**
 * Result of a sync operation
 */
export interface SyncResult {
  success: boolean
  documentId: string
  locales: string[]
  errors: string[]
}

/**
 * Selectively populate only the relationships needed for Typesense indexing.
 * Uses the `populate` config to fetch specific referenced documents at the minimum required depth,
 * avoiding expensive blanket deep fetches that cascade into all relationships.
 */
export async function populateRelationships(
  payload: Payload,
  doc: Record<string, unknown>,
  config: CollectionConfig,
  locale: string
): Promise<Record<string, unknown>> {
  if (!config.populate) return doc

  const populated = { ...doc }

  for (const [field, ref] of Object.entries(config.populate)) {
    const rawValue = doc[field]

    if (Array.isArray(rawValue)) {
      // hasMany relationship — populate each item in the array
      populated[field] = await Promise.all(
        rawValue.map(async (item) => {
          if (typeof item === 'number' || typeof item === 'string') {
            try {
               
              return await payload.findByID({
                collection: ref.collection as any,
                id: item,
                depth: ref.depth ?? 0,
                locale: locale as any,
                overrideAccess: true,
              })
            } catch (error) {
              logger.debug(`Failed to populate ${field} item (id: ${item})`, {
                error: error instanceof Error ? error.message : String(error),
              })
              return item
            }
          }
          return item // already populated
        })
      )
    } else if (rawValue && (typeof rawValue === 'number' || typeof rawValue === 'string')) {
      // Single relationship — fetch by ID
      try {
         
        populated[field] = await payload.findByID({
          collection: ref.collection as any,
          id: rawValue,
          depth: ref.depth ?? 0,
          locale: locale as any,
          overrideAccess: true,
        })
      } catch (error) {
        logger.debug(`Failed to populate ${field} (id: ${rawValue})`, {
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  return populated
}

/**
 * Sync a single document to Typesense for a specific locale (T043)
 *
 * Non-blocking: errors are logged but never thrown
 */
export async function syncDocumentToTypesenseForLocale(
  collectionSlug: string,
  config: CollectionConfig,
  doc: unknown,
  locale: string
): Promise<{ success: boolean; error?: string }> {
  // Validate document
  if (!doc || typeof doc !== 'object') {
    return { success: false, error: 'Invalid document: missing id' }
  }

  const docObj = doc as Record<string, unknown>
  const rawId = String(docObj.id || '')

  if (!rawId) {
    return { success: false, error: 'Invalid document: missing id' }
  }

  const client = getClient()
  const collectionName = resolveTypesenseCollectionName(collectionSlug, config, locale)
  const documentId = resolveDocumentId(collectionSlug, rawId, config)

  try {
    // Map to Typesense document format (doc is already locale-specific)
    const typesenseDoc = mapDocument(doc, config, locale)

    // Ensure id is the resolved (possibly prefixed) id
    typesenseDoc.id = documentId

    // Inject static fields (e.g., { type: 'hotel' } for shared collections)
    if (config.staticFields) {
      Object.assign(typesenseDoc, config.staticFields)
    }

    // Upsert to Typesense
    await client.collections(collectionName).documents().upsert(typesenseDoc)

    logger.debug(`Synced document ${documentId} to ${collectionName} successfully`)
    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Failed to sync document ${documentId} to ${collectionName}`, {
      error: errorMessage,
    })
    return { success: false, error: errorMessage }
  }
}

/**
 * Sync a single document to Typesense for all configured locales (T043)
 *
 * Non-blocking: errors are logged but never thrown
 *
 * @deprecated Use syncDocumentToTypesenseForLocale with payload.findByID for each locale instead
 */
export async function syncDocumentToTypesense(
  collectionSlug: string,
  config: CollectionConfig,
  doc: unknown
): Promise<SyncResult> {
  const errors: string[] = []
  const successLocales: string[] = []

  // Validate document
  if (!doc || typeof doc !== 'object') {
    return {
      success: false,
      documentId: '',
      locales: [],
      errors: ['Invalid document: missing id'],
    }
  }

  const docObj = doc as Record<string, unknown>
  const documentId = String(docObj.id || '')

  if (!documentId) {
    return {
      success: false,
      documentId: '',
      locales: [],
      errors: ['Invalid document: missing id'],
    }
  }

  // Sync to each locale collection
  for (const locale of config.locales) {
    // Get localized field names from config
    const localizedFields = Object.keys(config.fields)

    // Extract localized values for this locale
    const localizedDoc = extractLocalizedValues(doc, locale, localizedFields)

    const result = await syncDocumentToTypesenseForLocale(
      collectionSlug,
      config,
      localizedDoc,
      locale
    )

    if (result.success) {
      successLocales.push(locale)
    } else if (result.error) {
      errors.push(`${locale}: ${result.error}`)
    }
  }

  return {
    success: errors.length === 0,
    documentId,
    locales: successLocales,
    errors,
  }
}

/**
 * Delete a document from Typesense for all configured locales (T044)
 *
 * Non-blocking: errors are logged but never thrown
 */
export async function deleteDocumentFromTypesense(
  collectionSlug: string,
  config: CollectionConfig,
  documentId: string
): Promise<SyncResult> {
  const errors: string[] = []
  const successLocales: string[] = []
  const client = getClient()
  const resolvedId = resolveDocumentId(collectionSlug, documentId, config)

  await Promise.allSettled(config.locales.map(async (locale) => {
    const collectionName = resolveTypesenseCollectionName(collectionSlug, config, locale)

    try {
      await client.collections(collectionName).documents(resolvedId).delete()
      successLocales.push(locale)
      logger.debug(`Deleted document ${resolvedId} from ${collectionName}`)
    } catch (error) {
      // Document not found is not an error for delete operations
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      if (errorMessage.includes('not found') || errorMessage.includes('Could not find')) {
        successLocales.push(locale)
        logger.debug(
          `Document ${resolvedId} not found in ${collectionName} (already deleted)`
        )
      } else {
        errors.push(`${locale}: ${errorMessage}`)
        logger.error(
          `Failed to delete document ${resolvedId} from ${collectionName}`,
          { error: errorMessage }
        )
      }
    }
  }))

  return {
    success: errors.length === 0,
    documentId: resolvedId,
    locales: successLocales,
    errors,
  }
}

/**
 * Create an afterChange hook factory for a collection (T045)
 *
 * Usage:
 * ```typescript
 * const experiencesConfig: CollectionConfig = { ... }
 *
 * export const Experiences: CollectionConfig = {
 *   slug: 'experiences',
 *   hooks: {
 *     afterChange: [createAfterChangeHook('experiences', experiencesConfig)],
 *   },
 * }
 * ```
 */
export function createAfterChangeHook(
  collectionSlug: string,
  config: CollectionConfig
): CollectionAfterChangeHook {
  return async ({ doc, req, previousDoc }) => {
    // Allow callers (e.g. seed scripts) to skip Typesense sync via context flag
    if ((req.context as Record<string, unknown>)?.disableTypesenseSync === true) {
      return doc
    }

    const docObj = doc as Record<string, unknown>
    const documentId = String(docObj?.id || '')

    if (!documentId) {
      logger.warn(`afterChange hook called without document id for ${collectionSlug}`)
      return doc
    }

    const status = docObj._status as string | undefined

    // Non-published save: decide whether to delete from index or skip entirely
    if (status !== undefined && status !== 'published') {
      const isDraftSave = (req.context as Record<string, unknown>)?.isDraftSave === true
      if (isDraftSave) {
        // Saving a draft of still-published content → keep index as-is
        logger.debug(`Draft save for ${collectionSlug}/${documentId}, keeping index`)
        return doc
      }

      const previousStatus = (previousDoc as Record<string, unknown>)?._status as string | undefined
      if (previousStatus !== 'published') {
        // Was never published (e.g. new draft, or draft→draft) → nothing to remove
        logger.debug(`Non-published save for ${collectionSlug}/${documentId}, nothing to remove from index`)
        return doc
      }
    }

    // Capture references needed after response is sent (req may be cleaned up)
    const payload = req.payload
    const currentLocale = (req.locale as string) || config.locales[0]

    // Fire-and-forget: don't await — response returns immediately
    void (async () => {
      try {
        // Unpublish: previously published → now non-published → remove from index
        if (status !== undefined && status !== 'published') {
          await deleteDocumentFromTypesense(collectionSlug, config, documentId)
          return
        }

        // Sync to ALL configured locales in parallel.
        // Use doc from the hook for the current locale (guaranteed fresh — avoids
        // stale findByID results within the same transaction). Use findByID only
        // for other locales (safe since their data didn't change in this save).
        await Promise.allSettled(config.locales.map(async (locale) => {
          try {
            let localeDoc: Record<string, unknown>

            if (locale === currentLocale) {
              // Current locale: use doc from hook directly (no DB round-trip)
              localeDoc = { ...docObj }
            } else {
              // Other locales: fetch per-locale version (their data is stable)
              localeDoc = (await payload.findByID({
                collection: collectionSlug as any,
                id: documentId,
                depth: 0,
                locale: locale as any,
                overrideAccess: true,
              })) as Record<string, unknown>
            }

            // Selectively populate only the relationships Typesense needs
            const populatedDoc = await populateRelationships(
              payload,
              localeDoc,
              config,
              locale
            )

            await syncDocumentToTypesenseForLocale(
              collectionSlug,
              config,
              populatedDoc,
              locale
            )
          } catch (error) {
            // Per-locale error handling: one locale failure doesn't block others
            logger.error(`Failed to sync ${collectionSlug}/${documentId} for locale ${locale}`, {
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }))
      } catch (error) {
        // T047: Non-blocking error handling - log but don't throw
        logger.error(`Unexpected error syncing ${collectionSlug}`, {
          error: error instanceof Error ? error.message : String(error),
          documentId,
        })
      }
    })()

    // Always return the document unchanged immediately
    return doc
  }
}

/**
 * Create an afterDelete hook factory for a collection (T046)
 *
 * Usage:
 * ```typescript
 * export const Experiences: CollectionConfig = {
 *   slug: 'experiences',
 *   hooks: {
 *     afterDelete: [createAfterDeleteHook('experiences', experiencesConfig)],
 *   },
 * }
 * ```
 */
export function createAfterDeleteHook(
  collectionSlug: string,
  config: CollectionConfig
): CollectionAfterDeleteHook {
  return async ({ doc, id }) => {
    const documentId = String(id || (doc as Record<string, unknown>)?.id || '')

    if (!documentId) {
      logger.warn(`afterDelete hook called without document id for ${collectionSlug}`)
      return doc
    }

    // Fire-and-forget: don't await — response returns immediately
    void (async () => {
      try {
        await deleteDocumentFromTypesense(collectionSlug, config, documentId)
      } catch (error) {
        // T047: Non-blocking error handling - log but don't throw
        logger.error(`Unexpected error in afterDelete hook for ${collectionSlug}`, {
          error: error instanceof Error ? error.message : String(error),
          documentId,
        })
      }
    })()

    return doc
  }
}

/**
 * Create both afterChange and afterDelete hooks for a collection
 */
export function createSyncHooks(
  collectionSlug: string,
  config: CollectionConfig
): {
  afterChange: CollectionAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
} {
  return {
    afterChange: createAfterChangeHook(collectionSlug, config),
    afterDelete: createAfterDeleteHook(collectionSlug, config),
  }
}
