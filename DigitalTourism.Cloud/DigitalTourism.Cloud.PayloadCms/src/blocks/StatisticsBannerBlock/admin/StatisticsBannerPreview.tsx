'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const StatBox: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '10px',
    }}
  >
    <SkeletonLine width="40%" height="16px" />
    <SkeletonLine width="60%" height="8px" />
  </div>
)

const bgColorMap: Record<string, string> = {
  dark: 'var(--theme-elevation-100)',
  primary: 'var(--theme-elevation-50)',
  'primary-dark': 'var(--theme-elevation-150)',
}

export const StatisticsBannerPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const items = (getDataByPath('items') as unknown[]) || []
  const backgroundColor = (getDataByPath('backgroundColor') as string) || 'dark'
  const count = items.length || 3

  return (
    <BlockPreviewShell blockSlug="statisticsBanner">
      <SkeletonWrapper>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: bgColorMap[backgroundColor] || bgColorMap.dark,
            borderRadius: '6px',
            padding: '4px',
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <StatBox key={i} />
          ))}
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
