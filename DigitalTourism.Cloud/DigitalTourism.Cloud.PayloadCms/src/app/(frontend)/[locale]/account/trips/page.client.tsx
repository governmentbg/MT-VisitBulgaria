'use client'

import React, { useState } from 'react'
import { ConfirmDialog } from '@/components/ui'
import { deleteTrip, createTrip } from './actions'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import {
  TripCardGrid,
  TripListHeader,
  TripEmptyState,
  CreateTripDialog,
  type TripSummary,
  type TripStatus,
} from '@/components/trips'

type Props = {
  locale: string
  initialTrips: any[]
}

function toTripSummary(trip: any): TripSummary {
  const stopCount = trip.days?.reduce(
    (sum: number, day: any) => sum + (day.stops?.length || 0),
    0,
  ) ?? 0

  let status: TripStatus = 'draft'
  if (trip.startDate) {
    const start = new Date(trip.startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + (trip.duration || 1) - 1)
    const now = new Date()
    if (now > end) status = 'completed'
    else if (now >= start) status = 'ongoing'
    else status = 'upcoming'
  }

  return {
    id: trip.id,
    name: trip.name,
    startDate: trip.startDate,
    duration: trip.duration || 1,
    status,
    dayCount: trip.days?.length || trip.duration || 1,
    stopCount,
  }
}

export default function PlanYourTripClient({
  locale,
  initialTrips
}: Props) {
  const [trips, setTrips] = useState(initialTrips)
  const [createOpen, setCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean
    tripId: string | null
    tripName: string
  }>({ show: false, tripId: null, tripName: '' })
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const t = useTranslations('tripPlanner')

  const handleCreateTrip = async (data: { name: string; startDate: string; endDate: string }) => {
    setIsSubmitting(true)
    try {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      const duration = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      const newTrip = await createTrip({ name: data.name, startDate: data.startDate, duration })
      setTrips([newTrip, ...trips])
      setCreateOpen(false)
      router.push(`/${locale}/account/trips/${newTrip.id}`)
    } catch (error) {
      console.error('Failed to create trip', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenTrip = (trip: TripSummary) => {
    router.push(`/${locale}/account/trips/${trip.id}`)
  }

  const handleDeleteTrip = (trip: TripSummary) => {
    setDeleteConfirm({ show: true, tripId: trip.id, tripName: trip.name })
  }

  const [downloadingTripId, setDownloadingTripId] = useState<string | null>(null)

  const handleDownloadTrip = async (trip: TripSummary) => {
    setDownloadingTripId(trip.id)
    try {
      const response = await fetch(`/api/print-itinerary/${trip.id}?locale=${locale}`)
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Itinerary-${trip.name}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download PDF', error)
    } finally {
      setDownloadingTripId(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.tripId) return
    setIsDeleting(true)
    try {
      await deleteTrip(deleteConfirm.tripId)
      setTrips(trips.filter((t: any) => t.id !== deleteConfirm.tripId))
    } finally {
      setIsDeleting(false)
      setDeleteConfirm({ show: false, tripId: null, tripName: '' })
    }
  }

  const tripSummaries = trips.map(toTripSummary)

  return (
    <>
      <div className="min-h-[70vh] py-4">
        {trips.length === 0 ? (
          <TripEmptyState onCreateTrip={() => setCreateOpen(true)} />
        ) : (
          <div className="flex flex-col gap-2">
            <TripListHeader
              title={t('myTrips')}
              subtitle={t('subtitle')}
              buttonLabel={t('createTrip')}
              onCreateTrip={() => setCreateOpen(true)}
            />

            <TripCardGrid
              trips={tripSummaries}
              onOpenTrip={handleOpenTrip}
              onDeleteTrip={handleDeleteTrip}
              onDownloadTrip={handleDownloadTrip}
              downloadingTripId={downloadingTripId}
            />
          </div>
        )}
      </div>

      <CreateTripDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateTrip}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        open={deleteConfirm.show}
        onOpenChange={(open) =>
          !open && setDeleteConfirm({ show: false, tripId: null, tripName: '' })
        }
        title={t('deleteTrip')}
        description={t('areYouSureDelete', { tripName: deleteConfirm.tripName })}
        confirmText={t('confirmDelete')}
        cancelText={t('cancel')}
        variant="destructive"
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </>
  )
}
