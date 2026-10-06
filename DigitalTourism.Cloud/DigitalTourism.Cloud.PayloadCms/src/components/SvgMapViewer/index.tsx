'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { cn, Spinner } from '@/components/ui'
import { useSvgContent } from './useSvgContent'

export interface SvgMapRegion {
  regionId: string
  name: string
}

export interface SvgMapViewerProps {
  svgUrl: string
  regions: SvgMapRegion[]
  activeRegionId: string | null
  hoveredRegionId?: string | null
  onRegionClick: (regionId: string) => void
  onRegionHover: (regionId: string | null) => void
  className?: string
  defaultFill?: string
  activeFill?: string
  hoverFill?: string
  stroke?: string
  strokeWidth?: string
}

export const SvgMapViewer: React.FC<SvgMapViewerProps> = ({
  svgUrl,
  regions,
  activeRegionId,
  hoveredRegionId,
  onRegionClick,
  onRegionHover,
  className,
  defaultFill,
  activeFill = '#0D9488',
  hoverFill = '#0FA89A',
  stroke,
  strokeWidth,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const { svgContent, viewBox, rootAttrs, isLoading, error } = useSvgContent(svgUrl)

  const regionIds = React.useMemo(() => new Set(regions.map((r) => r.regionId)), [regions])

  // Find the closest ancestor with a matching region ID
  const findRegionElement = useCallback(
    (target: EventTarget | null): SVGElement | null => {
      let el = target as SVGElement | null
      while (el && el !== svgRef.current) {
        if (el.id && regionIds.has(el.id)) return el
        el = el.parentElement as SVGElement | null
      }
      return null
    },
    [regionIds],
  )

  // Set up accessibility attributes after SVG loads
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !svgContent) return

    regionIds.forEach((id) => {
      const el = svg.querySelector(`#${CSS.escape(id)}`) as SVGElement | null
      if (!el) return

      el.style.cursor = 'pointer'
      el.style.transition = 'fill 200ms ease, opacity 200ms ease'
      el.setAttribute('role', 'button')
      el.setAttribute('tabindex', '0')

      const region = regions.find((r) => r.regionId === id)
      if (region) el.setAttribute('aria-label', region.name)
    })
  }, [svgContent, regions, regionIds])

  // Update fills based on active/hovered state
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !svgContent) return

    regionIds.forEach((id) => {
      const el = svg.querySelector(`#${CSS.escape(id)}`) as SVGElement | null
      if (!el) return

      if (id === activeRegionId) {
        el.style.fill = activeFill
      } else if (id === hoveredRegionId) {
        el.style.fill = hoverFill
      } else if (defaultFill) {
        el.style.fill = defaultFill
      } else {
        el.style.removeProperty('fill')
      }
    })
  }, [svgContent, activeRegionId, hoveredRegionId, regionIds, activeFill, hoverFill, defaultFill])

  // Event delegation on the SVG element
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !svgContent) return

    const handleClick = (e: MouseEvent) => {
      const region = findRegionElement(e.target)
      if (region) onRegionClick(region.id)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const region = findRegionElement(e.target)
      if (region) onRegionHover(region.id)
    }

    const handleMouseOut = (e: MouseEvent) => {
      const region = findRegionElement(e.target)
      if (region) onRegionHover(null)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target as SVGElement
        if (target.id && regionIds.has(target.id)) {
          e.preventDefault()
          onRegionClick(target.id)
        }
      }
    }

    svg.addEventListener('click', handleClick)
    svg.addEventListener('mouseover', handleMouseOver)
    svg.addEventListener('mouseout', handleMouseOut)
    svg.addEventListener('keydown', handleKeyDown)

    return () => {
      svg.removeEventListener('click', handleClick)
      svg.removeEventListener('mouseover', handleMouseOver)
      svg.removeEventListener('mouseout', handleMouseOut)
      svg.removeEventListener('keydown', handleKeyDown)
    }
  }, [svgContent, regionIds, findRegionElement, onRegionClick, onRegionHover])

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Spinner size="lg" className="text-white" />
      </div>
    )
  }

  if (error || !svgContent) return null

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox || undefined}
      fill={defaultFill || undefined}
      stroke={stroke || rootAttrs.stroke}
      strokeWidth={strokeWidth || rootAttrs.strokeWidth}
      strokeLinecap={rootAttrs.strokeLinecap as 'round' | 'butt' | 'square' | undefined}
      strokeLinejoin={rootAttrs.strokeLinejoin as 'round' | 'miter' | 'bevel' | undefined}
      className={cn('h-auto w-full', className)}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
