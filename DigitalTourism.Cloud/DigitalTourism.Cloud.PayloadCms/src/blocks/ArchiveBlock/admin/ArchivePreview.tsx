'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLabel,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'

export const ArchivePreview: React.FC = () => (
  <BlockPreviewShell blockSlug="archive">
    <SkeletonWrapper>
      <SkeletonLabel text="This block is deprecated" />
    </SkeletonWrapper>
  </BlockPreviewShell>
)
