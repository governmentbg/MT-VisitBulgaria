'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonImage,
  SkeletonIcon,
  SkeletonLabel,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'
import { MapPin } from 'lucide-react'

const heightMap: Record<string, string> = {
  sm: '60px',
  md: '80px',
  lg: '100px',
}

export const MapExplorerPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const mode = (getDataByPath('mode') as string) || 'nearby'
  const mapHeight = (getDataByPath('mapHeight') as string) || 'md'
  const height = heightMap[mapHeight] || '80px'
  const label = mode === 'region' ? 'Region' : 'Nearby'

  return (
    <BlockPreviewShell blockSlug="mapExplorer">
      <SkeletonWrapper>
        <SkeletonImage height={height}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <SkeletonIcon Icon={MapPin} size={48} />
            <SkeletonLabel text={label} />
          </div>
        </SkeletonImage>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
