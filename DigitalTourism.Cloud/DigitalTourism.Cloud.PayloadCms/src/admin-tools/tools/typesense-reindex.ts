import { ReindexTool } from '@/plugins/typesense/ui/ReindexTool'
import { registerAdminTool } from '../registry'

registerAdminTool({
  id: 'typesense-reindex',
  label: 'Typesense Search Index',
  description: 'Reindex (drop + recreate schema) or resync (upsert only) all Typesense search collections.',
  Component: ReindexTool,
  order: 3,
})
