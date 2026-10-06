import { MediaMigrationTool } from '@/components/admin/MediaMigrationTool'
import { registerAdminTool } from '../registry'

registerAdminTool({
  id: 'media-avif-migration',
  label: 'Media AVIF Migration',
  description: 'Regenerate all image sizes using AVIF format for smaller file sizes.',
  Component: MediaMigrationTool,
  order: 4,
})
