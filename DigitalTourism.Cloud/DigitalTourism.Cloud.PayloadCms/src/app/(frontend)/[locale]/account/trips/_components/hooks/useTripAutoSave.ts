'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { updateTrip } from '../../actions'
import { parseExperienceId } from '../utils/tripDataUtils'
import type { ExperienceSlug } from '@/collections/Experiences/constants'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface UseTripAutoSaveOptions {
  tripId: string
  items: Record<string, string[]>
  stopData: Record<string, { experience: any; note?: string }>
  duration: number
  isDragging: boolean
}

export interface UseTripAutoSaveReturn {
  isSaving: boolean
  markDirty: () => void
  saveNow: () => Promise<void>
}

export function useTripAutoSave({
  tripId,
  items,
  stopData,
  duration,
  isDragging,
}: UseTripAutoSaveOptions): UseTripAutoSaveReturn {
  const t = useTranslations('tripPlanner')
  const [isSaving, setIsSaving] = useState(false)
  const hasChanges = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Refs to latest state so the save timer closure always reads current values
  const itemsRef = useRef(items)
  itemsRef.current = items
  const stopDataRef = useRef(stopData)
  stopDataRef.current = stopData
  const durationRef = useRef(duration)
  durationRef.current = duration

  const markDirty = useCallback(() => {
    hasChanges.current = true
  }, [])

  const executeSave = useCallback(async () => {
    const currentItems = itemsRef.current
    const currentStopData = stopDataRef.current
    const currentDuration = durationRef.current

    const daysPayload = []
    for (let i = 1; i <= currentDuration; i++) {
      const dayId = `day-${i}`
      const stops = (currentItems[dayId] || [])
        .map((uid) => {
          const exp = currentStopData[uid]?.experience
          if (!exp?.id) return null
          const parsed = parseExperienceId(exp)
          if (!parsed) return null
          return {
            experience: { relationTo: parsed.relationTo, value: parsed.numericId },
            note: currentStopData[uid].note || '',
          }
        })
        .filter(
          (stop): stop is { experience: { relationTo: ExperienceSlug; value: number }; note: string } =>
            stop !== null,
        )
      daysPayload.push({ dayNumber: i, stops })
    }

    const poolPayload = (currentItems['favorites'] || [])
      .map((uid) => {
        const exp = currentStopData[uid]?.experience
        if (!exp?.id) return null
        const parsed = parseExperienceId(exp)
        if (!parsed) return null
        return { experience: { relationTo: parsed.relationTo, value: parsed.numericId } }
      })
      .filter(
        (item): item is { experience: { relationTo: ExperienceSlug; value: number } } => item !== null,
      )

    try {
      await updateTrip(tripId, { duration: currentDuration, days: daysPayload, pool: poolPayload })
    } catch (error) {
      console.error('Save error:', error)
      const message = error instanceof Error ? error.message : 'Failed to save trip'
      if (message.includes('no longer exist')) {
        toast.error(t('someExperiencesUnavailable'), {
          description: t('searchIndexOutdated'),
          duration: 6000,
        })
      } else {
        toast.error(t('saveFailed'), { description: message, duration: 4000 })
      }
    }
  }, [tripId, t])

  const saveNow = useCallback(async () => {
    if (!hasChanges.current) return
    setIsSaving(true)
    await executeSave()
    setIsSaving(false)
    hasChanges.current = false
  }, [executeSave])

  // Schedule auto-save when changes happen but NOT during drag
  useEffect(() => {
    if (isDragging) return
    if (!hasChanges.current) return

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      if (!hasChanges.current) return
      setIsSaving(true)
      await executeSave()
      setIsSaving(false)
      hasChanges.current = false
    }, 1000)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [isDragging, executeSave])

  // Trigger save check when state changes (items, stopData, duration)
  useEffect(() => {
    if (!isDragging && hasChanges.current) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(async () => {
        if (!hasChanges.current) return
        setIsSaving(true)
        await executeSave()
        setIsSaving(false)
        hasChanges.current = false
      }, 1000)
    }
  }, [items, stopData, duration, isDragging, executeSave])

  return { isSaving, markDirty, saveNow }
}
