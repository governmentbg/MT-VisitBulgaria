'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
  Spinner,
} from '@/components/ui'
import { cn } from '@/components/ui/theme/cn'
import { DateSelector } from '@/components/ui/composites/DateSelector'
import { useTranslations } from 'next-intl'

export interface TripDialogData {
  name: string
  startDate: string
  endDate: string
}

export interface CreateTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TripDialogData) => void | Promise<void>
  isSubmitting?: boolean
  /** When provided, the dialog operates in edit mode with pre-filled values */
  initialValues?: { name: string; startDate: string; endDate: string }
}

export const CreateTripDialog: React.FC<CreateTripDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  initialValues,
}) => {
  const t = useTranslations('tripPlanner')
  const isEdit = !!initialValues
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Sync form state when dialog opens or initialValues change
  useEffect(() => {
    if (open && initialValues) {
      setName(initialValues.name)
      setStartDate(new Date(initialValues.startDate))
      setEndDate(new Date(initialValues.endDate))
    } else if (open && !initialValues) {
      setName('')
      setStartDate(null)
      setEndDate(null)
    }
  }, [open, initialValues])

  const formatDateString = (d: Date) => d.toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return
    await onSubmit({
      name,
      startDate: formatDateString(startDate),
      endDate: formatDateString(endDate),
    })
    if (!isEdit) {
      setName('')
      setStartDate(null)
      setEndDate(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[781px] rounded-[12px] p-8',
          // Mobile: full-screen with content at top so date picker has room
          'max-sm:inset-0 max-sm:left-0 max-sm:top-0 max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0',
          'max-sm:flex max-sm:h-full max-sm:flex-col max-sm:justify-start max-sm:rounded-none',
        )}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="font-heading text-2xl font-bold text-grey-900">
            {isEdit ? t('editPlan') : t('createNewPlan')}
          </DialogTitle>
          <DialogDescription className="text-sm text-grey-500">
            {isEdit ? t('editPlanDesc') : t('createPlanDesc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="trip-name" className="text-sm font-medium text-grey-700">
              {t('planName')}
            </Label>
            <Input
              id="trip-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('tripNamePlaceholder')}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-grey-700">
              {t('dates')}
            </Label>
            <DateSelector
              type="date"
              placeholder={t('selectDates')}
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={(s, e) => {
                setStartDate(s)
                setEndDate(e)
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !startDate || !endDate}
            className={cn(
              'w-full rounded-full bg-primary-900 py-4 text-base font-bold text-white transition-colors',
              'hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            )}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                {isEdit ? t('saving') : t('creating')}
              </span>
            ) : isEdit ? (
              t('saveChanges')
            ) : (
              t('nextStep')
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
