'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonGrid,
  SkeletonLine,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const IconCard: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '10px',
      border: '1px solid var(--theme-elevation-200)',
      borderRadius: '6px',
    }}
  >
    <div
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'var(--theme-elevation-200)',
      }}
    />
    <SkeletonLine width="60%" />
    <SkeletonLine width="80%" height="8px" />
  </div>
)

export const IconCardsPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const columns = (getDataByPath('columns') as number) || 3
  const items = (getDataByPath('items') as unknown[]) || []
  const count = items.length || columns

  return (
    <BlockPreviewShell blockSlug="iconCards">
      <SkeletonWrapper>
        <SkeletonGrid columns={columns} count={count}>
          {Array.from({ length: count }).map((_, i) => (
            <IconCard key={i} />
          ))}
        </SkeletonGrid>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
