'use client'

import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import {
  SkeletonWrapper,
  SkeletonLine,
  SkeletonImage,
} from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const StatCell: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '10px',
    }}
  >
    <SkeletonLine width="50%" height="18px" />
    <SkeletonLine width="70%" height="8px" />
  </div>
)

const CounterCard: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 8px',
      backgroundColor: 'var(--theme-elevation-100)',
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
    <SkeletonLine width="50%" height="18px" />
    <SkeletonLine width="70%" height="8px" />
  </div>
)

export const StatsPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const displayMode = (getDataByPath('displayMode') as string) || 'grid'
  const columns = (getDataByPath('columns') as number) || 2

  return (
    <BlockPreviewShell blockSlug="stats">
      <SkeletonWrapper>
        {displayMode === 'panel' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: '0 0 50%' }}>
              <SkeletonImage height="140px" />
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <SkeletonLine width="70%" height="14px" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <SkeletonLine width="60%" height="16px" />
                    <SkeletonLine width="80%" height="8px" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {displayMode === 'grid' && (
          <>
            <SkeletonLine width="40%" height="12px" style={{ margin: '0 auto' }} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '0',
              }}
            >
              {Array.from({ length: columns * 2 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    borderRight:
                      (i + 1) % columns !== 0
                        ? '1px solid var(--theme-elevation-200)'
                        : undefined,
                    borderBottom:
                      i < columns
                        ? '1px solid var(--theme-elevation-200)'
                        : undefined,
                  }}
                >
                  <StatCell />
                </div>
              ))}
            </div>
          </>
        )}

        {displayMode === 'counters' && (
          <>
            <SkeletonLine width="40%" height="12px" style={{ margin: '0 auto' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <CounterCard key={i} />
              ))}
            </div>
          </>
        )}

        {displayMode === 'inline' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    style={{
                      width: '1px',
                      height: '28px',
                      backgroundColor: 'var(--theme-elevation-200)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    justifyContent: 'center',
                  }}
                >
                  <SkeletonLine width="40%" height="14px" />
                  <SkeletonLine width="50%" height="8px" />
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
