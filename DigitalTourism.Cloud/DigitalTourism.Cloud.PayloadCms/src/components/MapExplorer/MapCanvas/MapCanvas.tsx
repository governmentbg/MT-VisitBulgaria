'use client'

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'

/**
 * Leaflet applies `dragging`, `touchZoom` etc. only when the map is created.
 * Crossing the compact/desktop breakpoint re-renders with a different
 * `interactive` value but React keeps the same DOM node, so the map would be
 * left with stale handlers — frozen on desktop, or still swallowing touch
 * drags in a preview. Toggle the handlers imperatively instead.
 */
function MapInteractivity({
  interactive,
  scrollWheelZoom,
}: {
  interactive: boolean
  scrollWheelZoom: boolean
}) {
  const map = useMap()

  useEffect(() => {
    for (const handler of [map.dragging, map.touchZoom, map.doubleClickZoom, map.boxZoom, map.keyboard]) {
      if (interactive) handler?.enable()
      else handler?.disable()
    }

    // Callers opt out of wheel zoom independently of touch interactivity.
    if (interactive && scrollWheelZoom) map.scrollWheelZoom?.enable()
    else map.scrollWheelZoom?.disable()
  }, [map, interactive, scrollWheelZoom])

  return null
}

/**
 * Leaflet measures its container once at creation. When a map is created inside
 * a container that is still sizing up — a freshly opened dialog, or an
 * aspect-ratio box before layout settles — it caches a wrong size and renders
 * grey gutters. Re-measure on mount and whenever the container resizes.
 */
function MapAutoResize() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    map.invalidateSize()

    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])

  return null
}

interface MapCanvasProps {
  center: [number, number]
  zoom: number
  scrollWheelZoom?: boolean
  /**
   * When false the map is frozen: every pan/zoom handler is disabled so a touch
   * drag starting on the map scrolls the page instead of being swallowed by
   * Leaflet. Used for the static previews embedded in scrolling pages.
   */
  interactive?: boolean
  children?: React.ReactNode
}

export function MapCanvas({
  center,
  zoom,
  scrollWheelZoom = true,
  interactive = true,
  children,
}: MapCanvasProps) {
  // Force a fresh MapContainer on every mount cycle to avoid
  // "Map container is being reused by another instance" in React strict mode
  const [mapKey, setMapKey] = useState(0)
  const mountRef = useRef(false)

  useEffect(() => {
    if (mountRef.current) {
      setMapKey((k) => k + 1)
    }
    mountRef.current = true
  }, [])

  return (
    <MapContainer
      className="z-0"
      key={mapKey}
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={interactive && scrollWheelZoom}
      dragging={interactive}
      touchZoom={interactive}
      doubleClickZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapAutoResize />
      <MapInteractivity interactive={interactive} scrollWheelZoom={scrollWheelZoom} />
      {children}
    </MapContainer>
  )
}
