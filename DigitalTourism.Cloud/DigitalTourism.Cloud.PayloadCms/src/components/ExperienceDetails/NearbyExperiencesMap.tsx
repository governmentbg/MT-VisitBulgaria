'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { MapExplorerPOI } from '@/components/MapExplorer/types'
import { EmbeddedMap } from '@/components/MapExplorer/EmbeddedMap/EmbeddedMap'
import { useCompactMap } from '@/components/MapExplorer/hooks/useCompactMap'

interface NearbyExperiencesMapProps {
  currentPoi: MapExplorerPOI
  nearbyPois: MapExplorerPOI[]
  heading: string
  description?: string
  /**
   * Resolved by the server parent: the root layout omits the `mapExplorer`
   * namespace from client messages, so useTranslations() would render the raw
   * key path here.
   */
  viewMapLabel: string
  closeMapLabel: string
  viewMoreLabel: string
  directionsLabel: string
}

// Lazy-load the inner map to avoid Leaflet SSR issues
const NearbyMapInner = dynamic(() => import('./NearbyMapInner'), { ssr: false })

const isMacPlatform = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export function NearbyExperiencesMap({
  currentPoi,
  nearbyPois,
  heading,
  description,
  viewMapLabel,
  closeMapLabel,
  viewMoreLabel,
  directionsLabel,
}: NearbyExperiencesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const overlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isCompact = useCompactMap()

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

  const handleScrollAttempt = useCallback((withCtrl: boolean) => {
    if (isCompact) return // Touch devices get the static preview + full-screen button instead
    if (withCtrl) {
      // Ctrl/Cmd held — hide overlay immediately
      setShowOverlay(false)
      if (overlayTimer.current) clearTimeout(overlayTimer.current)
      return
    }
    // No modifier — show hint overlay, auto-hide after 1.5s
    setShowOverlay(true)
    if (overlayTimer.current) clearTimeout(overlayTimer.current)
    overlayTimer.current = setTimeout(() => setShowOverlay(false), 1500)
  }, [isCompact])

  const handleMouseLeave = useCallback(() => {
    setShowOverlay(false)
    if (overlayTimer.current) clearTimeout(overlayTimer.current)
  }, [])

  if (nearbyPois.length === 0) return null

  return (
    <section className="container py-16 lg:py-28">
      <h2 className="mb-4 text-center font-heading text-3xl font-bold leading-[1.15] text-heading md:text-5xl lg:text-[60px]">
        {heading}
      </h2>
      {description && (
        <p className="mb-12 text-center text-lg text-muted-foreground">{description}</p>
      )}
      <div ref={containerRef} className="relative" onMouseLeave={handleMouseLeave}>
        <EmbeddedMap
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-[2/1]"
          viewLabel={viewMapLabel}
          closeLabel={closeMapLabel}
        >
          {({ interactive }) =>
            visible && (
              <NearbyMapInner
                currentPoi={currentPoi}
                nearbyPois={nearbyPois}
                onScrollAttempt={handleScrollAttempt}
                viewMoreLabel={viewMoreLabel}
                directionsLabel={directionsLabel}
                interactive={interactive}
              />
            )
          }
        </EmbeddedMap>
        {/* Google Maps-style scroll hint overlay */}
        <div
          className={`pointer-events-none absolute inset-0 z-[1001] flex items-center justify-center bg-black/30 transition-opacity duration-300 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="rounded-lg bg-black/70 px-6 py-3 text-sm font-medium text-white">
            Use {isMacPlatform() ? '⌘' : 'Ctrl'} + scroll to zoom
          </p>
        </div>
      </div>
    </section>
  )
}
