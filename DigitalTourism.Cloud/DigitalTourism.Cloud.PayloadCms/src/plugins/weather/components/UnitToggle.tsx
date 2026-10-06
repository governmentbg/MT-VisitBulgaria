'use client'

import React from 'react'
import { cn } from '@/components/ui'
import type { UnitSystem } from '../types'

interface UnitToggleProps {
  currentUnit: UnitSystem
  onToggle?: (newUnit: UnitSystem) => void
  className?: string
}

/**
 * Client-side unit toggle button
 *
 * Toggles between metric and imperial units by setting a cookie
 * and calling the onToggle callback to update local state.
 */
export function UnitToggle({ currentUnit, onToggle, className }: UnitToggleProps) {
  const toggleUnit = () => {
    const newUnit = currentUnit === 'metric' ? 'imperial' : 'metric'

    // Set cookie for 1 year
    document.cookie = `weather-unit=${newUnit};path=/;max-age=${365 * 24 * 60 * 60}`

    // Call callback to update parent state
    onToggle?.(newUnit)
  }

  return (
    <button
      onClick={toggleUnit}
      className={cn(
        'text-xs text-muted-foreground hover:text-foreground transition-colors',
        className,
      )}
      title={`Switch to ${currentUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
      aria-label={`Currently showing ${currentUnit === 'metric' ? 'Celsius' : 'Fahrenheit'}. Click to switch.`}
    >
      <span className={currentUnit === 'metric' ? 'text-foreground' : ''}>°C</span>
      <span className="mx-0.5 text-muted-foreground/50">/</span>
      <span className={currentUnit === 'imperial' ? 'text-foreground' : ''}>°F</span>
    </button>
  )
}
