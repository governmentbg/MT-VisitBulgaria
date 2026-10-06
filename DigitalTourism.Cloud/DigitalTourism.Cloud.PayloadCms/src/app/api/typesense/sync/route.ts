import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTypesenseService, isServiceInitialized } from '@/plugins/typesense'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Check if Typesense is initialized
    if (!isServiceInitialized()) {
      return NextResponse.json({ error: 'Typesense service not initialized' }, { status: 503 })
    }

    const payload = await getPayload({ config: configPromise })
    const service = getTypesenseService()

    console.log('Starting Typesense bulk sync for experiences...')

    const result = await service.bulkSync(payload, 'experiences', {
      recreate: true, // This will recreate the collections to ensure clean sync
      batchSize: 100,
      onProgress: (progress) => {
        console.log(
          `Sync progress [${progress.locale}]: ${progress.processed}/${progress.total} (${progress.percentage}%)`,
        )
      },
    })

    console.log('Bulk sync completed:', result)

    return NextResponse.json({
      success: result.success,
      totalDocuments: result.totalDocuments,
      durationMs: result.durationMs,
      localeResults: result.localeResults.map((lr) => ({
        locale: lr.locale,
        imported: lr.imported,
        failed: lr.failed,
        errors: lr.errors.slice(0, 5), // Only first 5 errors to keep response small
      })),
      errors: result.errors.slice(0, 10),
    })
  } catch (error) {
    console.error('Bulk sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 },
    )
  }
}

// Also support GET for easy browser testing
export async function GET() {
  return NextResponse.json({
    message: 'Use POST to trigger a Typesense resync for experiences',
    usage: 'curl -X POST http://localhost:3000/api/typesense/sync',
  })
}
