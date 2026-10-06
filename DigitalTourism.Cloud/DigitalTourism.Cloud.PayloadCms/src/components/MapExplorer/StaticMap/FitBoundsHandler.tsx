'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

interface FitBoundsHandlerProps {
  bounds: {
    northEast: { lat: number; lng: number }
    southWest: { lat: number; lng: number }
  }
}

export function FitBoundsHandler({ bounds }: FitBoundsHandlerProps) {
  const map = useMap()

  useEffect(() => {
    const leafletBounds = L.latLngBounds(
      [bounds.southWest.lat, bounds.southWest.lng],
      [bounds.northEast.lat, bounds.northEast.lng],
    )
    map.fitBounds(leafletBounds, { padding: [50, 50] })
  }, [map, bounds])

  return null
}
