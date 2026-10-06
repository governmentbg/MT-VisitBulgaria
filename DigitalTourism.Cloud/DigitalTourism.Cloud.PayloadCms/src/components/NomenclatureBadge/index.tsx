'use client'

import React from 'react'
import type { PopulatedNomenclature } from '@/collections/Nomenclature'
import { NomenclatureIcon } from '@/components/NomenclatureIcon'
import { cn } from '@/components/ui'

interface NomenclatureBadgeProps {
  item: number | PopulatedNomenclature
  className?: string
  iconSize?: number
}

/**
 * Renders a nomenclature item as a badge with optional icon + name.
 * Handles both populated objects and raw IDs gracefully.
 */
export const NomenclatureBadge: React.FC<NomenclatureBadgeProps> = ({
  item,
  className,
  iconSize = 14,
}) => {
  if (typeof item === 'number') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full',
          className,
        )}
      >
        {String(item)}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full',
        className,
      )}
    >
      <NomenclatureIcon
        iconName={item.iconName}
        svgContent={item.svgContent}
        size={iconSize}
        className="shrink-0"
      />
      {item.name}
    </span>
  )
}
