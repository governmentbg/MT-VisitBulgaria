'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonCard,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

export const FeaturedEventsPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const sideEventCount = (getDataByPath('sideEventCount') as number) || 2

  return (
    <BlockPreviewShell blockSlug="featuredEvents">
      <SkeletonWrapper>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 2 }}>
            <SkeletonCard style={{ height: '120px' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Array.from({ length: sideEventCount }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
