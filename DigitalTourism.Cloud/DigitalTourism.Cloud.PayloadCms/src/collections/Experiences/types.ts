/**
 * Shared Experience Types
 *
 * Union type for any experience document across all per-type collections.
 */

import type { Hotel, Restaurant, Activity, Attraction, Event } from '@/payload-types'

/**
 * Union type for any experience document.
 */
export type AnyExperience = Hotel | Restaurant | Activity | Attraction | Event
