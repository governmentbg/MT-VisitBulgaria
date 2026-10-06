'use client'

import { useMap } from 'react-leaflet'
import { useCallback } from 'react'
import { cn } from '@/components/ui/theme/cn'

interface MapControlsProps {
  className?: string
}

function ControlButton({
  onClick,
  label,
  children,
  className,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-10 w-10 items-center justify-center text-grey-600 transition-colors hover:bg-grey-50 hover:text-grey-900',
        className,
      )}
      aria-label={label}
    >
      {children}
    </button>
  )
}

export function MapControls({ className }: MapControlsProps) {
  const map = useMap()

  const handleZoomIn = useCallback(() => map.zoomIn(), [map])
  const handleZoomOut = useCallback(() => map.zoomOut(), [map])

  const handleMyLocation = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 14, { duration: 0.8 })
      },
      () => {
        // silently fail if denied
      },
    )
  }, [map])

  return (
    <div
      className={cn(
        'absolute bottom-8 right-4 z-[1000] flex flex-col overflow-hidden rounded-xl border border-grey-200 bg-white shadow-lg',
        className,
      )}
    >
      <ControlButton onClick={handleZoomIn} label="Zoom in">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </ControlButton>
      <div className="h-px bg-grey-200" />
      <ControlButton onClick={handleMyLocation} label="My location">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      </ControlButton>
      <div className="h-px bg-grey-200" />
      <ControlButton onClick={handleZoomOut} label="Zoom out">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
        </svg>
      </ControlButton>
    </div>
  )
}
