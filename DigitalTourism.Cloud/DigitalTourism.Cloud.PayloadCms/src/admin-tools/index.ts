// Side-effect imports trigger registration
import './tools/typesense-reindex'
import './tools/media-avif-migration'
import './tools/redis-cache-purge'

export { getAdminTools } from './registry'
export type { AdminTool } from './types'
