'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import { SkeletonWrapper, SkeletonLine, SkeletonImage, SkeletonIcon } from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'
import { Image, Video } from 'lucide-react'

export const MediaBlockPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const mediaType = (getDataByPath('mediaType') as string) || 'image'
  const layout = (getDataByPath('layout') as string) || 'imgFullSize'

  const isHalf = layout === 'imgHalf'
  const MediaIcon = mediaType === 'video' ? Video : Image

  return (
    <BlockPreviewShell blockSlug="mediaBlock">
      <SkeletonWrapper>
        <SkeletonImage width={isHalf ? '50%' : '100%'} height="80px">
          <SkeletonIcon Icon={MediaIcon} />
        </SkeletonImage>
        <SkeletonLine width="40%" />
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
