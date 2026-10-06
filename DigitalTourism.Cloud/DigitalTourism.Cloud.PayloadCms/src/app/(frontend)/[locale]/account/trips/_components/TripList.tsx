'use client'

import React from 'react'
import { Button, Pill, StatusDot } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

type Trip = {
  id: string
  name: string
  startDate: string
  duration: number
}

type Props = {
  trips: Trip[]
  onDeleteTrip: (id: string) => void
  locale: string
}

export function TripList({ trips, onDeleteTrip, locale }: Props) {
  const t = useTranslations('tripPlanner')
  const router = useRouter()

  const formatDate = (dateString: string, loc: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(loc, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getEndDate = (startDate: string, duration: number) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + duration - 1)
    return date
  }

  const getDaysUntilTrip = (startDate: string) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => {
        const daysUntil = getDaysUntilTrip(trip.startDate)
        const endDate = getEndDate(trip.startDate, trip.duration)
        const isPast = daysUntil < 0
        const isOngoing = daysUntil <= 0 && daysUntil > -trip.duration
        const isUpcoming = daysUntil > 0 && daysUntil <= 7

        return (
          <div
            key={trip.id}
            onClick={() => router.push(`/${locale}/account/trips/${trip.id}`)}
            className={`
              group relative cursor-pointer rounded-2xl overflow-hidden
              bg-white border border-slate-200/80
              shadow-sm hover:shadow-xl hover:shadow-primary/5
              transition-all duration-300 ease-out
              hover:-translate-y-1 hover:border-primary/20
            `}
          >
            {/* Top decorative gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />

            {/* Status Badge */}
            {(isOngoing || isUpcoming || isPast) && (
              <div className="absolute top-4 right-4 z-10">
                {isOngoing && (
                  <Pill variant="success" size="sm" className="gap-1.5 font-semibold">
                    <StatusDot color="success" size="xs" pulse />
                    {t('ongoing')}
                  </Pill>
                )}
                {isUpcoming && !isOngoing && (
                  <Pill variant="warning" size="sm" className="gap-1.5 font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {t('inDays', { days: daysUntil })}
                  </Pill>
                )}
                {isPast && !isOngoing && (
                  <Pill variant="default" size="sm" className="font-semibold">
                    {t('completed')}
                  </Pill>
                )}
              </div>
            )}

            {/* Card Content */}
            <div className="p-5">
              {/* Trip Name */}
              <h3 className="text-lg font-bold text-slate-800 mb-4 pr-24 group-hover:text-primary transition-colors line-clamp-2">
                {trip.name}
              </h3>

              {/* Trip Details */}
              <div className="space-y-3">
                {/* Duration */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {trip.duration} {t('days', { count: trip.duration })}
                    </p>
                    <p className="text-xs text-muted-foreground">{t('tripDuration')}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-500"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M3 10h18" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(trip.startDate, locale)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      → {formatDate(endDate.toISOString(), locale)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/${locale}/account/trips/${trip.id}`)
                  }}
                  className="flex-1 gap-2 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                  </svg>
                  {t('editPlan')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteTrip(trip.id)
                  }}
                  className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        )
      })}
    </div>
  )
}
