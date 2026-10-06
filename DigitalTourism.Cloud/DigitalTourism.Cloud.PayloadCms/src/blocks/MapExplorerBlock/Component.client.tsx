'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import type { StaticMapClientProps } from '@/components/MapExplorer/StaticMap/StaticMapClient'
import { HEIGHT_CLASSES } from '@/components/MapExplorer/StaticMap/heights'
import { EmbeddedMap } from '@/components/MapExplorer/EmbeddedMap/EmbeddedMap'
import { cn } from '@/components/ui/theme/cn'

const StaticMap = dynamic(
  () =>
    import('@/components/MapExplorer/StaticMap/StaticMapClient').then((m) => ({
      default: m.StaticMapClient,
    })),
  { ssr: false },
)

export function StaticMapBlockClient(props: StaticMapClientProps) {
  const t = useTranslations('mapExplorer')

  return (
    <EmbeddedMap
      className={cn(
        'relative w-full animate-pulse bg-grey-100',
        HEIGHT_CLASSES[props.height],
        '[&:has(.leaflet-container)]:animate-none [&:has(.leaflet-container)]:bg-transparent',
      )}
      viewLabel={t('viewMap')}
      closeLabel={t('closeMap')}
    >
      {({ interactive }) => <StaticMap {...props} interactive={interactive} />}
    </EmbeddedMap>
  )
}
