'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonGrid,
  SkeletonCard,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

export const LearnMorePreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const items = (getDataByPath('items') as unknown[]) || []
  const count = items.length || 3

  return (
    <BlockPreviewShell blockSlug="learnMore">
      <SkeletonWrapper>
        <SkeletonLine width="30%" />
        <SkeletonGrid columns={3} count={count}>
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </SkeletonGrid>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
