'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import { SkeletonWrapper, SkeletonLine } from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

const sizeToFlex: Record<string, number> = {
  oneThird: 1,
  half: 3,
  twoThirds: 2,
  full: 1,
}

export const ContentPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const columns = (getDataByPath('columns') as Array<{ size?: string }>) || []

  const hasColumns = columns.length > 0

  return (
    <BlockPreviewShell blockSlug="content">
      <SkeletonWrapper>
        <div style={{ display: 'flex', gap: '16px' }}>
          {hasColumns ? (
            columns.map((col, i) => {
              const size = col?.size || 'full'
              const flex = sizeToFlex[size] ?? 1
              return (
                <div
                  key={i}
                  style={{ flex, display: 'flex', flexDirection: 'column', gap: '6px' }}
                >
                  <SkeletonLine width="100%" />
                  <SkeletonLine width="80%" />
                  <SkeletonLine width="60%" />
                </div>
              )
            })
          ) : (
            <>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <SkeletonLine width="100%" />
                <SkeletonLine width="80%" />
                <SkeletonLine width="60%" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <SkeletonLine width="100%" />
                <SkeletonLine width="70%" />
              </div>
            </>
          )}
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
