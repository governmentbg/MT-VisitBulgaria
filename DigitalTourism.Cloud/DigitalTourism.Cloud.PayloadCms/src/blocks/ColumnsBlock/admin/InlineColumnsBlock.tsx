'use client'

import React, { useMemo } from 'react'

import {
  useBlockComponentContext,
  BlockEditButton,
  BlockRemoveButton,
  useEditorConfigContext,
} from '@payloadcms/richtext-lexical/client'
import { Pill, RenderFields, useWatchForm } from '@payloadcms/ui'
import { blockIconMap } from '@/features/expandedBlocks/client/blockIcons'

const COLUMN_NAMES = ['column1', 'column2', 'column3', 'column4']

/**
 * Custom Lexical block component that renders only the column richText
 * editors inline in a CSS grid. Settings (columnCount etc.) stay in the drawer.
 */
export const InlineColumnsBlock: React.FC = () => {
  const { formSchema, BlockCollapsible } = useBlockComponentContext()
  const { editor } = useEditorConfigContext()
  const { getDataByPath } = useWatchForm()

  const columnCount = Number(getDataByPath('columnCount') || 2)
  const ColumnsIcon = blockIconMap.columns

  // Pick only the column fields that should be visible
  const columnFields = useMemo(
    () =>
      formSchema.filter(
        (f) => 'name' in f && COLUMN_NAMES.indexOf(f.name) !== -1 && COLUMN_NAMES.indexOf(f.name) < columnCount,
      ),
    [formSchema, columnCount],
  )

  return (
    <BlockCollapsible
      collapsibleProps={{
        isCollapsed: false,
        disableHeaderToggle: true,
        disableToggleIndicator: true,
      }}
      Pill={
        <Pill pillStyle="white" size="small">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ColumnsIcon size={14} strokeWidth={2} />
            Columns
          </span>
        </Pill>
      }
      Actions={
        <>
          <BlockEditButton />
          <BlockRemoveButton />
        </>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: '1rem',
        }}
      >
        {columnFields.map((field) => (
          <div key={'name' in field ? field.name : undefined} style={{ minWidth: 0 }}>
            <RenderFields
              fields={[field]}
              forceRender
              parentIndexPath=""
              parentPath=""
              parentSchemaPath=""
              permissions={true}
              readOnly={!editor?.isEditable()}
            />
          </div>
        ))}
      </div>
    </BlockCollapsible>
  )
}
