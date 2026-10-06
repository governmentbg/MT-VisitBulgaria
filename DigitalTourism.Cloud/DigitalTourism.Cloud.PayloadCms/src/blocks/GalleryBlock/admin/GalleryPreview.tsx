'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import { SkeletonWrapper, SkeletonLine, SkeletonGrid, SkeletonImage, SkeletonLabel } from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

export const GalleryPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const layout = (getDataByPath('layout') as string) || 'masonry'
  const columns = (getDataByPath('columns') as number) || 3

  const label = layout === 'horizontal' ? 'Horizontal' : 'Masonry'

  return (
    <BlockPreviewShell blockSlug="masonryGallery">
      <SkeletonWrapper>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SkeletonLine width="30%" />
          <SkeletonLabel text={label} />
        </div>
        <SkeletonGrid columns={columns} count={columns}>
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonImage key={i} height="50px" />
          ))}
        </SkeletonGrid>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
