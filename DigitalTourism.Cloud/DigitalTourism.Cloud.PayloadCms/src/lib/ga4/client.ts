/**
 * Client-side GA4 tracking functions
 * Safe to import in browser/client components
 */

import type { ExperienceViewEvent } from './types'

// Re-export types that are safe for client use
export * from './types'

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, unknown>,
    ) => void
    dataLayer?: unknown[]
  }
}

/**
 * Track an experience view event with custom dimensions
 * This is called from the client-side ExperienceTracker component
 */
export function trackExperienceView(event: ExperienceViewEvent): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  window.gtag('event', 'item_view', {
    item_id: event.item_id,
    item_type: event.item_type,
    owner_id: event.owner_id,
    city_id: event.city_id,
    municipality_id: event.municipality_id,
  })
}

/**
 * Track a generic event
 */
export function trackEvent(eventName: string, params: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  window.gtag('event', eventName, params)
}

/**
 * Get GA4 configuration from environment variables (client-safe)
 */
export function getGA4MeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''
}
