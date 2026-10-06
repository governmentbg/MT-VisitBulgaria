'use client'

import { useState, useMemo, useCallback, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useFavorites } from '@/components/favorites/useFavorites'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'
import { generateId, buildFavoriteKey } from '../utils/tripDataUtils'
import type { MarkerData } from '../Map'
import type { TripDay, DestinationItemData } from '@/components/trips'
import type { ExperienceSlug } from '@/collections/Experiences/constants'
interface UseTripDestinationsOptions {
  items: Record<string, string[]>
  setItems: Dispatch<SetStateAction<Record<string, string[]>>>
  stopData: Record<string, { experience: any; note?: string }>
  setStopData: Dispatch<SetStateAction<Record<string, { experience: any; note?: string }>>>
  duration: number
  locale: string
  tripId: string
  tripName: string
  tripStartDate: string | null
  addDialogDay: number
  markDirty: () => void
  setAddDialogOpen: (open: boolean) => void
}

export interface UseTripDestinationsReturn {
  // CRUD
  handleAddToDay: (destination: DestinationItemData) => void
  handleDeleteDestination: (destination: DestinationItemData) => void
  handleMoveToDay: (destination: DestinationItemData, targetDay: number) => void
  handleViewInfo: (destination: DestinationItemData) => void
  // Favorites
  handleToggleFavorite: (destination: DestinationItemData) => void
  checkIsFavorite: (destination: DestinationItemData) => boolean
  // Derived data
  visibleMarkers: MarkerData[]
  tripDays: TripDay[]
  dateRange: string
  // Actions
  handleDownloadPdf: () => Promise<void>
  isDownloadingPdf: boolean
}

export function useTripDestinations({
  items,
  setItems,
  stopData,
  setStopData,
  duration,
  locale,
  tripId,
  tripName,
  tripStartDate,
  addDialogDay,
  markDirty,
  setAddDialogOpen,
}: UseTripDestinationsOptions): UseTripDestinationsReturn {
  const t = useTranslations('tripPlanner')
  const { toggleFavorite, isFavorite: isFavoriteById } = useFavorites()

  const handleToggleFavorite = useCallback(
    (destination: DestinationItemData) => {
      const key = buildFavoriteKey(destination)
      if (!key) return
      toggleFavorite(key)
    },
    [toggleFavorite],
  )

  const checkIsFavorite = useCallback(
    (destination: DestinationItemData): boolean => {
      const key = buildFavoriteKey(destination)
      if (!key) return false
      return isFavoriteById(key)
    },
    [isFavoriteById],
  )

  // CRUD
  const handleAddToDay = useCallback(
    (destination: DestinationItemData) => {
      const uid = generateId()
      const dayId = `day-${addDialogDay}`

      setStopData((prev) => ({
        ...prev,
        [uid]: {
          experience: {
            id: destination.id,
            title: destination.title,
            slug: destination.slug,
            type: destination.type || destination.category,
            location: destination.coordinates
              ? { coordinates: { latitude: destination.coordinates.lat, longitude: destination.coordinates.lng } }
              : undefined,
            heroImage: destination.imageUrl ? { url: destination.imageUrl } : undefined,
          },
        },
      }))
      setItems((prev) => ({
        ...prev,
        [dayId]: [...(prev[dayId] || []), uid],
      }))
      markDirty()
      setAddDialogOpen(false)
      toast.success(t('addedToDay', { day: addDialogDay }))
    },
    [addDialogDay, markDirty, setAddDialogOpen, setItems, setStopData, t],
  )

  const handleDeleteDestination = useCallback(
    (destination: DestinationItemData) => {
      const targetUid = destination.uid!
      setItems((prev) => {
        const next = { ...prev }
        for (const key of Object.keys(next)) {
          if (next[key].includes(targetUid)) {
            next[key] = next[key].filter((uid) => uid !== targetUid)
            break
          }
        }
        return next
      })
      markDirty()
    },
    [markDirty, setItems],
  )

  const handleMoveToDay = useCallback(
    (destination: DestinationItemData, targetDay: number) => {
      const destId = String(destination.id)
      setItems((prev) => {
        const next = { ...prev }
        let movedUid: string | null = null
        for (const key of Object.keys(next)) {
          const idx = next[key].findIndex((uid) => {
            const exp = stopData[uid]?.experience
            return String(exp?.id) === destId
          })
          if (idx !== -1) {
            movedUid = next[key][idx]
            next[key] = [...next[key].slice(0, idx), ...next[key].slice(idx + 1)]
            break
          }
        }
        if (movedUid) {
          const targetId = `day-${targetDay}`
          next[targetId] = [...(next[targetId] || []), movedUid]
        }
        return next
      })
      markDirty()
      toast.success(t('movedToDay', { day: targetDay }))
    },
    [stopData, markDirty, setItems, t],
  )

  const handleViewInfo = useCallback(
    (destination: DestinationItemData) => {
      const type = destination.type
      const slug = destination.slug
      if (slug && type) {
        window.open(`/${locale}${buildExperienceUrl(type, slug)}`, '_blank')
      }
    },
    [locale],
  )

  // Derived data — markers only include pin-rendering data, popup fetches on demand
  const visibleMarkers = useMemo((): MarkerData[] => {
    const markers: MarkerData[] = []
    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      const dayId = `day-${dayNum}`
      const uids = items[dayId] || []
      uids.forEach((uid) => {
        const data = stopData[uid]
        if (!data?.experience) return
        const coords =
          data.experience.location?.coordinates ||
          data.experience.city?.coordinates ||
          data.experience.coordinates
        if (!coords) return
        const city = data.experience.city?.name
        const address = data.experience.location?.address
        markers.push({
          id: uid,
          lat: coords.latitude || coords.lat,
          lng: coords.longitude || coords.lng,
          title: data.experience.title || t('unknown'),
          dayNumber: dayNum,
          imageUrl: data.experience.heroImage?.sizes?.thumbnail?.url || data.experience.heroImage?.url || null,
          experienceId: String(data.experience.id),
          experienceType: data.experience.type || 'attractions',
          experienceSlug: data.experience.slug,
          experienceCategory: data.experience.type,
          experienceLocation: [city, address].filter(Boolean).join(', ') || undefined,
        })
      })
    }
    return markers
  }, [items, stopData, duration, t])

  const tripDays: TripDay[] = useMemo(() => {
    return Array.from({ length: duration }, (_, i) => {
      const dayId = `day-${i + 1}`
      const uids = items[dayId] || []
      return {
        dayNumber: i + 1,
        stops: uids.map((uid) => {
          const data = stopData[uid]
          return {
            experience: {
              relationTo: (data?.experience?.type || 'attractions') as ExperienceSlug,
              value: data?.experience || {},
            },
            note: data?.note,
          }
        }),
      }
    })
  }, [items, stopData, duration])

  const dateRange = useMemo(() => {
    if (!tripStartDate) return ''
    const start = new Date(tripStartDate)
    const end = new Date(start)
    end.setDate(end.getDate() + duration - 1)
    const fmt = (d: Date) =>
      d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
    return `${fmt(start)} — ${fmt(end)}`
  }, [tripStartDate, duration, locale])

  // PDF
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  const handleDownloadPdf = useCallback(async () => {
    setIsDownloadingPdf(true)
    try {
      const response = await fetch(`/api/print-itinerary/${tripId}?locale=${locale}`)
      if (!response.ok) throw new Error('Failed to generate PDF')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Itinerary-${tripName}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success(t('pdfReady'))
    } catch (error) {
      console.error('Failed to download PDF', error)
      toast.error(t('downloadFailed'))
    } finally {
      setIsDownloadingPdf(false)
    }
  }, [tripId, tripName, locale, t])

  return {
    handleAddToDay,
    handleDeleteDestination,
    handleMoveToDay,
    handleViewInfo,
    handleToggleFavorite,
    checkIsFavorite,
    visibleMarkers,
    tripDays,
    dateRange,
    handleDownloadPdf,
    isDownloadingPdf,
  }
}
