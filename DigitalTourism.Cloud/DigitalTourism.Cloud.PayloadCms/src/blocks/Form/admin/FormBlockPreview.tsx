'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonButton,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'

export const FormBlockPreview: React.FC = () => (
  <BlockPreviewShell blockSlug="formBlock">
    <SkeletonWrapper>
      <SkeletonLine height="24px" />
      <SkeletonLine height="24px" />
      <SkeletonButton width="80px" />
    </SkeletonWrapper>
  </BlockPreviewShell>
)
