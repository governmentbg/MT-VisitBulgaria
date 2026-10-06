'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import type { AnyExperience } from '@/collections/Experiences/types'

const LocationMapClient = dynamic(
  () =>
    import('./LocationMapClient').then((m) => ({
      default: m.LocationMapClient,
    })),
  { ssr: false },
)

interface ExperienceLocationProps {
  location: AnyExperience['location']
  labels: {
    address: string
    getDirections: string
  }
}

export const ExperienceLocation: React.FC<ExperienceLocationProps> = ({
  location,
  labels,
}) => {
  if (!location) return null

  const { address, coordinates } = location
  const hasCoordinates = coordinates?.latitude && coordinates?.longitude

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      {hasCoordinates && (
        <div className="aspect-video relative animate-pulse bg-grey-100 [&:has(.leaflet-container)]:animate-none [&:has(.leaflet-container)]:bg-transparent">
          <LocationMapClient
            center={[coordinates.latitude, coordinates.longitude]}
            zoom={13}
            directionsLabel={labels.getDirections}
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {labels.address}
            </div>
            <p className="text-sm">{address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
