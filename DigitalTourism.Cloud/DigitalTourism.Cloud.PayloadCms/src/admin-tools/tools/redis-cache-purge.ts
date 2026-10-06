import { RedisCachePurgeTool } from '@/components/admin/RedisCachePurgeTool'
import { registerAdminTool } from '../registry'

registerAdminTool({
  id: 'redis-cache-purge',
  label: 'Purge Redis Cache',
  description: 'Remove all Next.js cache entries from Redis, forcing pages to re-render on next request.',
  Component: RedisCachePurgeTool,
  order: 5,
})
