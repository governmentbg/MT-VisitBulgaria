'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonButton,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'

export const EventSearchPreview: React.FC = () => (
  <BlockPreviewShell blockSlug="eventSearch">
    <SkeletonWrapper>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <SkeletonLine height="24px" width="25%" />
        <SkeletonLine height="24px" width="25%" />
        <SkeletonLine height="24px" width="25%" />
        <SkeletonButton width="60px" />
      </div>
    </SkeletonWrapper>
  </BlockPreviewShell>
)
