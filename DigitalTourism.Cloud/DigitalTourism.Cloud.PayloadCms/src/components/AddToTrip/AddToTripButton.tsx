'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarAddRegular } from '@fluentui/react-icons'
import { cn } from '@/components/ui'
import { useAuth } from '@/providers/Auth'
import { AddToTripDialog } from './AddToTripDialog'

export interface AddToTripButtonProps {
  /** Collection slug, e.g. "hotels", "events", "attractions" */
  collectionSlug: string
  /** Numeric experience ID */
  experienceId: number
  /** Button label override */
  label?: string
  className?: string
}

export function AddToTripButton({
  collectionSlug,
  experienceId,
  label,
  className,
}: AddToTripButtonProps) {
  const { isAuthenticated, openAuthDialog } = useAuth()
  const t = useTranslations('addToTrip')
  const [dialogOpen, setDialogOpen] = useState(false)

  const displayLabel = label ?? t('button')

  const handleClick = () => {
    if (!isAuthenticated) {
      openAuthDialog('login')
      return
    }
    setDialogOpen(true)
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'group/trip flex items-center gap-2 sm:gap-3 cursor-pointer',
          className,
        )}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-grey-200 text-primary-700 transition-colors [@media(hover:hover)]:group-hover/trip:bg-primary-100">
          <CalendarAddRegular className="h-5 w-5" />
        </div>
        <span className="hidden text-lg font-normal text-primary-700 whitespace-nowrap transition-colors [@media(hover:hover)]:group-hover/trip:text-primary-900 sm:inline">
          {displayLabel}
        </span>
      </div>

      <AddToTripDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        collectionSlug={collectionSlug}
        experienceId={experienceId}
      />
    </>
  )
}
