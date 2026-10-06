'use client'
import React from 'react'
import { BlockPreviewShell } from '@/features/expandedBlocks/client/components/BlockPreviewShell'
import { SkeletonWrapper, SkeletonLabel } from '@/features/expandedBlocks/client/components/BlockSkeleton'
import { useWatchForm } from '@payloadcms/ui'

export const SpacerPreview: React.FC = () => {
  const { getDataByPath } = useWatchForm()
  const height = (getDataByPath('height') as string) || ''

  const label = height ? `Spacer (${height})` : 'Spacer'

  return (
    <BlockPreviewShell blockSlug="spacerBlock">
      <SkeletonWrapper>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '2px dashed var(--theme-elevation-200)',
            paddingTop: '6px',
          }}
        >
          <SkeletonLabel text={label} />
        </div>
      </SkeletonWrapper>
    </BlockPreviewShell>
  )
}
