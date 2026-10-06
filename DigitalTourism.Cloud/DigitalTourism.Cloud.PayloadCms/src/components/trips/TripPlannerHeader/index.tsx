'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/components/ui/theme/cn'
import { Button, IconButton, Spinner } from '@/components/ui'
import {
  EditFilled,
  AddRegular,
  ArrowDownloadRegular,
  DeleteRegular,
  DocumentTextRegular,
  DismissRegular,
  MoreHorizontalRegular,
  MapRegular,
  ListRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { Logo } from '@/components/Logo/Logo'
import { useTranslations } from 'next-intl'

export interface TripPlannerHeaderProps {
  tripName: string
  dateRange: string
  dayCount?: number
  onExit: () => void
  onEditName: () => void
  onDayIncrement?: () => void
  onDayDecrement?: () => void
  isSaving?: boolean
  onDownloadPdf?: () => void
  isDownloadingPdf?: boolean
  /** Mobile: toggle between map and list view */
  showingMap?: boolean
  onToggleMap?: () => void
  className?: string
}

export const TripPlannerHeader: React.FC<TripPlannerHeaderProps> = ({
  tripName,
  dateRange,
  dayCount,
  onExit,
  onEditName,
  onDayIncrement,
  onDayDecrement,
  isSaving = false,
  onDownloadPdf,
  isDownloadingPdf = false,
  showingMap,
  onToggleMap,
  className,
}) => {
  const t = useTranslations('tripPlanner')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 })

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <header
      className={cn(
        'flex items-center justify-between border-b border-grey-100 bg-white px-8 py-4',
        'max-sm:px-4',
        className,
      )}
    >
      {/* Left: Logo/Back + Trip info */}
      <div className="flex min-w-0 flex-1 items-center gap-8 max-sm:gap-3">
        {/* Desktop: Logo */}
        <Logo variant="dark" className="!h-[37px] !w-[48px] shrink-0 max-sm:hidden" />
        {/* Mobile: Back button */}
        <IconButton
          icon={<SpriteIcon name="chevron-left" className="h-5 w-5" />}
          label={t('back')}
          variant="secondary"
          size="sm"
          onClick={onExit}
          className="hidden shrink-0 max-sm:flex"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate font-heading text-heading-card text-grey-900 max-sm:text-base">{tripName}</h1>
            <button
              onClick={onEditName}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-grey-400 transition-colors hover:bg-grey-50 hover:text-grey-600"
              aria-label={t('editPlan')}
            >
              <EditFilled className="h-4 w-4" />
            </button>
            {isSaving && (
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-grey-400">
                <Spinner size="sm" />
                <span className="max-sm:hidden">{t('saving')}</span>
              </span>
            )}
          </div>
          <span className="truncate text-base font-normal text-[#45556c] max-sm:text-xs">
            {dateRange}
            {dayCount != null && ` · ${dayCount} ${t('days', { count: dayCount })}`}
          </span>
        </div>
      </div>

      {/* Right: Desktop actions */}
      <div className="flex shrink-0 items-center gap-3 max-sm:hidden">
        {onDownloadPdf && (
          <Button
            variant="tertiary"
            size="xs"
            icon={isDownloadingPdf ? <Spinner className="h-4 w-4" /> : <ArrowDownloadRegular />}
            disabled={isDownloadingPdf}
            onClick={() => { if (!isDownloadingPdf) onDownloadPdf() }}
          >
            {isDownloadingPdf ? t('generatingPdf', { defaultValue: 'Generating...' }) : t('downloadPlan')}
          </Button>
        )}
        <IconButton
          icon={<DismissRegular className="h-5 w-5" />}
          label={t('close')}
          variant="ghost"
          size="md"
          onClick={onExit}
        />
      </div>

      {/* Right: Mobile actions — map toggle + context menu */}
      <div className="hidden shrink-0 items-center gap-2 max-sm:flex" ref={menuRef}>
        {onToggleMap && (
          <IconButton
            icon={showingMap ? <ListRegular className="h-5 w-5" /> : <MapRegular className="h-5 w-5" />}
            label={showingMap ? t('showPlan') : t('showMap')}
            variant="ghost"
            size="sm"
            onClick={onToggleMap}
          />
        )}
        <IconButton
          ref={menuBtnRef}
          icon={<MoreHorizontalRegular className="h-5 w-5" />}
          label={t('menu')}
          variant="secondary"
          size="sm"
          onClick={() => {
            if (!menuOpen && menuBtnRef.current) {
              const rect = menuBtnRef.current.getBoundingClientRect()
              setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
            }
            setMenuOpen(!menuOpen)
          }}
        />

        {menuOpen && (
          <div
            ref={dropdownRef}
            className="fixed z-[100] min-w-[200px] rounded-xl border border-grey-100 bg-white py-1.5 shadow-lg"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            {onDayIncrement && (
              <button
                onClick={() => { onDayIncrement(); setMenuOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-grey-700 transition-colors hover:bg-grey-50"
              >
                <AddRegular className="h-4 w-4" />
                {t('addDay')}
              </button>
            )}
            {onDayDecrement && (
              <button
                onClick={() => { onDayDecrement(); setMenuOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-grey-700 transition-colors hover:bg-grey-50"
              >
                <DeleteRegular className="h-4 w-4" />
                {t('removeDay')}
              </button>
            )}
            {onDownloadPdf && (
              <button
                onClick={() => { if (!isDownloadingPdf) { onDownloadPdf(); setMenuOpen(false) } }}
                disabled={isDownloadingPdf}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  isDownloadingPdf
                    ? "cursor-not-allowed text-grey-400"
                    : "text-grey-700 hover:bg-grey-50"
                )}
              >
                {isDownloadingPdf ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <DocumentTextRegular className="h-4 w-4" />
                )}
                {isDownloadingPdf ? t('generatingPdf', { defaultValue: 'Generating...' }) : t('downloadPdf')}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
