'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonImage,
  SkeletonLabel,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

/** Page card with full-bleed image + category pill + title overlay */
const PageCard: React.FC<{ height?: string }> = ({ height = '80px' }) => (
  <div
    style={{
      borderRadius: '6px',
      overflow: 'hidden',
      position: 'relative',
      flex: 1,
    }}
  >
    <SkeletonImage height={height} style={{ borderRadius: 0 }} />
    <div style={{ position: 'absolute', top: '6px', left: '6px' }}>
      <div
        style={{
          width: '36px',
          height: '14px',
          backgroundColor: 'var(--theme-elevation-150)',
          borderRadius: '8px',
        }}
      />
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        right: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
      }}
    >
      <SkeletonLine width="60%" height="10px" />
      <SkeletonLine width="40%" height="7px" />
    </div>
  </div>
)

export const PagesBlockPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const displayMode = (getDataByPath('displayMode') as string) || 'carousel'

  return (
    <BlockPreviewShell blockSlug="pagesBlock">
      <SkeletonWrapper>
        <SkeletonLine width="30%" height="12px" />

        {/* Carousel: heading + horizontal row of cards with arrows */}
        {displayMode === 'carousel' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '16px', color: 'var(--theme-elevation-300)' }}>&larr;</span>
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <PageCard height="90px" />
              <PageCard height="90px" />
              <PageCard height="90px" />
            </div>
            <span style={{ fontSize: '16px', color: 'var(--theme-elevation-300)' }}>&rarr;</span>
          </div>
        )}

        {/* Masonry: 1 large card left + 2 stacked cards right (asymmetric) */}
        {displayMode === 'masonry' && (
          <div style={{ display: 'flex', gap: '8px', minHeight: '120px' }}>
            <div style={{ flex: 1, display: 'flex' }}>
              <PageCard height="120px" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <PageCard height="56px" />
              <PageCard height="56px" />
            </div>
          </div>
        )}

        {/* Organizer: heading area + description + linked page cards */}
        {displayMode === 'organizer' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <SkeletonLine width="70%" height="14px" />
              <SkeletonLine width="100%" height="7px" />
              <SkeletonLine width="85%" height="7px" />
              <SkeletonLine width="40%" height="8px" style={{ marginTop: '4px' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <PageCard height="50px" />
              <PageCard height="50px" />
              <PageCard height="50px" />
            </div>
          </div>
        )}

        <SkeletonLabel text={displayMode} />
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
