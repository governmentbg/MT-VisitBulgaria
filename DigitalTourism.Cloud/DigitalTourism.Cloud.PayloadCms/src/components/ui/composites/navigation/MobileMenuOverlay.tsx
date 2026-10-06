'use client'

import * as React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { MobileMenuList } from './MobileMenuList'
import type { MobileMenuItem } from './MobileMenuList'

export interface MobileMenuLevel {
  title?: string
  backLabel?: string
  items: MobileMenuItem[]
}

export interface MobileMenuOverlayProps {
  isOpen: boolean
  level: MobileMenuLevel
  onBack?: () => void
  onClose: () => void
  headerSlot?: React.ReactNode
  footerSlot?: React.ReactNode
  direction?: 'forward' | 'back'
  className?: string
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
  isOpen,
  level,
  onBack,
  onClose,
  headerSlot,
  footerSlot,
  direction = 'forward',
  className,
}) => {
  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isSubLevel = !!onBack
  const contentPadding = 'px-4 sm:px-6 md:px-8'

  return (
    <div
      className={cn('fixed inset-0 z-[1000] flex flex-col bg-white overflow-hidden', className)}
      role="dialog"
      aria-modal="true"
    >
      {/* Overscroll backdrop — oversized so rubber-band bounce never reveals the site */}
      <div className="fixed -inset-[100vh] z-[-1] bg-white" aria-hidden="true" />

      {/* Decorative watermark background — fixed so it doesn't scroll with content */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <img
          src="/watermark.svg"
          alt=""
          className="absolute bottom-0 right-0 w-[872px] h-[781px] translate-x-1/4 translate-y-1/4 opacity-30"
        />
      </div>

      {/* Fixed header — L1: logo + icons, L2/L3: back + title */}
      <div className="relative z-10 shrink-0">
        {headerSlot && (
          <div className={isSubLevel ? 'hidden' : undefined}>{headerSlot}</div>
        )}

        {isSubLevel && (
          <div className={cn('flex flex-col gap-5', contentPadding)}>
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-[18px] py-4"
            >
              <SpriteIcon name="chevron-left" className="size-4 text-black" />
              <span className="font-sans text-[14px] font-medium leading-[24px] text-black">
                {level.backLabel}
              </span>
            </button>
            {level.title && (
              <p className="font-sans text-[20px] font-semibold leading-[24px] text-black">
                {level.title}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Scrollable content area — only this part scrolls */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden overscroll-none">
        <div
          key={`${level.title}-${level.backLabel}`}
          className={cn(
            contentPadding, 'pt-5 pb-10',
            direction === 'forward' && 'animate-slide-in-from-right',
            direction === 'back' && 'animate-slide-in-from-left',
          )}
        >
          <MobileMenuList items={level.items} />
        </div>
      </div>

      {/* Fixed footer — L1: action buttons */}
      {footerSlot && (
        <div className={cn('relative z-10 shrink-0 pb-8', isSubLevel && 'hidden')}>
          {footerSlot}
        </div>
      )}
    </div>
  )
}

export { MobileMenuOverlay }
