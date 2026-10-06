'use server'

import { revalidatePath } from 'next/cache'
import type { Trip } from '@/payload-types'
import { getVisitorContext } from './actions'

/**
 * Atomically adds an experience to a specific day of a trip.
 * Used by the "Add to Trip" button on experience detail pages.
 */
export async function addExperienceToTripDay(
  tripId: string,
  dayIndex: number,
  collectionSlug: string,
  experienceId: number,
): Promise<{ success: boolean; reason?: string }> {
  const ctx = await getVisitorContext()
  if (!ctx) throw new Error('Unauthorized')
  const { user, payload } = ctx

  const trip = await payload.findByID({
    collection: 'trips',
    id: tripId,
    user,
    overrideAccess: false,
    depth: 0,
  })

  if (!trip) throw new Error('Trip not found')

  const days = trip.days ?? []
  if (dayIndex < 0 || dayIndex >= days.length) {
    throw new Error('Invalid day index')
  }

  const targetDay = days[dayIndex]
  // Check duplicate in target day
  const targetStops = targetDay?.stops ?? []
  const alreadyInDay = targetStops.some((s) => {
    const exp = s.experience as { relationTo?: string; value?: number | { id: number } }
    const val = typeof exp?.value === 'number' ? exp.value : (exp?.value as { id: number })?.id
    return exp?.relationTo === collectionSlug && val === experienceId
  })

  if (alreadyInDay) {
    return { success: false, reason: 'duplicate' }
  }

  // Build updated days array — only modify the target day
  const updatedDays = days.map((day, i) => {
    if (i !== dayIndex || !day) return day
    return {
      ...day,
      stops: [
        ...(day.stops ?? []),
        { experience: { relationTo: collectionSlug, value: experienceId } },
      ],
    }
  })

  await payload.update({
    collection: 'trips',
    id: tripId,
    user,
    overrideAccess: false,
    data: { days: updatedDays } as Partial<Trip>,
  })

  revalidatePath('/account/trips')
  return { success: true }
}
