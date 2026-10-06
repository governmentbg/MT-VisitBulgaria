'use client'

import dynamic from 'next/dynamic'
import type { MapExplorerProps } from '@/components/MapExplorer/MapExplorer'

const MapExplorer = dynamic(
  () => import('@/components/MapExplorer/MapExplorer').then((m) => ({ default: m.MapExplorer })),
  { ssr: false },
)

export function MapPageClient(
  props: Pick<MapExplorerProps, 'locale' | 'nomenclatureMap' | 'zoomThreshold' | 'facetConfig'>,
) {
  return <MapExplorer {...props} />
}
