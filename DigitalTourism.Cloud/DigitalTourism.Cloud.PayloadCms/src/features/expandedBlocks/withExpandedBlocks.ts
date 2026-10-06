import type { Block } from 'payload'

const DEFAULT_BLOCK_COMPONENT =
  '@/features/expandedBlocks/client/components/ExpandedBlock#ExpandedBlock'

/**
 * Wraps an array of block configs to inject block preview components.
 * By default uses the ExpandedBlock component (non-collapsible with Edit + Remove buttons).
 * Pass an overrides map to use custom skeleton preview components for specific blocks.
 */
export function withExpandedBlocks(
  blocks: Block[],
  overrides?: Record<string, string>,
): Block[] {
  return blocks.map((block) => ({
    ...block,
    admin: {
      ...block.admin,
      components: {
        ...block.admin?.components,
        Block: overrides?.[block.slug] ?? DEFAULT_BLOCK_COMPONENT,
      },
    },
  }))
}
