'use client'

import { useRef, useEffect, useState } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { MapCanvas } from '@/components/MapExplorer/MapCanvas/MapCanvas'
import { MapControls } from '@/components/MapExplorer/MapCanvas/MapControls'
import { LinkButton } from '@/components/ui'
import { DirectionsFilled } from '@/components/ui/icons'

const MARKER_HTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path d="M16 42C16 42 2 24 2 14C2 6.3 8.3 0 16 0S30 6.3 30 14C30 24 16 42 16 42Z" fill="#008577" stroke="#fff" stroke-width="2"/>
    <circle cx="16" cy="14" r="5" fill="#fff"/>
  </svg>
`

const markerIcon = L.divIcon({
  className: 'experience-marker',
  html: MARKER_HTML,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
})

export interface LocationMapClientProps {
  center: [number, number]
  zoom: number
  directionsLabel?: string
  /** False renders a frozen preview — see EmbeddedMap. */
  interactive?: boolean
}

export function LocationMapClient({
  center,
  zoom,
  directionsLabel,
  interactive = true,
}: LocationMapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Defer map init until the container is actually visible (e.g. hidden tab)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${center[0]},${center[1]}`

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {visible && (
        <>
          <MapCanvas center={center} zoom={zoom} interactive={interactive}>
            {interactive && <MapControls />}
            <Marker position={center} icon={markerIcon} />
          </MapCanvas>

          {directionsLabel && (
            <div className="absolute bottom-8 left-4 z-[1000]">
              <LinkButton
                className=" py-2"
                href={googleMapsUrl}
                icon={<DirectionsFilled className="!size-8 !stroke-0" />}
                variant="primary"
                size="md"
                newTab
              >
                {directionsLabel}
              </LinkButton>
            </div>
          )}
        </>
      )}
    </div>
  )
}
