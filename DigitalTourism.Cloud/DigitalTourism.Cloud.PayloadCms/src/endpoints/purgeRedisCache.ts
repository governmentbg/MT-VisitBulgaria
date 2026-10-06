import type { Endpoint, PayloadRequest } from 'payload'
import { isAdmin } from '@/access/accessHelpers'
import { createClient } from 'redis'

export const purgeRedisCacheEndpoint: Endpoint = {
  path: '/purge-redis-cache',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!isAdmin(req.user)) {
      return Response.json(
        { errors: [{ message: 'Unauthorized — admin access required' }] },
        { status: 403 },
      )
    }

    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) {
      return Response.json(
        { errors: [{ message: 'REDIS_URL is not configured' }] },
        { status: 500 },
      )
    }

    let client
    try {
      const settings: { url: string; password?: string } = { url: redisUrl }
      if (process.env.REDIS_ACCESS_KEY) {
        settings.password = process.env.REDIS_ACCESS_KEY
      }

      client = createClient(settings)
      await client.connect()

      // Count keys with the nextjs: prefix before purging
      const keys = await client.keys('nextjs:*')
      const keyCount = keys.length

      // Delete only Next.js cache keys
      if (keyCount > 0) {
        await client.del(keys)
      }

      req.payload.logger.info(`Redis cache purged: ${keyCount} keys removed`)

      return Response.json({
        success: true,
        keysRemoved: keyCount,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      req.payload.logger.error(`Redis cache purge failed: ${message}`)
      return Response.json(
        { errors: [{ message: `Failed to purge Redis cache: ${message}` }] },
        { status: 500 },
      )
    } finally {
      if (client) {
        await client.disconnect().catch(() => {})
      }
    }
  },
}
