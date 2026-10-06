import type { ExperienceSlug } from '@/collections/Experiences/constants'

export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'draft'

export interface TripSummary {
  id: string
  name: string
  startDate: string
  duration: number
  status: TripStatus
  dayCount: number
  stopCount: number
}

export interface TripStop {
  experience: {
    relationTo: ExperienceSlug
    value: number | Record<string, unknown>
  }
  note?: string
}

export interface TripDay {
  dayNumber: number
  stops: TripStop[]
}

export interface DestinationItemData {
  id: string | number
  /** Unique sortable ID for drag-and-drop (may differ from experience id) */
  uid?: string
  title: string
  slug?: string
  address?: string
  category?: string
  imageUrl?: string
  coordinates?: { lat: number; lng: number }
  type?: ExperienceSlug
}
