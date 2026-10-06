import { NextRequest, NextResponse } from 'next/server'
import { stat, createReadStream } from 'fs'
import { promisify } from 'util'
import path from 'path'
import { Readable } from 'stream'
import { createLogger } from '@/plugins/logging'

const logger = createLogger('api:media')

const statAsync = promisify(stat)

// MIME type mapping
const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.aac': 'audio/aac',
}

/**
 * Dynamic media file serving route
 *
 * Serves files from public/media at runtime, bypassing Next.js static file caching.
 * This is required for Docker deployments where the public folder is baked into the image
 * at build time, but media files are uploaded to a mounted volume at runtime.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params

  // Sanitize path to prevent directory traversal
  const sanitizedPath = pathSegments
    .map(segment => segment.replace(/\.\./g, ''))
    .join('/')

  // Resolve the full file path
  const filePath = path.join(process.cwd(), 'public', 'media', sanitizedPath)

  // Ensure the resolved path is still within public/media
  const mediaDir = path.join(process.cwd(), 'public', 'media')
  if (!filePath.startsWith(mediaDir)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  try {
    const stats = await statAsync(filePath)

    if (!stats.isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Get MIME type from extension
    const ext = path.extname(filePath).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'

    // Handle range requests for video/audio streaming
    const range = request.headers.get('range')

    if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1
      const chunkSize = end - start + 1

      const stream = createReadStream(filePath, { start, end })
      const webStream = Readable.toWeb(stream) as ReadableStream

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Length': chunkSize.toString(),
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Full file response
    const stream = createReadStream(filePath)
    const webStream = Readable.toWeb(stream) as ReadableStream

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    logger.error('Media serving error', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
