'use client'

import React from 'react'

import type { MainMenu } from '@/payload-types'
import { DestinationsOverlay } from './DestinationsOverlay'
import { InfoOverlay } from './InfoOverlay'

type Tab = NonNullable<MainMenu['tabs']>[number]

interface MegaMenuOverlayProps {
  tab: Tab
  onClose: () => void
  iconMap?: Record<string, React.ComponentType<{ className?: string }>>
}

export const MegaMenuOverlay: React.FC<MegaMenuOverlayProps> = ({
  tab,
  onClose,
  iconMap,
}) => {
  const overlayType = tab.dropdownType ?? 'info'

  return (
    <div className="absolute left-[-12px] top-full z-100 mt-8">
      <div className="rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
        {overlayType === 'directions' && (
          <DestinationsOverlay tab={tab} onClose={onClose} />
        )}
        {overlayType === 'info' && <InfoOverlay tab={tab} onClose={onClose} iconMap={iconMap} />}
      </div>
    </div>
  )
}
