'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonImage,
  SkeletonLine,
  SkeletonButton,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const heightMap: Record<string, string> = {
  sm: '60px',
  md: '80px',
  lg: '100px',
}

export const FullWidthCtaPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const textAlignment = (getDataByPath('textAlignment') as string) || 'center'
  const minHeight = (getDataByPath('minHeight') as string) || 'md'
  const height = heightMap[minHeight] || '80px'

  return (
    <BlockPreviewShell blockSlug="fullWidthCta">
      <SkeletonImage
        height={height}
        style={{
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: textAlignment === 'left' ? 'flex-start' : 'center',
            gap: '8px',
          }}
        >
          <SkeletonLine width="40%" height="10px" />
          <SkeletonButton />
        </div>
      </SkeletonImage>
    </BlockPreviewShell>
  )
}
