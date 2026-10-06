'use client'

import { forwardRef } from 'react'
import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'

interface MapExplorerSidebarProps {
  title: string
  subtitle?: string
  /** Render-prop slot for the top-right action (e.g. filter toggle) */
  headerAction?: React.ReactNode
  /** Pinned controls (chips, search bar) — stays above the scroll area */
  controls?: React.ReactNode
  /** Scrollable content (results list) */
  children: React.ReactNode
  className?: string
}

export const MapExplorerSidebar = forwardRef<HTMLElement, MapExplorerSidebarProps>(
  ({ title, subtitle, headerAction, controls, children, className }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'pointer-events-auto relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_32px_64px_-12px_rgba(10,13,18,0.14)]',
          className,
        )}
      >
        {/* Header — fixed */}
        <div className="shrink-0 flex flex-col gap-6 p-8 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-heading text-[40px] font-bold leading-[1.1] text-grey-800">
                {title}
              </h3>
              <SpriteIcon name="map" className="h-10 w-10 text-grey-800" />
            </div>
            {headerAction}
          </div>
          {subtitle && (
            <p className="text-lg font-medium leading-relaxed text-grey-500">{subtitle}</p>
          )}
        </div>

        {/* Pinned controls — chips, search bar, filter button */}
        {controls && (
          <div className="shrink-0 flex flex-col gap-4 px-8 pt-6 pb-4">{controls}</div>
        )}

        {/* Scrollable results */}
        <div data-results-scroll className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-8 pb-8 pt-2">{children}</div>
      </aside>
    )
  },
)

MapExplorerSidebar.displayName = 'MapExplorerSidebar'
