'use client'

import { useEffect } from 'react'

/**
 * Sets CSS custom properties on <html> for the map layout:
 * - --map-vh: actual visible viewport height (window.innerHeight).
 *   Fixes Chrome on iOS where 100dvh includes area behind the bottom toolbar.
 * - --header-h: measured height of the <header> element so the map can
 *   offset below it without hardcoding a pixel value.
 */
export function MapViewportHeight() {
  useEffect(() => {
    const root = document.documentElement

    function updateVh() {
      root.style.setProperty('--map-vh', `${window.innerHeight}px`)
    }

    function updateHeader() {
      const header = document.querySelector('header')
      root.style.setProperty('--header-h', header ? `${header.offsetHeight}px` : '0px')
    }

    updateVh()
    updateHeader()

    window.addEventListener('resize', updateVh)

    const header = document.querySelector('header')
    let ro: ResizeObserver | undefined
    if (header) {
      ro = new ResizeObserver(updateHeader)
      ro.observe(header)
    }

    return () => {
      window.removeEventListener('resize', updateVh)
      ro?.disconnect()
    }
  }, [])

  return null
}
