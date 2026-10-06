'use client'

import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'
import type { MapExplorerPOI } from '../types'
import { MarkerPopup } from './MarkerPopup'

interface ExperienceMarkerProps {
  poi: MapExplorerPOI
  isSelected?: boolean
  onSelect?: (poi: MapExplorerPOI) => void
  viewMoreLabel?: string
  directionsLabel?: string
}

const MARKER_HTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path d="M16 42C16 42 2 24 2 14C2 6.3 8.3 0 16 0S30 6.3 30 14C30 24 16 42 16 42Z" fill="#008577" stroke="#fff" stroke-width="2"/>
    <circle cx="16" cy="14" r="5" fill="#fff"/>
  </svg>
`

const defaultIcon = L.divIcon({
  className: 'experience-marker',
  html: MARKER_HTML,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
})

const selectedIcon = L.divIcon({
  className: 'experience-marker',
  html: MARKER_HTML.replace('fill="#008577"', 'fill="#004F46"'),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
})

export function ExperienceMarker({ poi, isSelected, onSelect, viewMoreLabel, directionsLabel }: ExperienceMarkerProps) {
  const icon = useMemo(() => (isSelected ? selectedIcon : defaultIcon), [isSelected])
  const markerRef = useRef<L.Marker>(null)
  const map = useMap()
  const prevSelectedRef = useRef(isSelected)

  useEffect(() => {
    const wasSelected = prevSelectedRef.current
    prevSelectedRef.current = isSelected

    if (isSelected && !wasSelected && markerRef.current) {
      // Newly selected — close any open popup, then open ours after flyTo settles
      map.closePopup()
      const timer = setTimeout(() => {
        markerRef.current?.openPopup()
      }, 250) // open while flyTo is decelerating — marker is already near target
      return () => clearTimeout(timer)
    }
  }, [isSelected, map])

  return (
    <Marker
      ref={markerRef}
      position={[poi.location.lat, poi.location.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect?.(poi),
      }}
    >
      <Popup className="map-explorer-popup" maxWidth={340} minWidth={320} autoPan={false}>
        <MarkerPopup poi={poi} viewMoreLabel={viewMoreLabel} directionsLabel={directionsLabel} />
      </Popup>
    </Marker>
  )
}
