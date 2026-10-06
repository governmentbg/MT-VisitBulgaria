'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import { SkeletonWrapper, SkeletonLine } from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const styleColors: Record<string, string> = {
  info: '#3b82f6',
  warning: '#f59e0b',
  error: '#ef4444',
  success: '#22c55e',
}

export const BannerPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const style = (getDataByPath('style') as string) || 'info'

  const borderColor = styleColors[style] || 'var(--theme-elevation-300)'

  return (
    <BlockPreviewShell blockSlug="banner">
      <SkeletonWrapper>
        <div
          style={{
            borderLeft: `3px solid ${borderColor}`,
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <SkeletonLine width="60%" />
          <SkeletonLine width="40%" />
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
