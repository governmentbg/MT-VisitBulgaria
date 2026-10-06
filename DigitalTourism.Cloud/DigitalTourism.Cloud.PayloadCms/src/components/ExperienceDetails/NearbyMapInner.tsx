'use client'

import { useEffect, useMemo } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapCanvas } from '@/components/MapExplorer/MapCanvas/MapCanvas'
import { MapControls } from '@/components/MapExplorer/MapCanvas/MapControls'
import { ExperienceMarker } from '@/components/MapExplorer/MapCanvas/ExperienceMarker'
import { MarkerPopup } from '@/components/MapExplorer/MapCanvas/MarkerPopup'
import type { MapExplorerPOI } from '@/components/MapExplorer/types'

interface NearbyMapInnerProps {
  currentPoi: MapExplorerPOI
  nearbyPois: MapExplorerPOI[]
  onScrollAttempt?: (withCtrl: boolean) => void
  viewMoreLabel?: string
  directionsLabel?: string
  /** False renders a frozen preview — see EmbeddedMap. */
  interactive?: boolean
}

const CURRENT_MARKER_HTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
    <path d="M18 48C18 48 2 27 2 16C2 7.2 9.2 0 18 0S34 7.2 34 16C34 27 18 48 18 48Z" fill="#D97706" stroke="#fff" stroke-width="2"/>
    <circle cx="18" cy="16" r="6" fill="#fff"/>
  </svg>
`

const currentMarkerIcon = L.divIcon({
  className: 'current-experience-marker',
  html: CURRENT_MARKER_HTML,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -48],
})

/** Auto-fit all markers into the viewport, then pan to center on the current POI */
function FitBounds({ points, center }: { points: [number, number][]; center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length < 2) return
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]))
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 })
    // After fitting all markers, pan to center on the current experience
    setTimeout(() => map.panTo(center, { animate: false }), 50)
  }, [map, points, center])

  return null
}

/** Enable scroll-wheel zoom only when Ctrl/Cmd is held */
function ScrollZoomHandler({ onScrollAttempt }: { onScrollAttempt: (withCtrl: boolean) => void }) {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        map.scrollWheelZoom.enable()
        onScrollAttempt(true)
      } else {
        map.scrollWheelZoom.disable()
        onScrollAttempt(false)
      }
    }
    container.addEventListener('wheel', handler, { passive: true })
    return () => container.removeEventListener('wheel', handler)
  }, [map, onScrollAttempt])

  return null
}

export default function NearbyMapInner({
  currentPoi,
  nearbyPois,
  onScrollAttempt,
  viewMoreLabel,
  directionsLabel,
  interactive = true,
}: NearbyMapInnerProps) {
  const center = useMemo<[number, number]>(
    () => [currentPoi.location.lat, currentPoi.location.lng],
    [currentPoi.location.lat, currentPoi.location.lng],
  )

  const allPoints = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [center]
    for (const poi of nearbyPois) {
      pts.push([poi.location.lat, poi.location.lng])
    }
    return pts
  }, [center, nearbyPois])

  return (
    <MapCanvas center={center} zoom={12} scrollWheelZoom={false} interactive={interactive}>
      {interactive && <MapControls />}
      <FitBounds points={allPoints} center={center} />
      {interactive && onScrollAttempt && <ScrollZoomHandler onScrollAttempt={onScrollAttempt} />}

      {/* Current experience — distinct gold marker with popup */}
      <Marker position={center} icon={currentMarkerIcon}>
        <Popup className="map-explorer-popup" maxWidth={340} minWidth={320} autoPan={false}>
          <MarkerPopup poi={currentPoi} viewMoreLabel={viewMoreLabel} directionsLabel={directionsLabel} />
        </Popup>
      </Marker>

      {/* Nearby experiences */}
      {nearbyPois.map((poi) => (
        <ExperienceMarker key={poi.id} poi={poi} viewMoreLabel={viewMoreLabel} directionsLabel={directionsLabel} />
      ))}
    </MapCanvas>
  )
}
