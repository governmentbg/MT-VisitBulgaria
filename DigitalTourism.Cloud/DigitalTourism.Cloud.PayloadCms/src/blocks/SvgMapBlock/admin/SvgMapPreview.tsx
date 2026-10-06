'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonImage,
  SkeletonIcon,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { Map } from 'lucide-react'
import { useWatchForm } from '@payloadcms/ui'

export const SvgMapPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const regions = (getDataByPath('regions') as unknown[]) || []
  const regionCount = regions.length

  return (
    <BlockPreviewShell blockSlug="svgMap">
      <SkeletonWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '8px',
          }}
        >
          <SkeletonLine width="45%" height="12px" />
          <SkeletonLine width="30%" height="8px" />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Left side: gallery + region info card */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '6px',
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonImage key={i} height="45px" />
              ))}
            </div>
            <div
              style={{
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '6px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <SkeletonLine width="60%" height="10px" />
              <SkeletonLine width="85%" height="8px" />
              <SkeletonLine width="40%" height="8px" />
            </div>
          </div>

          {/* Right side: map placeholder */}
          <div style={{ flex: 2 }}>
            <SkeletonImage height="160px">
              <SkeletonIcon Icon={Map} size={48} />
            </SkeletonImage>
          </div>
        </div>

        {regionCount > 0 && (
          <div
            style={{
              marginTop: '6px',
              fontSize: '10px',
              color: 'var(--theme-elevation-400)',
              textAlign: 'right',
            }}
          >
            Regions: {regionCount}
          </div>
        )}
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
