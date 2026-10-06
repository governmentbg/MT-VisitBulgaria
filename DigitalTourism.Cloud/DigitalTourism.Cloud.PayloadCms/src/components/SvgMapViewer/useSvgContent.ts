'use client'

import { useState, useEffect } from 'react'

export interface SvgRootAttrs {
  stroke?: string
  strokeWidth?: string
  strokeLinecap?: string
  strokeLinejoin?: string
}

interface SvgContentResult {
  svgContent: string | null
  viewBox: string | null
  rootAttrs: SvgRootAttrs
  isLoading: boolean
  error: string | null
}

export function useSvgContent(svgUrl: string): SvgContentResult {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [viewBox, setViewBox] = useState<string | null>(null)
  const [rootAttrs, setRootAttrs] = useState<SvgRootAttrs>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSvg() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(svgUrl)
        if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.status}`)

        const text = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'image/svg+xml')
        const svgEl = doc.querySelector('svg')

        if (!svgEl) throw new Error('No <svg> element found in file')

        // Remove script tags for safety and point/label groups that create duplicate IDs
        svgEl.querySelectorAll('script').forEach((s) => s.remove())
        svgEl.querySelectorAll('g#points, g#label_points').forEach((g) => g.remove())

        if (cancelled) return

        setViewBox(svgEl.getAttribute('viewBox') || svgEl.getAttribute('viewbox'))

        // Extract presentation attributes from the root <svg> so they can be applied to our wrapper
        const attrs: SvgRootAttrs = {}
        const stroke = svgEl.getAttribute('stroke')
        if (stroke) attrs.stroke = stroke
        const strokeWidth = svgEl.getAttribute('stroke-width')
        if (strokeWidth) attrs.strokeWidth = strokeWidth
        const strokeLinecap = svgEl.getAttribute('stroke-linecap')
        if (strokeLinecap) attrs.strokeLinecap = strokeLinecap
        const strokeLinejoin = svgEl.getAttribute('stroke-linejoin')
        if (strokeLinejoin) attrs.strokeLinejoin = strokeLinejoin
        setRootAttrs(attrs)

        setSvgContent(svgEl.innerHTML)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load SVG')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchSvg()
    return () => {
      cancelled = true
    }
  }, [svgUrl])

  return { svgContent, viewBox, rootAttrs, isLoading, error }
}
