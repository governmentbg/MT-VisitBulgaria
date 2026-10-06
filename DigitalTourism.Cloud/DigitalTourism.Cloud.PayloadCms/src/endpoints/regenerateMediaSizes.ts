import type { Endpoint, PayloadRequest } from 'payload'
import { isAdmin } from '@/access/accessHelpers'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MEDIA_DIR = path.resolve(__dirname, '../../public/media')
const BATCH_SIZE = 5

export const regenerateMediaSizesEndpoint: Endpoint = {
  path: '/regenerate-media-sizes',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!isAdmin(req.user)) {
      return Response.json(
        { errors: [{ message: 'Unauthorized — admin access required' }] },
        { status: 403 },
      )
    }

    const startTime = Date.now()
    let total = 0
    let processed = 0
    let failed = 0

    try {
      let page = 1
      let hasMore = true

      while (hasMore) {
        const found = await req.payload.find({
          collection: 'media',
          depth: 0,
          limit: 100,
          page,
          pagination: true,
          where: {
            mimeType: { like: 'image/%' },
          },
        })

        total = found.totalDocs
        const docs = found.docs

        // Process in batches to limit CPU usage from AVIF encoding
        for (let i = 0; i < docs.length; i += BATCH_SIZE) {
          const batch = docs.slice(i, i + BATCH_SIZE)

          const results = await Promise.allSettled(
            batch.map(async (doc) => {
              const filename = (doc as unknown as { filename?: string }).filename
              if (!filename) throw new Error(`Media ${doc.id} has no filename`)

              const filePath = path.join(MEDIA_DIR, filename)
              if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`)
              }

              // Read the original file and pass it back so Payload re-generates all sizes
              const data = fs.readFileSync(filePath)
              const mimeType = (doc as unknown as { mimeType?: string }).mimeType || 'image/jpeg'

              return req.payload.update({
                collection: 'media',
                id: doc.id,
                data: {},
                file: {
                  data,
                  mimetype: mimeType,
                  name: filename,
                  size: data.byteLength,
                },
              })
            }),
          )

          for (const result of results) {
            if (result.status === 'fulfilled') {
              processed++
            } else {
              failed++
              req.payload.logger.error(
                { err: result.reason },
                'Failed to regenerate media sizes for document',
              )
            }
          }
        }

        hasMore = found.hasNextPage ?? false
        page++
      }

      const durationMs = Date.now() - startTime

      return Response.json(
        { success: true, results: { total, processed, failed, durationMs } },
        { status: 200 },
      )
    } catch (error: unknown) {
      req.payload.logger.error(
        { err: error },
        'Failed to regenerate media sizes',
      )
      const message = error instanceof Error ? error.message : 'Internal server error'
      return Response.json(
        { errors: [{ message }] },
        { status: 500 },
      )
    }
  },
}
