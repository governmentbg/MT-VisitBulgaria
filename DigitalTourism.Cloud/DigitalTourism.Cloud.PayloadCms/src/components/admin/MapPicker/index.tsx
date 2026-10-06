'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useField, useTranslation, toast } from '@payloadcms/ui'
import type { FieldBase } from 'payload'
import { mapPickerLabels } from '@/i18n/admin'
import type { LocalizedLabel } from '@/i18n/admin'
import './index.scss'
import { CrosshairIcon, RefreshCcwIcon } from 'lucide-react'
import { createClientLogger } from '@/plugins/logging/client'

const logger = createClientLogger('map-picker')

// Dynamic imports for Leaflet to avoid SSR issues
let L: any = null
let MapContainer: any = null
let TileLayer: any = null
let Marker: any = null
let useMapEvents: any = null

// Default center coordinates (Bulgaria)
const DEFAULT_CENTER: [number, number] = [42.7339, 25.4858]
const DEFAULT_ZOOM = 7

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface MapPickerProps {
  path: string
  field: FieldBase
}

function useLabel(label: LocalizedLabel): string {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('bg') ? 'bg' : 'en'
  return label[lang]
}

const MapPicker: React.FC<MapPickerProps> = ({ path }) => {
  const [isClient, setIsClient] = useState(false)
  const [librariesLoaded, setLibrariesLoaded] = useState(false)
  const mapRef = useRef<any>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // i18n labels
  const searchPlaceholder = useLabel(mapPickerLabels.searchPlaceholder)
  const centerLabel = useLabel(mapPickerLabels.centerMap)
  const resetLabel = useLabel(mapPickerLabels.resetPosition)
  const searchErrorLabel = useLabel(mapPickerLabels.searchError)
  const noResultsLabel = useLabel(mapPickerLabels.noResults)

  // Get the latitude and longitude fields — they are siblings inside the same coordinates group
  const pathParts = path.split('.')
  pathParts.pop() // Remove 'mapPicker' to get the coordinates group path
  const parentPath = pathParts.join('.')

  const latitudePath = parentPath ? `${parentPath}.latitude` : 'latitude'
  const longitudePath = parentPath ? `${parentPath}.longitude` : 'longitude'

  const latitudeField = useField<number>({ path: latitudePath })
  const longitudeField = useField<number>({ path: longitudePath })

  const latitude = latitudeField.value
  const longitude = longitudeField.value

  // Current map position
  const [position, setPosition] = useState<[number, number]>(() => {
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      return [latitude, longitude]
    }
    return DEFAULT_CENTER
  })

  // Load Leaflet libraries dynamically
  useEffect(() => {
    setIsClient(true)

    const loadLibraries = async () => {
      try {
        L = (await import('leaflet')).default

        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        const reactLeaflet = await import('react-leaflet')
        MapContainer = reactLeaflet.MapContainer
        TileLayer = reactLeaflet.TileLayer
        Marker = reactLeaflet.Marker
        useMapEvents = reactLeaflet.useMapEvents

        setLibrariesLoaded(true)
      } catch (error) {
        logger.error('Error loading map libraries', { error: error instanceof Error ? error.message : String(error) })
      }
    }

    loadLibraries()
  }, [])

  // Update position when form values change
  useEffect(() => {
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      setPosition([latitude, longitude])
    }
  }, [latitude, longitude])

  // Update form field values
  const updateFormValues = useCallback((lat: number, lng: number) => {
    latitudeField.setValue(lat)
    longitudeField.setValue(lng)
  }, [latitudeField, longitudeField])

  // Nominatim search
  const searchNominatim = useCallback(async (query: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsSearching(true)
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '5',
        addressdetails: '1',
      })

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          headers: { 'User-Agent': 'DigitalTourismCMS/1.0 (admin-panel)' },
          signal: controller.signal,
        },
      )

      if (!response.ok) throw new Error('Search failed')
      const results: NominatimResult[] = await response.json()
      setSearchResults(results)
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error(searchErrorLabel)
        setSearchResults([])
      }
    } finally {
      setIsSearching(false)
    }
  }, [searchErrorLabel])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.length < 3) {
      setSearchResults([])
      return
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchNominatim(value)
    }, 500)
  }, [searchNominatim])

  const handleSelectResult = useCallback((result: NominatimResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    setPosition([lat, lng])
    updateFormValues(lat, lng)
    setSearchResults([])
    setSearchQuery('')

    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 14)
    }
  }, [updateFormValues])

  // Map event handler component
  const MapEventHandler = () => {
    useMapEvents({
      click: (e: any) => {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        updateFormValues(lat, lng)
      },
    })
    return null
  }

  // Draggable marker component
  const DraggableMarker = () => {
    const markerRef = useRef<any>(null)

    const eventHandlers = {
      dragend: () => {
        const marker = markerRef.current
        if (marker != null) {
          const { lat, lng } = marker.getLatLng()
          setPosition([lat, lng])
          updateFormValues(lat, lng)
        }
      },
    }

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      />
    )
  }

  // Center map on current position
  const centerMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(position, mapRef.current.getZoom())
    }
  }, [position])

  // Reset to default center
  const resetToDefault = useCallback(() => {
    setPosition(DEFAULT_CENTER)
    updateFormValues(DEFAULT_CENTER[0], DEFAULT_CENTER[1])
    if (mapRef.current) {
      mapRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
    }
  }, [updateFormValues])

  if (!isClient || !librariesLoaded) {
    return (
      <div className="map-picker">
        <div className="map-picker__loading">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="map-picker">
      <div className="map-picker__container">
        {/* Search overlay — top */}
        <div className="map-picker__search">
          <input
            type="text"
            className="map-picker__search-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isSearching && <div className="map-picker__search-spinner" />}
          {searchResults.length > 0 && (
            <ul className="map-picker__search-results">
              {searchResults.map((result) => (
                <li key={result.place_id} onClick={() => handleSelectResult(result)}>
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
          {searchQuery.length >= 3 && !isSearching && searchResults.length === 0 && (
            <div className="map-picker__search-results">
              <div className="map-picker__search-no-results">{noResultsLabel}</div>
            </div>
          )}
        </div>

        {/* Map */}
        <MapContainer
          center={position}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          className="map-picker__map"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker />
          <MapEventHandler />
        </MapContainer>

        {/* Button overlay — bottom right */}
        <div className="map-picker__map-controls">
          <button type="button" onClick={centerMap} title={centerLabel}>
             <CrosshairIcon className="w-4 h-4" />
          </button>
          <button type="button" onClick={resetToDefault} title={resetLabel}>
             <RefreshCcwIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapPicker
