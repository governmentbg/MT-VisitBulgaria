'use client'

import { useState, useMemo, useCallback, useRef, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { updateTrip } from '../../actions'

interface UseTripEditingOptions {
  tripId: string
  initialDuration: number
  initialName: string
  initialStartDate: string | null
  items: Record<string, string[]>
  setItems: Dispatch<SetStateAction<Record<string, string[]>>>
  markDirty: () => void
}

export interface UseTripEditingReturn {
  // Duration state
  duration: number
  handleDayCountChange: (delta: number) => void
  // Trip name
  tripName: string
  // Edit dialog
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  isEditSubmitting: boolean
  editDialogInitialValues: { name: string; startDate: string; endDate: string } | undefined
  handleEditTrip: (data: { name: string; startDate: string; endDate: string }) => Promise<void>
  // Orphan dialog
  orphanDialogOpen: boolean
  setOrphanDialogOpen: (open: boolean) => void
  confirmOrphans: () => Promise<void>
  cancelOrphans: () => void
  // Start date (may be mutated by edit)
  tripStartDate: string | null
}

export function useTripEditing({
  tripId,
  initialDuration,
  initialName,
  initialStartDate,
  items,
  setItems,
  markDirty,
}: UseTripEditingOptions): UseTripEditingReturn {
  const t = useTranslations('tripPlanner')

  const [duration, setDuration] = useState(initialDuration)
  const [tripName, setTripName] = useState(initialName)
  const [tripStartDate, setTripStartDate] = useState(initialStartDate)

  // Items ref for orphan checks (needs latest state without re-render dependency)
  const itemsRef = useRef(items)
  itemsRef.current = items

  // Orphan management
  const [orphanDialogOpen, setOrphanDialogOpen] = useState(false)
  const [pendingDuration, setPendingDuration] = useState<number | null>(null)
  const [pendingEditData, setPendingEditData] = useState<{
    name: string; startDate: string; endDate: string; duration: number
  } | null>(null)

  // Edit Trip Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  const updateDurationState = useCallback((newDuration: number) => {
    setDuration(newDuration)
    markDirty()
    setItems((prev) => {
      const next = { ...prev }
      for (let i = newDuration + 1; i <= 30; i++) delete next[`day-${i}`]
      for (let i = 1; i <= newDuration; i++) if (!next[`day-${i}`]) next[`day-${i}`] = []
      return next
    })
  }, [markDirty, setItems])

  const handleDayCountChange = useCallback((delta: number) => {
    const currentItems = itemsRef.current
    const newDuration = duration + delta
    if (newDuration < 1 || newDuration > 30) return

    if (delta < 0) {
      const daysToRemove = []
      for (let i = newDuration + 1; i <= duration; i++) {
        const dayId = `day-${i}`
        if (currentItems[dayId] && currentItems[dayId].length > 0) {
          daysToRemove.push(i)
        }
      }
      if (daysToRemove.length > 0) {
        setPendingDuration(newDuration)
        setOrphanDialogOpen(true)
        return
      }
    }
    updateDurationState(newDuration)
  }, [duration, updateDurationState])

  const confirmOrphans = useCallback(async () => {
    if (pendingEditData) {
      updateDurationState(pendingEditData.duration)
      try {
        await updateTrip(tripId, {
          name: pendingEditData.name,
          startDate: pendingEditData.startDate,
          duration: pendingEditData.duration,
        })
        setTripName(pendingEditData.name)
        setTripStartDate(pendingEditData.startDate)
      } catch {
        toast.error(t('saveFailed'))
      }
      setPendingEditData(null)
    } else if (pendingDuration !== null) {
      updateDurationState(pendingDuration)
    }
    setOrphanDialogOpen(false)
    setPendingDuration(null)
  }, [pendingEditData, pendingDuration, tripId, updateDurationState, t])

  const cancelOrphans = useCallback(() => {
    setOrphanDialogOpen(false)
    setPendingDuration(null)
    setPendingEditData(null)
  }, [])

  const handleEditTrip = useCallback(async (data: { name: string; startDate: string; endDate: string }) => {
    const newStart = new Date(data.startDate)
    const newEnd = new Date(data.endDate)
    const newDuration = Math.round((newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

    if (newDuration < duration) {
      const currentItems = itemsRef.current
      const hasOrphans = Array.from({ length: duration - newDuration }, (_, i) => newDuration + 1 + i)
        .some((dayNum) => {
          const dayId = `day-${dayNum}`
          return currentItems[dayId] && currentItems[dayId].length > 0
        })

      if (hasOrphans) {
        setPendingEditData({ ...data, duration: newDuration })
        setEditDialogOpen(false)
        setOrphanDialogOpen(true)
        return
      }
    }

    setIsEditSubmitting(true)
    try {
      await updateTrip(tripId, { name: data.name, startDate: data.startDate, duration: newDuration })
      setTripName(data.name)
      setTripStartDate(data.startDate)
      updateDurationState(newDuration)
      setEditDialogOpen(false)
    } catch {
      toast.error(t('saveFailed'))
    } finally {
      setIsEditSubmitting(false)
    }
  }, [duration, tripId, updateDurationState, t])

  const editDialogInitialValues = useMemo(() => {
    if (!tripStartDate) return undefined
    const start = new Date(tripStartDate)
    const end = new Date(start)
    end.setDate(end.getDate() + duration - 1)
    const fmt = (d: Date) => d.toISOString().split('T')[0]
    return { name: tripName, startDate: fmt(start), endDate: fmt(end) }
  }, [tripStartDate, tripName, duration])

  return {
    duration,
    handleDayCountChange,
    tripName,
    editDialogOpen,
    setEditDialogOpen,
    isEditSubmitting,
    editDialogInitialValues,
    handleEditTrip,
    orphanDialogOpen,
    setOrphanDialogOpen,
    confirmOrphans,
    cancelOrphans,
    tripStartDate,
  }
}
