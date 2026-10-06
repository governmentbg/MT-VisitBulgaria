import React from 'react'
import { FieldDiffContainer, getHTMLDiffComponents } from '@payloadcms/ui/rsc'
import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'
import type { RichTextFieldDiffServerComponent } from 'payload'
import type { HTMLConvertersFunctionAsync } from '@payloadcms/richtext-lexical/html-async'
import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

type BlockNode = {
  type: 'block' | 'inlineBlock'
  fields: Record<string, unknown> & { blockType: string; blockName?: string }
  [key: string]: unknown
}

/**
 * Flatten block fields into key-value pairs, skipping internal keys.
 */
function flattenFields(
  obj: Record<string, unknown>,
  prefix = '',
): Array<{ key: string; value: string }> {
  const result: Array<{ key: string; value: string }> = []
  const skipKeys = new Set(['id', 'blockType', 'blockName'])

  for (const [key, val] of Object.entries(obj)) {
    if (skipKeys.has(key)) continue
    const path = prefix ? `${prefix}.${key}` : key

    if (val === null || val === undefined || val === '') continue

    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        const item = val[i]
        if (typeof item === 'object' && item !== null) {
          result.push(...flattenFields(item as Record<string, unknown>, `${path}[${i}]`))
        } else {
          result.push({ key: `${path}[${i}]`, value: String(item) })
        }
      }
    } else if (typeof val === 'object') {
      const record = val as Record<string, unknown>
      if ('filename' in record) {
        result.push({ key: path, value: String(record.filename) })
      } else if ('title' in record) {
        result.push({ key: path, value: String(record.title) })
      } else if ('id' in record && Object.keys(record).length <= 3) {
        result.push({ key: path, value: `#${record.id}` })
      } else {
        result.push(...flattenFields(record, path))
      }
    } else {
      result.push({ key: path, value: String(val) })
    }
  }

  return result
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Extract all block nodes from a lexical tree in order.
 */
function extractBlocks(data: SerializedEditorState | null | undefined): BlockNode[] {
  if (!data?.root?.children) return []
  const blocks: BlockNode[] = []
  for (const node of data.root.children as Array<SerializedLexicalNode & { type: string; fields?: Record<string, unknown> }>) {
    if ((node.type === 'block' || node.type === 'inlineBlock') && node.fields) {
      blocks.push(node as unknown as BlockNode)
    }
  }
  return blocks
}

/**
 * Compute which fields differ between two block field objects.
 * Returns only the changed key-value pairs (from the target side).
 */
function getChangedFields(
  fromFields: Record<string, unknown>,
  toFields: Record<string, unknown>,
): Array<{ key: string; value: string }> {
  const fromFlat = flattenFields(fromFields)
  const toFlat = flattenFields(toFields)

  const fromMap = new Map(fromFlat.map(({ key, value }) => [key, value]))
  const toMap = new Map(toFlat.map(({ key, value }) => [key, value]))

  const changed: Array<{ key: string; value: string }> = []

  // Fields that changed or were added
  for (const { key, value } of toFlat) {
    if (fromMap.get(key) !== value) {
      changed.push({ key, value })
    }
  }

  // Fields that were removed
  for (const { key } of fromFlat) {
    if (!toMap.has(key)) {
      changed.push({ key, value: '(removed)' })
    }
  }

  return changed
}

/**
 * Render a block as compact HTML (just the label) for unchanged blocks.
 */
function blockLabelHTML(node: BlockNode): string {
  const label = node.fields.blockName || node.fields.blockType
  return (
    `<div class="lexical-unknown-diff" data-enable-match="true">` +
    `<span class="lexical-unknown-diff__specifier">${escapeHtml(label)} </span>` +
    `<span>Block</span>` +
    `</div>`
  )
}

/**
 * Render a block with its changed fields for the diff view.
 */
function blockDiffHTML(node: BlockNode, changedFields: Array<{ key: string; value: string }>): string {
  const label = node.fields.blockName || node.fields.blockType

  const fieldRows = changedFields
    .map(
      ({ key, value }) =>
        `<div style="padding:1px 0;"><span class="lexical-unknown-diff__specifier" style="opacity:0.6;">${escapeHtml(key)}:</span> ${escapeHtml(value)}</div>`,
    )
    .join('')

  return [
    `<div class="lexical-unknown-diff" data-enable-match="true" style="flex-direction:column;align-items:flex-start;max-height:none;">`,
    `<div><span class="lexical-unknown-diff__specifier">${escapeHtml(label)} </span><span>Block</span></div>`,
    fieldRows,
    `</div>`,
  ].join('')
}

/**
 * Custom LexicalDiffComponent that only shows block field details
 * for blocks that actually changed between versions.
 */
export const LexicalBlockDiffComponent: RichTextFieldDiffServerComponent = async (args) => {
  const {
    comparisonValue: valueFrom,
    field,
    i18n,
    locale,
    nestingLevel,
    versionValue: valueTo,
  } = args

  const fromData = valueFrom as SerializedEditorState | null
  const toData = valueTo as SerializedEditorState | null

  // Pre-compute which blocks changed by matching them by position
  const fromBlocks = extractBlocks(fromData)
  const toBlocks = extractBlocks(toData)

  // Build a set of block indices that have changes (keyed by position + side)
  // We match blocks by their position index — same approach Payload uses
  const changedBlocksFrom = new Map<number, Array<{ key: string; value: string }>>()
  const changedBlocksTo = new Map<number, Array<{ key: string; value: string }>>()

  const maxLen = Math.max(fromBlocks.length, toBlocks.length)
  for (let i = 0; i < maxLen; i++) {
    const fromBlock = fromBlocks[i]
    const toBlock = toBlocks[i]

    if (!fromBlock || !toBlock) {
      // Block was added or removed — show full details
      if (fromBlock) {
        changedBlocksFrom.set(i, flattenFields(fromBlock.fields))
      }
      if (toBlock) {
        changedBlocksTo.set(i, flattenFields(toBlock.fields))
      }
    } else if (JSON.stringify(fromBlock.fields) !== JSON.stringify(toBlock.fields)) {
      // Block changed — compute diff for each side
      const changedFrom = getChangedFields(toBlock.fields, fromBlock.fields)
      const changedTo = getChangedFields(fromBlock.fields, toBlock.fields)
      changedBlocksFrom.set(i, changedFrom)
      changedBlocksTo.set(i, changedTo)
    }
  }

  // Create converter factories, one for each side
  function makeConverters(changedBlocks: Map<number, Array<{ key: string; value: string }>>): HTMLConvertersFunctionAsync {
    let blockIndex = -1
    return ({ defaultConverters }) => ({
      ...defaultConverters,
      unknown: async ({ node }: { node: Record<string, unknown> }) => {
        const typedNode = node as { type: string; fields?: Record<string, unknown> & { blockType?: string } }
        if (
          (typedNode.type === 'block' || typedNode.type === 'inlineBlock') &&
          typedNode.fields?.blockType
        ) {
          blockIndex++
          const blockNode = typedNode as unknown as BlockNode
          const changed = changedBlocks.get(blockIndex)

          if (!changed) {
            // Unchanged block — compact label only
            return blockLabelHTML(blockNode)
          }
          // Changed block — show the differing fields
          return blockDiffHTML(blockNode, changed)
        }
        // Fallback for truly unknown nodes
        const { createHash } = await import('crypto')
        const hash = createHash('sha256')
          .update(JSON.stringify(node ?? {}))
          .digest('hex')
          .slice(0, 8)
        return `<div data-enable-match="true" data-fields-hash="${hash}"><span>${escapeHtml(typedNode.type)}</span></div>`
      },
    })
  }

  const fromHTML = await convertLexicalToHTMLAsync({
    converters: makeConverters(changedBlocksFrom),
    data: fromData as SerializedEditorState,
    disableContainer: true,
  })

  const toHTML = await convertLexicalToHTMLAsync({
    converters: makeConverters(changedBlocksTo),
    data: toData as SerializedEditorState,
    disableContainer: true,
  })

  const { From, To } = getHTMLDiffComponents({
    fromHTML: fromHTML?.length ? fromHTML : '<p></p>',
    toHTML: toHTML?.length ? toHTML : '<p></p>',
  })

  return (
    <FieldDiffContainer
      className="lexical-diff"
      From={From}
      i18n={i18n}
      label={{ label: field.label, locale }}
      nestingLevel={nestingLevel}
      To={To}
    />
  )
}
