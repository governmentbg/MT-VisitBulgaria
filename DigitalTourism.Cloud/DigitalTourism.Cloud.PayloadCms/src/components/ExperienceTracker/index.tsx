'use client'

import { useEffect, useRef } from 'react'
import { trackExperienceView } from '@/lib/ga4'
import type { DeepExperience } from '@/lib/payloadData'

interface ExperienceTrackerProps {
  experience: DeepExperience
  type?: string
}

/**
 * Tracks experience view events with GA4 custom dimensions.
 * This component should be placed on experience detail pages.
 * It fires once when the experience is first viewed.
 */
export function ExperienceTracker({ experience, type }: ExperienceTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current) {
      return
    }

    // Extract IDs from experience data (all relationships are guaranteed populated)
    const itemId = String(experience.id)
    const itemType = type || ''
    const ownerId = experience.createdBy ? String(experience.createdBy.id) : ''
    const cityId = experience.city ? String(experience.city.id) : ''
    const municipalityId = experience.city?.municipality ? String(experience.city.municipality.id) : ''

    // Track the experience view
    trackExperienceView({
      item_id: itemId,
      item_type: itemType,
      owner_id: ownerId,
      city_id: cityId,
      municipality_id: municipalityId,
    })

    hasTracked.current = true
  }, [experience, type])

  // This component doesn't render anything visible
  return null
}

export default ExperienceTracker
