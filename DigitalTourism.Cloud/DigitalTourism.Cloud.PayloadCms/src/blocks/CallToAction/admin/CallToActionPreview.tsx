'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonButton,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'

export const CallToActionPreview: React.FC = () => (
  <BlockPreviewShell blockSlug="cta">
    <SkeletonWrapper>
      <SkeletonLine width="50%" />
      <SkeletonLine width="70%" />
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </SkeletonWrapper>
  </BlockPreviewShell>
)
