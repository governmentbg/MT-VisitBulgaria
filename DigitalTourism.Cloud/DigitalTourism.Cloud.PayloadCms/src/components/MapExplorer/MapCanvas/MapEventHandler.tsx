'use client'

import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import type L from 'leaflet'
import { useMap, useMapEvents } from 'react-leaflet'
import type { MapViewportBounds } from '../types'

interface MapEventHandlerProps {
  onViewportChange: (bounds: MapViewportBounds, zoom: number) => void
}

export interface MapEventHandlerRef {
  flyTo: (lat: number, lng: number, zoom?: number) => void
  getMap: () => L.Map
}

export const MapEventHandler = forwardRef<MapEventHandlerRef, MapEventHandlerProps>(
  ({ onViewportChange }, ref) => {
    const map = useMap()
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const onViewportChangeRef = useRef(onViewportChange)
    onViewportChangeRef.current = onViewportChange
    // Track last emitted values to skip duplicate calls
    const lastEmitRef = useRef<{ neLat: number; neLng: number; swLat: number; swLng: number; zoom: number } | null>(null)

    /** Cancel any scheduled viewport emit — the map is moving again. */
    const cancelPendingEmit = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }
    }

    /** Schedule a viewport emit after the map settles.
     *  If another movestart/zoomstart fires before the timeout,
     *  it gets cancelled automatically — so we only emit once idle. */
    const scheduleEmit = () => {
      cancelPendingEmit()
      idleTimerRef.current = setTimeout(() => {
        idleTimerRef.current = null
        const b = map.getBounds()
        const ne = b.getNorthEast()
        const sw = b.getSouthWest()
        const zoom = Math.round(map.getZoom())

        // Skip if coordinates + zoom are the same as last emit (within ~11m)
        const last = lastEmitRef.current
        const EPS = 0.0001
        if (
          last &&
          last.zoom === zoom &&
          Math.abs(last.neLat - ne.lat) < EPS &&
          Math.abs(last.neLng - ne.lng) < EPS &&
          Math.abs(last.swLat - sw.lat) < EPS &&
          Math.abs(last.swLng - sw.lng) < EPS
        ) {
          return
        }
        lastEmitRef.current = { neLat: ne.lat, neLng: ne.lng, swLat: sw.lat, swLng: sw.lng, zoom }

        const bounds: MapViewportBounds = {
          northEast: { lat: ne.lat, lng: ne.lng },
          southWest: { lat: sw.lat, lng: sw.lng },
        }
        onViewportChangeRef.current(bounds, zoom)
      }, 200)
    }

    useMapEvents({
      movestart: cancelPendingEmit,
      zoomstart: cancelPendingEmit,
      moveend: scheduleEmit,
      zoomend: scheduleEmit,
    })

    // Emit initial viewport on mount — retry until container is properly sized
    useEffect(() => {
      let attempts = 0
      const tryEmit = () => {
        const b = map.getBounds()
        const ne = b.getNorthEast()
        const sw = b.getSouthWest()
        if (Math.abs(ne.lng - sw.lng) < 0.001 || Math.abs(ne.lat - sw.lat) < 0.001) {
          if (attempts < 10) {
            attempts++
            return setTimeout(tryEmit, 100)
          }
        }
        const bounds: MapViewportBounds = {
          northEast: { lat: ne.lat, lng: ne.lng },
          southWest: { lat: sw.lat, lng: sw.lng },
        }
        onViewportChangeRef.current(bounds, Math.round(map.getZoom()))
        return undefined
      }
      const timer = setTimeout(tryEmit, 100)
      return () => clearTimeout(timer)
    }, [map])

    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number, zoom?: number) => {
        map.flyTo([lat, lng], zoom ?? map.getZoom(), {
          duration: 0.6,
          easeLinearity: 0.25,
        })
      },
      getMap: () => map,
    }))

    return null
  },
)

MapEventHandler.displayName = 'MapEventHandler'
