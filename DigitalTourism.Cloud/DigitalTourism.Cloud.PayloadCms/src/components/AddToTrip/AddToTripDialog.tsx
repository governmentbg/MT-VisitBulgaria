'use client'

import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronDownRegular, ChevronRightRegular, AddRegular } from '@fluentui/react-icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Spinner,
} from '@/components/ui'
import { getMyTrips } from '@/app/(frontend)/[locale]/account/trips/actions'
import { addExperienceToTripDay } from '@/app/(frontend)/[locale]/account/trips/addExperienceToTripDay'
import type { Trip } from '@/payload-types'

export interface AddToTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionSlug: string
  experienceId: number
}

export function AddToTripDialog({
  open,
  onOpenChange,
  collectionSlug,
  experienceId,
}: AddToTripDialogProps) {
  const t = useTranslations('addToTrip')
  const locale = useLocale()
  const router = useRouter()

  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedTripId, setExpandedTripId] = useState<string | number | null>(null)
  const [addingDay, setAddingDay] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    try {
      const docs = await getMyTrips(locale, null, { depth: 0 })
      setTrips(docs as Trip[])
    } catch {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }, [locale, t])

  useEffect(() => {
    if (open) {
      fetchTrips()
      setExpandedTripId(null)
    }
  }, [open, fetchTrips])

  const isDuplicateInDay = (trip: Trip, dayIndex: number): boolean => {
    const stops = trip.days?.[dayIndex]?.stops ?? []
    return stops.some((s) => {
      const exp = s.experience as { relationTo?: string; value?: number | { id: number } }
      const val = typeof exp?.value === 'number' ? exp.value : (exp?.value as { id: number })?.id
      return exp?.relationTo === collectionSlug && val === experienceId
    })
  }

  const handleAdd = (tripId: number, tripName: string, dayIndex: number) => {
    const key = `${tripId}_${dayIndex}`
    setAddingDay(key)

    startTransition(async () => {
      try {
        const result = await addExperienceToTripDay(
          String(tripId),
          dayIndex,
          collectionSlug,
          experienceId,
        )
        if (result.success) {
          toast.success(t('addedToDay', { tripName, day: dayIndex + 1 }))
          onOpenChange(false)
        } else if (result.reason === 'duplicate') {
          toast.info(t('alreadyInTrip'))
          await fetchTrips()
        }
      } catch {
        toast.error(t('error'))
      } finally {
        setAddingDay(null)
      }
    })
  }

  const formatDate = (dateStr: string, dayIndex: number): string => {
    try {
      const start = new Date(dateStr)
      const dayDate = new Date(start)
      dayDate.setDate(dayDate.getDate() + dayIndex)
      return dayDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
    } catch {
      return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('dialogTitle')}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : trips.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-grey-500">{t('noTrips')}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {trips.map((trip) => {
                const isExpanded = expandedTripId === trip.id
                const days = trip.days ?? []
                return (
                  <div key={trip.id} className="rounded-lg border border-grey-200">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-grey-50"
                      onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                    >
                      {isExpanded ? (
                        <ChevronDownRegular className="h-4 w-4 flex-shrink-0 text-grey-500" />
                      ) : (
                        <ChevronRightRegular className="h-4 w-4 flex-shrink-0 text-grey-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-heading text-sm font-semibold text-grey-900">
                          {trip.name}
                        </p>
                        <p className="text-xs text-grey-500">
                          {trip.duration} {t('days', { count: trip.duration })}
                        </p>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-grey-100 px-3 pb-2">
                        {days.map((day, dayIndex) => {
                          if (!day) return null
                          const duplicate = isDuplicateInDay(trip, dayIndex)
                          const dayKey = `${trip.id}_${dayIndex}`
                          const isAdding = addingDay === dayKey

                          return (
                            <div
                              key={dayIndex}
                              className="flex items-center justify-between py-1.5 pl-6"
                            >
                              <span className="text-sm text-grey-700">
                                {t('dayTitle', { day: dayIndex + 1 })}
                                {trip.startDate && (
                                  <span className="ml-1 text-grey-400">
                                    ({formatDate(trip.startDate, dayIndex)})
                                  </span>
                                )}
                              </span>
                              {duplicate ? (
                                <span className="text-xs text-grey-400">{t('alreadyInTrip')}</span>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  icon={null}
                                  disabled={isAdding || isPending}
                                  onClick={() => handleAdd(trip.id, trip.name, dayIndex)}
                                  className="h-8 w-8 rounded-full p-0"
                                >
                                  {isAdding ? (
                                    <Spinner className="h-3.5 w-3.5" />
                                  ) : (
                                    <AddRegular className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Create new trip */}
        <div className="mt-3 border-t border-grey-100 pt-3">
          <Button
            variant="ghost"
            icon={null}
            onClick={() => {
              onOpenChange(false)
              router.push(`/${locale}/account/trips`)
            }}
            className="w-full justify-start gap-2 px-3 text-sm font-medium text-primary-700"
          >
            <AddRegular className="h-4 w-4" />
            {t('createNew')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
