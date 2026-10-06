'use client'

import { useCallback } from 'react'
import { useMap } from 'react-leaflet'
import { MapObjectCardExpanded } from '@/components/ui'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'
import type { MapExplorerPOI } from '../types'

interface MarkerPopupProps {
  poi: MapExplorerPOI
  viewMoreLabel?: string
  directionsLabel?: string
}

export function MarkerPopup({ poi, viewMoreLabel = 'View more', directionsLabel = 'Get Directions' }: MarkerPopupProps) {
  const map = useMap()

  const handleClose = useCallback(() => {
    map.closePopup()
  }, [map])

  const ctaHref = buildExperienceUrl(poi.type, poi.slug)
  const category = poi.categories?.[0]

  return (
    <MapObjectCardExpanded
      variant="popup"
      image={poi.heroImageUrl || ''}
      title={poi.title}
      category={category}
      onClose={handleClose}
      ctaLabel={viewMoreLabel}
      ctaHref={ctaHref}
      directionsLabel={directionsLabel}
      coordinates={poi.location}
      className="shadow-none"
    />
  )
}
