'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonImage,
  SkeletonButton,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

export const FeatureHighlightPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const imagePosition = (getDataByPath('imagePosition') as string) || 'left'
  const showBackground = getDataByPath('showBackground') as boolean

  const imageColumn = (
    <div style={{ flex: 1 }}>
      <SkeletonImage
        height="120px"
        style={
          showBackground !== false
            ? { marginTop: '-10px', marginBottom: '-10px', height: '140px' }
            : undefined
        }
      />
    </div>
  )

  const textColumn = (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        justifyContent: 'center',
      }}
    >
      <SkeletonLine width="60%" height="14px" />
      <SkeletonLine width="100%" height="8px" />
      <SkeletonLine width="90%" height="8px" />
      <SkeletonLine width="75%" height="8px" />
      <SkeletonButton width="72px" />
    </div>
  )

  const content = (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
  )

  return (
    <BlockPreviewShell blockSlug="featureHighlight">
      <SkeletonWrapper>
        {showBackground !== false ? (
          <div
            style={{
              backgroundColor: 'var(--theme-elevation-100)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}
          >
            {content}
          </div>
        ) : (
          content
        )}
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
