'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/components/ui'
import { ExperienceCardAdapter } from '@/components/ExperienceCardAdapter'
import type { ExperienceSearchResult } from '@/lib/search/types'

const SkeletonCard: React.FC = () => (
  <div className="overflow-hidden rounded-3xl border border-grey-50 bg-white shadow-lg animate-pulse">
    <div className="w-full aspect-[3/2] bg-muted" />
    <div className="p-7">
      <div className="h-5 bg-muted rounded w-20 mb-4" />
      <div className="h-6 bg-muted rounded w-3/4 mb-3" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  </div>
)

const gridColsClass: Record<number, string> = {
  2: 'grid grid-cols-1 mob-ls:!grid-cols-3 sm:grid-cols-2 gap-4 lg:gap-6',
  3: 'grid grid-cols-1 mob-ls:!grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6',
  4: 'grid grid-cols-1 mob-ls:!grid-cols-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6',
}

interface ResultGridProps {
  results: ExperienceSearchResult[]
  gridColumns: number
  isLoading: boolean
  itemsPerPage?: number
  compact?: boolean
  isFavorite?: (id: string) => boolean
  onToggleFavorite?: (id: string) => void
}

export const ResultGrid: React.FC<ResultGridProps> = ({
  results,
  gridColumns,
  isLoading,
  itemsPerPage,
  compact = false,
  isFavorite,
  onToggleFavorite,
}) => {
  const t = useTranslations('experienceListing')
  const colClass = gridColsClass[gridColumns] || gridColsClass[3]

  if (isLoading && results.length === 0) {
    return (
      <div className={colClass} data-testid="result-grid-loading">
        {Array.from({ length: itemsPerPage || 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center" data-testid="result-grid-empty">
        <p className="text-muted-foreground">{t('noResults')}</p>
      </div>
    )
  }

  return (
    <div className={cn(colClass, 'transition-opacity duration-200', isLoading && 'opacity-60 pointer-events-none')} data-testid="result-grid">
      {results.map((result) => (
        <ExperienceCardAdapter
          key={result.id}
          result={result}
          liked={isFavorite?.(result.id)}
          onLike={onToggleFavorite ? () => onToggleFavorite(result.id) : undefined}
          actionLabel={t('viewMore')}
          compact={compact}
        />
      ))}
    </div>
  )
}
