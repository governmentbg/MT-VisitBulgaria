'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const QuestionBar: React.FC = () => (
  <div
    style={{
      border: '1px solid var(--theme-elevation-200)',
      borderRadius: '4px',
      padding: '8px',
    }}
  >
    <SkeletonLine width="60%" />
  </div>
)

export const FaqAccordionPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const items = (getDataByPath('items') as unknown[]) || []
  const count = Math.max(1, Math.min(5, items.length || 3))

  return (
    <BlockPreviewShell blockSlug="faqAccordion">
      <SkeletonWrapper>
        {Array.from({ length: count }).map((_, i) => (
          <QuestionBar key={i} />
        ))}
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
