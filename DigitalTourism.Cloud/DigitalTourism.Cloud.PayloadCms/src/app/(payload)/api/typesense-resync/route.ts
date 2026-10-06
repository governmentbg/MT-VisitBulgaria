import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { createLogger } from '@/plugins/logging'
import { getTypesenseService, isServiceInitialized } from '@/plugins/typesense'

const logger = createLogger('api:typesense-resync')

/**
 * POST /api/typesense-resync
 * Recreates Typesense collections and resyncs all data.
 * Query params:
 *   ?collection=experiences  (optional, resync specific collection)
 *   ?recreate=true           (optional, drop and recreate collections, default: true)
 */
export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const url = new URL(request.url)
  const collectionFilter = url.searchParams.get('collection')
  const recreate = url.searchParams.get('recreate') !== 'false'

  if (!isServiceInitialized()) {
    return Response.json({ success: false, error: 'Typesense service not initialized' }, { status: 503 })
  }

  try {
    const service = getTypesenseService()
    const collections = collectionFilter
      ? [collectionFilter]
      : service.getConfiguredCollections()

    const results = []
    // Track which shared targetCollections have already been recreated so we
    // don't drop+recreate the same Typesense collection for every Payload
    // collection that writes to it (e.g. hotels, restaurants → experiences).
    const recreatedTargets = new Set<string>()

    for (const collection of collections) {
      if (!service.hasCollection(collection)) {
        results.push({ collection, error: `Not configured` })
        continue
      }

      // Only recreate a shared targetCollection once; subsequent siblings just upsert.
      const config = service.getCollectionConfig(collection)
      const target = config?.targetCollection
      let shouldRecreate = recreate
      if (shouldRecreate && target) {
        if (recreatedTargets.has(target)) {
          shouldRecreate = false
        } else {
          recreatedTargets.add(target)
        }
      }

      logger.info(`Typesense resync: starting ${collection} (recreate: ${shouldRecreate})`)

      const result = await service.bulkSync(payload, collection, {
        recreate: shouldRecreate,
        onProgress: (progress) => {
          if (progress.percentage % 25 === 0) {
            logger.info(
              `Typesense resync: ${collection} [${progress.locale}] ${progress.percentage}% (${progress.processed}/${progress.total})`
            )
          }
        },
      })

      results.push({
        collection,
        success: result.success,
        totalDocuments: result.totalDocuments,
        durationMs: result.durationMs,
        locales: result.localeResults.map((lr) => ({
          locale: lr.locale,
          imported: lr.imported,
          failed: lr.failed,
        })),
        errors: result.errors,
      })
    }

    return Response.json({ success: true, results })
  } catch (error) {
    logger.error(`Typesense resync failed: ${error}`)
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
