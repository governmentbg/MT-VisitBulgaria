'use client'

import { useRowLabel } from '@payloadcms/ui'

export const RowLabel = () => {
  const { data } = useRowLabel<{ label?: string }>()

  return <span>{data?.label || 'Menu Item'}</span>
}
