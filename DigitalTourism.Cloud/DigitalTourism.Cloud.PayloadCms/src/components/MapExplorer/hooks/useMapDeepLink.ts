'use client'

import { useCallback, useEffect, useRef } from 'react'

export interface DeepLinkState {
  center?: [number, number]
  zoom?: number
  query?: string
  poi?: string | null
  /** Opaque results snapshot stored in history.state — avoids refetching on back/forward. */
  snapshot?: unknown
}

/** Parse deep-link params from a URLSearchParams instance. */
export function parseDeepLinkParams(params: URLSearchParams): DeepLinkState {
  const state: DeepLinkState = {}
  const lat = params.get('lat')
  const lng = params.get('lng')
  if (lat && lng) {
    const parsedLat = parseFloat(lat)
    const parsedLng = parseFloat(lng)
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      state.center = [parsedLat, parsedLng]
    }
  }
  const z = params.get('z')
  if (z) {
    const parsedZoom = parseInt(z, 10)
    if (!isNaN(parsedZoom)) state.zoom = parsedZoom
  }
  const q = params.get('q')
  if (q) state.query = q
  const poi = params.get('poi')
  if (poi) state.poi = poi
  return state
}

/** Read a snapshot from the current history entry (e.g. on initial mount after back-nav). */
export function getHistorySnapshot(): unknown | undefined {
  try {
    return (window.history.state as { __mapSnapshot?: unknown } | null)?.__mapSnapshot
  } catch {
    return undefined
  }
}

interface UseMapDeepLinkOptions {
  onPopState?: (state: DeepLinkState) => void
}

export function useMapDeepLink({ onPopState }: UseMapDeepLinkOptions) {
  // Handle browser back/forward — read URL and notify parent
  const onPopStateRef = useRef(onPopState)
  onPopStateRef.current = onPopState

  useEffect(() => {
    const handler = (e: PopStateEvent) => {
      const state = parseDeepLinkParams(new URLSearchParams(window.location.search))
      // Ensure poi is explicitly null (not undefined) when absent so callers
      // can distinguish "no POI" from "POI param not in URL".
      if (state.poi === undefined) state.poi = null
      // Attach cached snapshot if present in history entry
      state.snapshot = (e.state as { __mapSnapshot?: unknown } | null)?.__mapSnapshot
      lastPoiRef.current = state.poi
      onPopStateRef.current?.(state)
    }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  // Track current POI in URL to detect when it changes (push vs replace)
  const lastPoiRef = useRef<string | null | undefined>(undefined)

  const updateURL = useCallback((state: DeepLinkState & { snapshot?: unknown }) => {
    const params = new URLSearchParams()

    if (state.center) {
      params.set('lat', state.center[0].toFixed(4))
      params.set('lng', state.center[1].toFixed(4))
    }
    if (state.zoom !== undefined) {
      params.set('z', String(state.zoom))
    }
    if (state.query) {
      params.set('q', state.query)
    }
    if (state.poi) {
      params.set('poi', state.poi)
    }

    const qs = params.toString()
    const newUrl = qs ? `?${qs}` : window.location.pathname
    const historyState = state.snapshot != null ? { __mapSnapshot: state.snapshot } : null

    // Push a new history entry when the POI selection changes so the
    // browser back button can undo it. Otherwise just replace silently.
    const poiChanged = state.poi !== lastPoiRef.current
    lastPoiRef.current = state.poi
    if (poiChanged && state.poi) {
      window.history.pushState(historyState, '', newUrl)
    } else {
      window.history.replaceState(historyState, '', newUrl)
    }
  }, [])

  return { updateURL }
}
