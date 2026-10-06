'use client'

import type { LexicalBlockClientProps } from '@payloadcms/richtext-lexical'
import {
  BlockEditButton,
  BlockRemoveButton,
  useBlockComponentContext,
} from '@payloadcms/richtext-lexical/client'
import { Pill, useFormFields } from '@payloadcms/ui'
import React from 'react'
import { blockIconMap, defaultBlockIcon } from '../blockIcons'
import { blockDisplayNames } from './BlockPreviewShell'

/**
 * Custom Block component that renders a non-collapsible header with Edit + Remove buttons.
 * Shows a Lucide icon + block name in the header.
 */
export const ExpandedBlock: React.FC<LexicalBlockClientProps> = () => {
  const { BlockCollapsible } = useBlockComponentContext()
  const blockTypeField = useFormFields(([fields]) => fields?.blockType)
  const blockType = (blockTypeField?.value as string) || ''

  const Icon = blockIconMap[blockType] || defaultBlockIcon
  const displayName = blockDisplayNames[blockType] || blockType

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
            <Icon size={14} strokeWidth={2} />
            {displayName}
          </span>
        </Pill>
      }
      Actions={
        <>
          <BlockEditButton />
          <BlockRemoveButton />
        </>
      }
    />
  )
}
