'use client'

import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button, cn } from '@/components/ui'
import { useTranslations } from 'next-intl'

interface FilterPanelProps {
  children: React.ReactNode
  activeFilterCount?: number
  onClearFilters?: () => void
  /** When set, the portal + overlay are scoped to this container element */
  container?: HTMLElement | null
  /** Custom trigger element (rendered via Radix asChild). Falls back to the default button. */
  trigger?: React.ReactNode
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  children,
  activeFilterCount = 0,
  onClearFilters,
  container,
  trigger,
}) => {
  const t = useTranslations('experienceListing')

  return (
    <DialogPrimitive.Root>
      {/* Filter trigger button */}
      <DialogPrimitive.Trigger asChild>
        {trigger ?? (
          <Button
            variant="secondary"
            size="xs"
            icon={null}
            data-testid="filter-panel-trigger"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t('filters')}
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal container={container ?? undefined}>
        {/* Overlay — Radix handles scroll lock and focus trapping */}
        <DialogPrimitive.Overlay
          className={cn(
            'z-[100] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            container ? 'absolute inset-0' : 'fixed inset-0',
          )}
        />

        {/* Side sheet — slides from right */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'z-[100] w-80 max-w-[85vw] bg-background shadow-lg',
            'overflow-y-auto',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            'duration-300',
            container ? 'absolute inset-y-0 right-0 rounded-2xl' : 'fixed inset-y-0 right-0',
          )}
          data-testid="filter-panel-drawer"
        >
          <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogPrimitive.Title className="font-bold text-lg">
                {t('filters')}
              </DialogPrimitive.Title>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <DialogPrimitive.Close className="p-2 hover:bg-muted rounded-full">
              <X className="w-5 h-5" />
            </DialogPrimitive.Close>
          </div>
          <div className="p-4">
            {children}
            {activeFilterCount > 0 && onClearFilters && (
              <div className="mt-4 flex justify-center">
                <Button variant="tertiary" size="sm" icon={null} onClick={onClearFilters}>
                  {t('clearFilters')}
                </Button>
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
