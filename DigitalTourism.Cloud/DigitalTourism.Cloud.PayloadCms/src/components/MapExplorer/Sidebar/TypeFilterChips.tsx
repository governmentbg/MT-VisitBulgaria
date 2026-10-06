'use client'

import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import type { FacetValue } from '@/lib/search/types'

interface TypeFilterChipsProps {
  facets: FacetValue[]
  activeTypes: string[]
  allLabel: string
  typeLabels: Record<string, string>
  onTypeChange: (types: string[]) => void
}

export function TypeFilterChips({
  facets: _facets,
  activeTypes,
  allLabel,
  typeLabels,
  onTypeChange,
}: TypeFilterChipsProps) {
  const isAllActive = activeTypes.length === 0

  const handleToggle = (type: string) => {
    if (activeTypes.includes(type)) {
      onTypeChange(activeTypes.filter((t) => t !== type))
    } else {
      onTypeChange([...activeTypes, type])
    }
  }

  // Use typeLabels keys as a stable chip list so chips don't vanish
  // when a type filter narrows the Typesense facets.
  const types = Object.keys(typeLabels)

  return (
    <div className="flex flex-wrap gap-2">
      <ChipButton active={isAllActive} onClick={() => onTypeChange([])}>
        <SpriteIcon name="search" className="h-3 w-3" />
        {allLabel}
      </ChipButton>
      {types.map((type) => (
        <ChipButton
          key={type}
          active={activeTypes.includes(type)}
          onClick={() => handleToggle(type)}
        >
          {typeLabels[type]}
        </ChipButton>
      ))}
    </div>
  )
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold font-sans transition-colors whitespace-nowrap',
        active
          ? 'bg-primary-700 text-white'
          : 'border border-grey-200 bg-white text-grey-400 hover:bg-primary-50 hover:text-primary-900',
      )}
    >
      {children}
    </button>
  )
}
