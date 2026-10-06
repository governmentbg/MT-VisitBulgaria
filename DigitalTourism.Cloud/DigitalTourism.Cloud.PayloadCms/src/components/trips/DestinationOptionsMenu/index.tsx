'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui'
import {
  InfoRegular,
  DecimalArrowRightRegular,
  DeleteRegular,
  DirectionsFilled,
  MoreHorizontalRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { cn } from '@/components/ui/theme/cn'
import { useTranslations } from 'next-intl'
import { MoveToDayDialog } from '../MoveToDayDialog'

export interface DestinationOptionsMenuProps {
  onViewInfo?: () => void
  onAddToFavorites?: () => void
  /** Whether this destination is currently in the user's favorites */
  isFavorite?: boolean
  /** Called with the selected target day number */
  onMoveToDay?: (targetDay: number) => void
  onDelete?: () => void
  /** Coordinates for Google Maps directions */
  coordinates?: { lat: number; lng: number }
  /** Total number of days — needed for the move-to-day dialog */
  dayCount?: number
  /** Current day the destination is in */
  currentDay?: number
  /** Name shown in the move dialog */
  destinationTitle?: string
  /** Trip start date — passed to move dialog for day date labels */
  tripStartDate?: string
  className?: string
}

export const DestinationOptionsMenu: React.FC<DestinationOptionsMenuProps> = ({
  onViewInfo,
  onAddToFavorites,
  isFavorite,
  onMoveToDay,
  onDelete,
  coordinates,
  dayCount,
  currentDay,
  destinationTitle,
  tripStartDate,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex h-[33px] w-[33px] shrink-0 items-center justify-center rounded-full bg-grey-100 text-grey-500 transition-colors hover:bg-grey-200 hover:text-grey-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              className,
            )}
            aria-label={t('options')}
          >
            <MoreHorizontalRegular className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" className="rounded-[30px] p-4 shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)]">
          {onViewInfo && (
            <DropdownMenuItem onClick={onViewInfo} className="h-14 gap-4 rounded-[10px] px-4 text-sm font-medium text-grey-800">
              <InfoRegular className="h-5 w-5 shrink-0" />
              {t('viewInfo')}
            </DropdownMenuItem>
          )}
          {coordinates && (
            <DropdownMenuItem asChild className="h-14 gap-4 rounded-[10px] px-4 text-sm font-medium text-grey-800">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DirectionsFilled className="h-5 w-5 shrink-0" />
                {t('getDirections')}
              </a>
            </DropdownMenuItem>
          )}
          {onAddToFavorites && (
            <DropdownMenuItem onClick={onAddToFavorites} className="h-14 gap-4 rounded-[10px] px-4 text-sm font-medium text-grey-800">
              {isFavorite ? (
                <SpriteIcon name="heart-filled" className="h-5 w-5 shrink-0 text-red-500" />
              ) : (
                <SpriteIcon name="heart-regular" className="h-5 w-5 shrink-0" />
              )}
              {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            </DropdownMenuItem>
          )}
          {onMoveToDay && dayCount && (
            <DropdownMenuItem onClick={() => setMoveDialogOpen(true)} className="h-14 gap-4 rounded-[10px] px-4 text-sm font-medium text-grey-800">
              <DecimalArrowRightRegular className="h-5 w-5 shrink-0" />
              {t('moveToDay')}
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} className="h-14 gap-4 rounded-[10px] px-4 text-sm font-medium text-grey-800">
              <DeleteRegular className="h-5 w-5 shrink-0" />
              {t('deleteDestination')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {onMoveToDay && dayCount && (
        <MoveToDayDialog
          open={moveDialogOpen}
          onOpenChange={setMoveDialogOpen}
          dayCount={dayCount}
          currentDay={currentDay}
          destinationTitle={destinationTitle}
          tripStartDate={tripStartDate}
          onSelectDay={onMoveToDay}
        />
      )}
    </>
  )
}
