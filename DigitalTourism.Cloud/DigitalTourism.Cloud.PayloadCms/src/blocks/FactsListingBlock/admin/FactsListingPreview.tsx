'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonImage,
  SkeletonLine,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const FactItem: React.FC = () => (
  <div
    style={{
      borderLeft: '3px solid var(--theme-elevation-200)',
      paddingLeft: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}
  >
    <SkeletonLine width="60%" height="10px" />
    <SkeletonLine width="90%" height="8px" />
    <SkeletonLine width="30%" height="8px" />
  </div>
)

export const FactsListingPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const imagePosition = (getDataByPath('imagePosition') as string) || 'left'
  const showWeather = (getDataByPath('showWeather') as boolean) || false
  const items = (getDataByPath('items') as unknown[]) || []
  const factCount = items.length || 3

  const imageBlock = (
    <div style={{ flex: 1, position: 'relative' }}>
      <SkeletonImage height="160px" />
      {showWeather && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'var(--theme-elevation-150)',
            borderRadius: '4px',
            padding: '6px 8px',
            width: '80px',
          }}
        >
          <SkeletonLine width="100%" height="8px" />
        </div>
      )}
    </div>
  )

  const factsBlock = (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: factCount }).map((_, i) => (
        <FactItem key={i} />
      ))}
    </div>
  )

  return (
    <BlockPreviewShell blockSlug="factsListing">
      <SkeletonWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
          <SkeletonLine width="50%" height="12px" />
          <SkeletonLine width="35%" height="8px" />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {imagePosition === 'right' ? (
            <>
              {factsBlock}
              {imageBlock}
            </>
          ) : (
            <>
              {imageBlock}
              {factsBlock}
            </>
          )}
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
