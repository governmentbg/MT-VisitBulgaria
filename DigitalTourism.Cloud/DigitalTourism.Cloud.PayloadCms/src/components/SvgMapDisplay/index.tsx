'use client'

import React, { useState, useCallback } from 'react'
import { cn, Container } from '@/components/ui'
import { SvgMapViewer, type SvgMapRegion } from '@/components/SvgMapViewer'
import { RegionInfoCard } from '@/components/RegionInfoCard'

export interface SvgMapGalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface SvgMapDisplayRegion extends SvgMapRegion {
  description?: string
  linkHref?: string
  linkLabel?: string
  gallery: SvgMapGalleryImage[]
}

export interface SvgMapDisplayProps {
  heading: string
  subtitle?: string
  svgUrl: string
  backgroundImageUrl?: string
  regions: SvgMapDisplayRegion[]
  defaultRegionIndex?: number
  className?: string
}

export const SvgMapDisplay: React.FC<SvgMapDisplayProps> = ({
  heading,
  subtitle,
  svgUrl,
  backgroundImageUrl,
  regions,
  defaultRegionIndex = 0,
  className,
}) => {
  const safeIndex = Math.min(defaultRegionIndex, regions.length - 1)
  const initialRegionId = regions[safeIndex]?.regionId ?? null

  const [activeRegionId, setActiveRegionId] = useState<string | null>(initialRegionId)
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null)

  const handleRegionClick = useCallback(
    (regionId: string) => {
      if (regionId === activeRegionId) {
        const region = regions.find((r) => r.regionId === regionId)
        if (region?.linkHref) {
          window.location.href = region.linkHref
        }
      } else {
        setActiveRegionId(regionId)
      }
    },
    [activeRegionId, regions],
  )

  const activeRegion = regions.find((r) => r.regionId === activeRegionId) ?? regions[0]
  const galleryImages = activeRegion?.gallery?.slice(0, 2) ?? []

  if (!regions.length) return null

  return (
    <div className={cn('-mt-16 pt-16 relative z-0 overflow-hidden bg-primary-800', className)}>
      {/* Decorative background — shifted 10% left, extends into the top overlap area */}
      {backgroundImageUrl && (
        <img
          src={backgroundImageUrl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover object-top opacity-10 lg:-left-[10%] lg:w-[120%]"
        />
      )}

      <Container className="relative z-10 py-16 md:py-24">
        {/* Heading */}
        <div className="mb-10 text-center text-white lg:mb-16">
          <h2 className="font-heading text-2xl font-bold sm:text-4xl lg:text-[3.75rem] lg:leading-[1.15]">
            {heading}
          </h2>
          {subtitle && (
            <p className="mt-4 text-base font-medium opacity-80 sm:text-lg">{subtitle}</p>
          )}
        </div>

        {/* Main content grid — Desktop: [gallery+card | map], Tablet/Mobile: [map, gallery+card] */}
        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-[7fr_8fr] sm:gap-6 lg:gap-6">
          {/* Left: Gallery + Info card — single grid for all breakpoints */}
          <div className="order-2 grid grid-cols-1 gap-6 sm:order-1 sm:grid-cols-[45%_1fr] lg:grid-cols-[46%_1fr] lg:gap-8">
            {/* Portrait image — hidden on mobile, spans both rows on sm+ */}
            {galleryImages[0] && (
              <div className="row-span-2 hidden overflow-hidden rounded-2xl sm:block">
                <img
                  src={galleryImages[0].url}
                  alt={galleryImages[0].alt}
                  width={galleryImages[0].width}
                  height={galleryImages[0].height}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Info card — min-height prevents layout shift when switching regions */}
            {activeRegion && (
              <RegionInfoCard
                name={activeRegion.name}
                description={activeRegion.description}
                linkHref={activeRegion.linkHref}
                linkLabel={activeRegion.linkLabel}
              />
            )}

            {/* Landscape image — second image on sm+, first on mobile */}
            {galleryImages[1] && (
              <div className="hidden aspect-[4/3] overflow-hidden rounded-2xl sm:block">
                <img
                  src={galleryImages[1].url}
                  alt={galleryImages[1].alt}
                  width={galleryImages[1].width}
                  height={galleryImages[1].height}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {galleryImages[0] && (
              <div className="aspect-[4/3] overflow-hidden rounded-2xl sm:hidden">
                <img
                  src={galleryImages[0].url}
                  alt={galleryImages[0].alt}
                  width={galleryImages[0].width}
                  height={galleryImages[0].height}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Right: SVG Map */}
          <div className="order-1 sm:order-2">
            <SvgMapViewer
              svgUrl={svgUrl}
              regions={regions}
              activeRegionId={activeRegionId}
              hoveredRegionId={hoveredRegionId}
              onRegionClick={handleRegionClick}
              onRegionHover={setHoveredRegionId}
              defaultFill="#E6F8F6"
              stroke="#B8C6C5"
              strokeWidth="1.5"
            />
          </div>
        </div>
      </Container>
    </div>
  )
}
