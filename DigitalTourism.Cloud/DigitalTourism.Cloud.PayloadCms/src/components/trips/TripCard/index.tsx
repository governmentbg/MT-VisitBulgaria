'use client'

import { cn } from '@/components/ui/theme/cn'
import { Button } from '@/components/ui'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui'
import {
  MoreVerticalRegular,
  EyeRegular,
  DeleteRegular,
  ArrowDownloadRegular,
} from '@/components/ui/icons'
import { Spinner } from '@/components/ui'
import type { TripSummary } from '../types'
import { useTranslations, useLocale } from 'next-intl'

export interface TripCardProps {
  trip: TripSummary
  onOpen?: (trip: TripSummary) => void
  onDelete?: (trip: TripSummary) => void
  onDownload?: (trip: TripSummary) => void
  isDownloading?: boolean
  /** @deprecated Use onOpen instead */
  onEdit?: (trip: TripSummary) => void
  className?: string
}

const formatDateRange = (startDate: string, duration: number, locale: string, daysLabel: string) => {
  try {
    const start = new Date(startDate)
    const end = new Date(startDate)
    end.setDate(end.getDate() + duration - 1)

    const startDay = start.getDate()
    const endDay = end.getDate()
    const month = start.toLocaleDateString(locale, { month: 'long' })
    const year = start.getFullYear()

    if (duration === 1) {
      return `${startDay} ${month} ${year} · 1 ${daysLabel}`
    }
    return `${startDay}–${endDay} ${month} ${year} · ${duration} ${daysLabel}`
  } catch {
    return startDate
  }
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onOpen,
  onDelete,
  onDownload,
  isDownloading = false,
  onEdit,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const locale = useLocale()
  const handleOpen = onOpen ?? onEdit

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => handleOpen?.(trip)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOpen?.(trip)
        }
      }}
      className={cn(
        'flex cursor-pointer flex-col gap-8 overflow-hidden rounded-xl border border-grey-100 bg-white p-6',
        className,
      )}
    >
      {/* Header: title + options */}
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h3 className="truncate font-heading text-xl font-bold leading-[1.3] text-grey-900">
            {trip.name}
          </h3>
          <p className="text-base leading-normal text-grey-500">
            {formatDateRange(trip.startDate, trip.duration, locale, t('days', { count: trip.duration }))}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex shrink-0 items-center justify-center rounded-full p-2 text-grey-500 transition-colors hover:bg-grey-50 hover:text-grey-700"
              aria-label="Options"
            >
              <MoreVerticalRegular className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-[30px] p-4 shadow-xl">
            {handleOpen && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); handleOpen(trip) }}
                className="gap-4 rounded-[10px] px-4 py-4 font-medium text-primary-900 hover:bg-primary-50"
              >
                <EyeRegular className="h-5 w-5" />
                {t('openTrip')}
              </DropdownMenuItem>
            )}
            {onDownload && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); if (!isDownloading) onDownload(trip) }}
                disabled={isDownloading}
                className={cn(
                  "gap-4 rounded-[10px] px-4 py-4 font-medium",
                  isDownloading && "cursor-not-allowed opacity-50"
                )}
              >
                {isDownloading ? <Spinner className="h-5 w-5" /> : <ArrowDownloadRegular className="h-5 w-5" />}
                {isDownloading ? t('generatingPdf', { defaultValue: 'Generating...' }) : t('downloadPlan')}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(trip) }}
                className="gap-4 rounded-[10px] px-4 py-4 font-medium"
              >
                <DeleteRegular className="h-5 w-5" />
                {t('delete')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Download button */}
      <div className="mt-auto">
        <Button
          size="xs"
          variant="secondary"
          icon={isDownloading ? <Spinner className="h-4 w-4" /> : <ArrowDownloadRegular />}
          disabled={isDownloading}
          onClick={(e) => {
            e.stopPropagation()
            if (!isDownloading) onDownload?.(trip)
          }}
          className={cn(
            "w-full rounded-full border border-grey-100 text-xs font-bold",
            isDownloading
              ? "cursor-not-allowed bg-grey-50 text-grey-400"
              : "bg-transparent text-grey-900 hover:bg-grey-50"
          )}
        >
          {isDownloading ? t('generatingPdf', { defaultValue: 'Generating...' }) : t('downloadPlan')}
        </Button>
      </div>
    </div>
  )
}
