'use client'

import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { useMemo } from 'react'
import type { CityCluster } from '../types'

interface CityMarkerProps {
  cluster: CityCluster
  onZoomToCity?: (lat: number, lng: number, zoom: number) => void
}

function createCityIcon(city: string, count: number, previewImageUrl?: string) {
  const imageHtml = previewImageUrl
    ? `<img src="${previewImageUrl}" alt="${city}" style="width:100%;height:100%;object-fit:cover;" />`
    : `<div style="width:100%;height:100%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:20px;font-weight:bold;">${city.charAt(0)}</div>`

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
      <div style="width:80px;border-radius:16px;overflow:hidden;background:white;border:2px solid white;">
        <div style="width:80px;height:60px;overflow:hidden;border-radius:14px 14px 0 0;">
          ${imageHtml}
        </div>
        <div style="padding:4px 6px;text-align:center;">
          <div style="font-size:11px;font-weight:700;line-height:1.2;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:system-ui,sans-serif;">${city}</div>
        </div>
      </div>
      <div style="position:absolute;top:-8px;right:-8px;min-width:22px;height:22px;border-radius:11px;background:#008577;color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 6px;border:2px solid white;font-family:system-ui,sans-serif;">${count}</div>
      <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid white;margin-top:-1px;"></div>
    </div>
  `

  return L.divIcon({
    className: 'city-marker',
    html,
    iconSize: [80, 98],
    iconAnchor: [40, 98],
  })
}

export function CityMarker({ cluster, onZoomToCity }: CityMarkerProps) {
  const icon = useMemo(
    () => createCityIcon(cluster.city, cluster.count, cluster.previewImageUrl),
    [cluster.city, cluster.count, cluster.previewImageUrl],
  )

  return (
    <Marker
      position={[cluster.location.lat, cluster.location.lng]}
      icon={icon}
      eventHandlers={{
        click: () => {
          onZoomToCity?.(cluster.location.lat, cluster.location.lng, 13)
        },
      }}
    />
  )
}
