/**
 * Typesense Reindex Endpoint
 *
 * POST /api/typesense-reindex
 *
 * Admin-only endpoint that bulk syncs all configured Typesense collections.
 * Drops and recreates each collection, then re-imports all published documents.
 */

import type { Endpoint, PayloadRequest } from 'payload'
import { isAdmin } from '@/access/accessHelpers'
import { getTypesenseService } from './service'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('typesense:reindex')

export function createReindexEndpoint(): Endpoint {
  return {
    path: '/typesense-reindex',
    method: 'post',
    handler: async (req: PayloadRequest) => {
      if (!isAdmin(req.user)) {
        return Response.json(
          { errors: [{ message: 'Unauthorized — admin access required' }] },
          { status: 403 },
        )
      }

      try {
        const service = getTypesenseService()
        const collections = service.getConfiguredCollections()
        const results: Record<string, { totalDocuments: number; durationMs: number }> = {}

        // Track which targetCollections have already been recreated
        const recreatedTargets = new Set<string>()

        for (const slug of collections) {
          const config = service.getCollectionConfig(slug)
          const target = config?.targetCollection || slug

          // Only recreate the first collection that writes to a shared target
          const shouldRecreate = !recreatedTargets.has(target)
          if (shouldRecreate) {
            recreatedTargets.add(target)
          }

          const syncResult = await service.bulkSync(req.payload, slug, {
            recreate: shouldRecreate,
          })

          results[slug] = {
            totalDocuments: syncResult.totalDocuments,
            durationMs: syncResult.durationMs,
          }

          logger.info(`Reindex completed for ${slug}`, results[slug])
        }

        return Response.json({ success: true, results }, { status: 200 })
      } catch (error) {
        logger.error('Reindex failed', {
          error: error instanceof Error ? error.message : String(error),
        })
        const message = error instanceof Error ? error.message : 'Internal server error'
        return Response.json(
          { errors: [{ message }] },
          { status: 500 },
        )
      }
    },
  }
}
