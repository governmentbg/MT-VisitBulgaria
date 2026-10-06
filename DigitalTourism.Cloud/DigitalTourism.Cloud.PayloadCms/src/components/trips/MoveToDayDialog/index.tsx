'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui'
import { cn } from '@/components/ui/theme/cn'
import { MapRegular } from '@/components/ui/icons'
import { useTranslations, useLocale } from 'next-intl'

export interface MoveToDayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayCount: number
  currentDay?: number
  destinationTitle?: string
  /** Trip start date (ISO string) — used to show the date next to each day */
  tripStartDate?: string
  onSelectDay: (dayNumber: number) => void
}

export const MoveToDayDialog: React.FC<MoveToDayDialogProps> = ({
  open,
  onOpenChange,
  dayCount,
  currentDay,
  destinationTitle,
  tripStartDate,
  onSelectDay,
}) => {
  const t = useTranslations('tripPlanner')
  const locale = useLocale()
  const days = Array.from({ length: dayCount }, (_, i) => i + 1)

  const formatDayDate = (dayNumber: number): string | null => {
    if (!tripStartDate) return null
    const start = new Date(tripStartDate)
    start.setDate(start.getDate() + dayNumber - 1)
    return start.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        'flex max-w-sm flex-col rounded-[20px] p-6',
        'max-h-[80vh]',
        'max-sm:inset-0 max-sm:left-0 max-sm:top-0 max-sm:max-h-full max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none',
      )}>
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle className="font-heading text-lg font-bold text-grey-900">
            {t('moveToDay')}
          </DialogTitle>
          {destinationTitle && (
            <DialogDescription className="text-sm text-grey-500">
              {destinationTitle}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-1 overflow-y-auto">
          {days.map((dayNumber) => {
            const isCurrent = dayNumber === currentDay
            return (
              <button
                key={dayNumber}
                disabled={isCurrent}
                onClick={() => {
                  onSelectDay(dayNumber)
                  onOpenChange(false)
                }}
                className={cn(
                  'flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors',
                  isCurrent
                    ? 'cursor-default bg-grey-50 text-grey-400'
                    : 'text-grey-800 hover:bg-grey-50',
                )}
              >
                <div className="flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-full bg-grey-100">
                  <MapRegular className="h-4 w-4 text-grey-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {t('dayTitle', { day: dayNumber })}
                    {isCurrent && <span className="ml-2 text-xs text-grey-400">{t('current')}</span>}
                  </span>
                  {formatDayDate(dayNumber) && (
                    <span className="text-xs text-grey-400">{formatDayDate(dayNumber)}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
