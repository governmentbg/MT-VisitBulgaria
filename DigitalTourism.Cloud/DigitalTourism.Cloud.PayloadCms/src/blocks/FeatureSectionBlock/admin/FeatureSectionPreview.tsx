'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import { SkeletonWrapper, SkeletonLine, SkeletonImage, SkeletonButton } from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

export const FeatureSectionPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const imagePosition = (getDataByPath('imagePosition') as string) || 'left'

  const imageColumn = (
    <div style={{ flex: 1 }}>
      <SkeletonImage height="70px" />
    </div>
  )

  const textColumn = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <SkeletonLine width="60%" />
      <SkeletonLine width="100%" />
      <SkeletonLine width="80%" />
      <SkeletonButton />
    </div>
  )

  return (
    <BlockPreviewShell blockSlug="featureSection">
      <SkeletonWrapper>
        <div style={{ display: 'flex', gap: '16px' }}>
          {imagePosition === 'right' ? (
            <>
              {textColumn}
              {imageColumn}
            </>
          ) : (
            <>
              {imageColumn}
              {textColumn}
            </>
          )}
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
