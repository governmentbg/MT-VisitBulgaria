'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef, useState, useCallback } from 'react'
import { MapObjectCardExpanded } from '@/components/ui'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'
import { useTranslations } from 'next-intl'
import { getDayBadgeColor } from '@/utilities/getDayBadgeColor'

const PIN_COLOR = '#00BBA7'

const createCustomIcon = (dayNumber: number, imageUrl?: string | null) => {
  const badgeColor = getDayBadgeColor(dayNumber - 1)

  const markerHtml = imageUrl
    ? `
      <div style="position: relative; width: 48px; height: 56px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56" width="48" height="56" style="position: absolute; top: 0; left: 0; z-index: 1;">
          <path d="M24 56 C24 56 4 33 4 20 C4 9 12.954 0 24 0 S44 9 44 20 C44 33 24 56 24 56Z" fill="${PIN_COLOR}" stroke="#fff" stroke-width="2"/>
        </svg>
        <div style="position: absolute; top: 4px; left: 8px; width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: #e2e8f0; z-index: 2; border: 2px solid #fff;">
          <img src="${imageUrl}" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
        </div>
        <div style="position: absolute; top: -2px; right: -2px; width: 20px; height: 20px; border-radius: 50%; background: ${badgeColor}; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 10px; font-family: system-ui, sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 3;">${dayNumber}</div>
      </div>
    `
    : `
      <div style="position: relative; width: 48px; height: 56px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56" width="48" height="56" style="position: absolute; top: 0; left: 0; z-index: 1;">
          <path d="M24 56 C24 56 4 33 4 20 C4 9 12.954 0 24 0 S44 9 44 20 C44 33 24 56 24 56Z" fill="${PIN_COLOR}" stroke="#fff" stroke-width="2"/>
        </svg>
        <div style="position: absolute; top: 4px; left: 8px; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; z-index: 2; border: 2px solid #fff;">
          <span style="color: ${PIN_COLOR}; font-weight: bold; font-size: 14px; font-family: system-ui, sans-serif;">${dayNumber}</span>
        </div>
        <div style="position: absolute; top: -2px; right: -2px; width: 20px; height: 20px; border-radius: 50%; background: ${badgeColor}; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 10px; font-family: system-ui, sans-serif; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 3;">${dayNumber}</div>
      </div>
    `

  return L.divIcon({
    className: 'custom-marker',
    html: markerHtml,
    iconSize: [48, 56],
    iconAnchor: [24, 56],
    popupAnchor: [0, -56],
  })
}

// Component to fit bounds when markers change
function FitBounds({ markers }: { markers: MarkerData[] }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length === 0) return

    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
  }, [markers, map])

  return null
}

// Popup content using the reusable MapObjectCardExpanded popup variant
const PopupContent = ({
  marker,
  onClose,
  onLike,
  liked,
}: {
  marker: MarkerData
  onClose?: () => void
  onLike?: () => void
  liked?: boolean
}) => {
  const t = useTranslations('tripPlanner')

  const imageUrl = marker.imageUrl || ''
  const type = marker.experienceType || 'attractions'
  const ctaHref = marker.experienceSlug ? buildExperienceUrl(type, marker.experienceSlug) : undefined

  return (
    <MapObjectCardExpanded
      variant="popup"
      image={imageUrl}
      title={marker.title}
      category={marker.experienceCategory}
      location={marker.experienceLocation}
      onClose={onClose}
      onLike={onLike}
      liked={liked}
      ctaLabel={t('viewMore')}
      ctaHref={ctaHref}
      directionsLabel={t('getDirections')}
      coordinates={{ lat: marker.lat, lng: marker.lng }}
      className="shadow-none"
    />
  )
}

// Wrapper that provides close via Leaflet map API
function MarkerPopup({
  marker,
  isLiked,
  onToggleLike,
}: {
  marker: MarkerData
  isLiked?: (marker: MarkerData) => boolean
  onToggleLike?: (marker: MarkerData) => void
}) {
  const map = useMap()
  const handleClose = useCallback(() => {
    map.closePopup()
  }, [map])

  return (
    <PopupContent
      marker={marker}
      onClose={handleClose}
      onLike={onToggleLike ? () => onToggleLike(marker) : undefined}
      liked={isLiked?.(marker)}
    />
  )
}

export type MarkerData = {
  id: string
  lat: number
  lng: number
  title: string
  dayNumber: number
  imageUrl?: string | null
  experienceId?: string
  /** The collection slug, e.g. 'hotels', 'attractions' */
  experienceType?: string
  experienceSlug?: string
  experienceCategory?: string
  experienceLocation?: string
}

type Props = {
  markers: MarkerData[]
  /** Check if a marker is liked */
  isLiked?: (marker: MarkerData) => boolean
  /** Toggle like for a marker */
  onToggleLike?: (marker: MarkerData) => void
}

export default function Map({ markers, isLiked, onToggleLike }: Props) {
  // Force a fresh MapContainer on every mount cycle to avoid
  // "Map container is being reused by another instance" in React strict mode
  const [mapKey, setMapKey] = useState(0)
  const mountRef = useRef(false)

  useEffect(() => {
    if (mountRef.current) {
      // Strict mode remount — bump key so MapContainer gets a fresh DOM node
      setMapKey((k) => k + 1)
    }
    mountRef.current = true
  }, [])

  // Center map on Bulgaria by default
  const defaultCenter: [number, number] = [42.7339, 25.4858]
  const defaultZoom = 7

  return (
    <MapContainer
      key={mapKey}
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false} // We'll add custom controls
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Custom zoom control positioned top-right */}
      <div className="leaflet-top leaflet-right" style={{ margin: '10px' }}>
        <div className="leaflet-control leaflet-bar flex flex-col bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
          <ZoomButton direction="in" />
          <div className="h-px bg-slate-200" />
          <ZoomButton direction="out" />
        </div>
      </div>

      {/* Fit bounds to show all markers */}
      <FitBounds markers={markers} />

      {/* Markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={createCustomIcon(marker.dayNumber, marker.imageUrl)}
        >
          <Popup className="custom-popup" maxWidth={340} minWidth={260}>
            <MarkerPopup marker={marker} isLiked={isLiked} onToggleLike={onToggleLike} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

// Custom zoom button component
function ZoomButton({ direction }: { direction: 'in' | 'out' }) {
  const map = useMap()

  const handleClick = () => {
    if (direction === 'in') {
      map.zoomIn()
    } else {
      map.zoomOut()
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
      title={direction === 'in' ? 'Zoom in' : 'Zoom out'}
    >
      {direction === 'in' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
        </svg>
      )}
    </button>
  )
}
