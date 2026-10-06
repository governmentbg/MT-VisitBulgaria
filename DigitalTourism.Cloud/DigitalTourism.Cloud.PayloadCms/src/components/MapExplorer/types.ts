export interface MapExplorerPOI {
  id: string
  title: string
  slug: string
  type: string
  categories?: string[]
  location: { lat: number; lng: number }
  city?: string
  address?: string
  heroImageUrl?: string
  heroImageAlt?: string
}

export interface CityCluster {
  city: string
  count: number
  location: { lat: number; lng: number }
  previewImageUrl?: string
}

export type ZoomLevel = 'country' | 'city'

export type MapViewportBounds = {
  northEast: { lat: number; lng: number }
  southWest: { lat: number; lng: number }
}

export const DEFAULT_ZOOM_THRESHOLD = 12

export function getZoomLevel(zoom: number, threshold = DEFAULT_ZOOM_THRESHOLD): ZoomLevel {
  if (zoom < threshold) return 'country'
  return 'city'
}
