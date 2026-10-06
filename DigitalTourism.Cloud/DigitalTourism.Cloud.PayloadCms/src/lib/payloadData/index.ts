/**
 * Payload Data Library
 *
 * Generic utilities for working with Payload CMS data.
 * Provides depth-aware types and query functions for any collection.
 *
 * @example
 * ```typescript
 * import { ActivityAtDepth } from '@/lib/payloadData'
 * import { queryDocumentBySlug } from '@/lib/payloadData/server'
 *
 * const activity = await queryDocumentBySlug<Activity>({
 *   collection: 'activities',
 *   slug: 'my-activity',
 *   locale: 'en',
 * })
 * ```
 */

// Re-export types (client-safe)
export * from './types'

// Note: Server utilities are NOT re-exported here
// Import them directly from '@/lib/payloadData/server' to keep this module client-safe
