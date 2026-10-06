import type { Block } from 'payload'

import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels } from '@/i18n/admin'

/**
 * Dummy Archive block to prevent "Cannot read properties of undefined (reading 'blockReferences')"
 * errors caused by stale archive block data in the database.
 * This block was removed but existing pages still reference it in their richtext content.
 */
export const ArchiveBlock: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  labels: {
    singular: 'Archive (deprecated)',
    plural: 'Archives (deprecated)',
  },
  imageURL: blockImageUrls.archive,
  imageAltText: 'Archive (deprecated)',
  admin: {
    group: blockGroupLabels.deprecated,
    custom: {
      deprecated: true,
    },
    components: {
      Block: '@/blocks/ArchiveBlock/admin/ArchivePreview#ArchivePreview',
    },
  },
  fields: [],
}
