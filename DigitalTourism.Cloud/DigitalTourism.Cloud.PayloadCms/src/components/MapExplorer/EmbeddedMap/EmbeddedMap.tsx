'use client'

import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ArrowMaximizeRegular, DismissRegular } from '@/components/ui/icons'
import { cn } from '@/components/ui/theme/cn'
import { useCompactMap } from '../hooks/useCompactMap'

export interface EmbeddedMapRenderState {
  /**
   * False for the in-page preview on touch devices, true everywhere else.
   * Forward it to MapCanvas, and use it to skip controls that only make sense
   * on a map you can actually pan — e.g. `{interactive && <MapControls />}`.
   */
  interactive: boolean
}

export interface EmbeddedMapProps {
  children: (state: EmbeddedMapRenderState) => React.ReactNode
  /** Label for the "open full screen" button. */
  viewLabel: string
  /** Accessible label for the dialog close button, also used as the dialog title. */
  closeLabel: string
  /** Classes for the in-page container — height / aspect ratio / rounding. */
  className?: string
}

/**
 * Wraps an embedded map so it never traps the page scroll on a phone.
 *
 * On touch/small screens the map renders frozen behind a transparent tap
 * catcher, with an Airbnb-style button that opens the same map full screen. On
 * desktop it renders its children untouched — pointer users can already pan an
 * inline map without losing the page scroll.
 */
export function EmbeddedMap({ children, viewLabel, closeLabel, className }: EmbeddedMapProps) {
  const isCompact = useCompactMap()
  const [isOpen, setIsOpen] = useState(false)

  // Desktop keeps today's behaviour exactly.
  if (!isCompact) {
    return (
      <div className={className} data-testid="embedded-map">
        {children({ interactive: true })}
      </div>
    )
  }

  return (
    <>
      <div
        className={cn('relative', className)}
        data-testid="embedded-map"
        style={{ touchAction: 'pan-y' }}
      >
        {children({ interactive: false })}

        {/*
          Sits above every Leaflet pane (max z-index 700) but below in-map
          actions like "Get directions" (z-1000), so a tap anywhere on the map —
          markers included — opens the full-screen view instead of a popup,
          while genuinely useful buttons stay reachable.
        */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={viewLabel}
          data-testid="embedded-map-fullscreen"
          className="absolute inset-0 z-[900] cursor-pointer"
          style={{ touchAction: 'pan-y' }}
        />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          // Top-right keeps clear of in-map actions anchored bottom-left (e.g. "Get
          // Directions") and of Leaflet's bottom-right attribution.
          className="pointer-events-none absolute right-3 top-3 z-[1000] flex items-center gap-2 rounded-full border border-grey-200 bg-white px-4 py-2 text-sm font-semibold text-grey-900 shadow-lg"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ArrowMaximizeRegular className="size-4" />
          {viewLabel}
        </button>
      </div>

      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[2000] bg-black/60" />
          <DialogPrimitive.Content
            data-testid="embedded-map-dialog"
            className="fixed inset-0 z-[2000] flex flex-col bg-background focus:outline-none"
          >
            <DialogPrimitive.Title className="sr-only">{viewLabel}</DialogPrimitive.Title>

            <div className="relative flex-1">
              {children({ interactive: true })}

              <DialogPrimitive.Close
                aria-label={closeLabel}
                className="absolute left-4 top-4 z-[1000] flex size-11 items-center justify-center rounded-full border border-grey-200 bg-white text-grey-900 shadow-lg"
              >
                <DismissRegular className="size-5" />
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}
