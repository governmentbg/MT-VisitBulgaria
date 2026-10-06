'use client'

import { useRowLabel } from '@payloadcms/ui'

export const VideoRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{data?.title || `Video ${(rowNumber ?? 0) + 1}`}</span>
}

export const BrochureRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{data?.title || `Brochure ${(rowNumber ?? 0) + 1}`}</span>
}
