'use client'

import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import { useTranslations } from 'next-intl'
import { generateId, unwrapExperience } from '../utils/tripDataUtils'

interface UseTripInitOptions {
  trip: any
  setItems: Dispatch<SetStateAction<Record<string, string[]>>>
  setStopData: Dispatch<SetStateAction<Record<string, { experience: any; note?: string }>>>
}

export function useTripInit({ trip, setItems, setStopData }: UseTripInitOptions) {
  const t = useTranslations('tripPlanner')
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    const newItems: Record<string, string[]> = {}
    const newStopData: Record<string, any> = {}
    const usedExperienceIds = new Set<string>()

    trip.days?.forEach((day: any) => {
      day.stops?.forEach((s: any) => {
        const unwrapped = unwrapExperience(s.experience)
        const expId = typeof unwrapped === 'object' ? unwrapped?.id : unwrapped
        if (expId) usedExperienceIds.add(String(expId))
      })
    })

    // Sidebar pool
    const sidebarIds: string[] = []
    const sidebarExperienceIds = new Set<string>()

    trip.pool?.forEach((p: any) => {
      const unwrapped = unwrapExperience(p.experience)
      const rawExpId = typeof unwrapped === 'object' ? unwrapped?.id : unwrapped
      const expId = rawExpId ? String(rawExpId) : null
      if (!expId || usedExperienceIds.has(expId) || sidebarExperienceIds.has(expId)) return
      const uid = generateId()
      sidebarIds.push(uid)
      sidebarExperienceIds.add(expId)
      newStopData[uid] = { experience: unwrapped }
    })
    newItems['favorites'] = sidebarIds

    // Days
    trip.days.forEach((day: any) => {
      const dayId = `day-${day.dayNumber}`
      const dayStopIds: string[] = []
      day.stops.forEach((s: any) => {
        const uid = generateId()
        dayStopIds.push(uid)
        const unwrapped = unwrapExperience(s.experience)
        const exp = typeof unwrapped === 'object' ? unwrapped : { id: unwrapped, title: t('unknown') }
        newStopData[uid] = { experience: exp, note: s.note }
      })
      newItems[dayId] = dayStopIds
    })

    setItems(newItems)
    setStopData(newStopData)
  }, [trip, setItems, setStopData, t])
}
