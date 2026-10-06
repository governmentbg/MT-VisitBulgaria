'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Pill } from '@/components/ui/primitives/Pill'
import { Button } from '@/components/ui/primitives/Button'
import { DismissRegular } from '@/components/ui/icons'

export interface AppliedFilter {
  key: string
  value: string
  label: string
  /** Optional custom content to render instead of the label text */
  renderLabel?: React.ReactNode
}

export interface AppliedFilterPillsProps {
  filters: AppliedFilter[]
  onRemove: (key: string, value: string) => void
  onClearAll: () => void
}

export const AppliedFilterPills: React.FC<AppliedFilterPillsProps> = ({
  filters,
  onRemove,
  onClearAll,
}) => {
  const t = useTranslations('experienceListing')

  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => (
        <Pill
          key={`${f.key}-${f.value}`}
          variant="secondary"
          size="md"
          className="gap-1 pr-0"
        >
          {f.renderLabel ?? f.label}
          <button
            onClick={() => onRemove(f.key, f.value)}
            className="flex h-8 w-8 -my-1 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
            aria-label={`Remove ${f.label}`}
          >
            <DismissRegular className="h-3.5 w-3.5" />
          </button>
        </Pill>
      ))}
      {filters.length >= 2 && (
        <Button variant="tertiary" size="sm" icon={null} onClick={onClearAll}>
          {t('clearFilters')}
        </Button>
      )}
    </div>
  )
}
