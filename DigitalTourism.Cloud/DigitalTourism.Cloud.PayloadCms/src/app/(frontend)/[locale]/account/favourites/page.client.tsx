'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { ExperienceCardAdapter } from '@/components/ExperienceCardAdapter'
import { TypeFilterChips } from '@/components/MapExplorer/Sidebar/TypeFilterChips'
import { useFavoritesContext } from '@/components/favorites/FavoritesProvider'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { LinkButton } from '@/components/ui/primitives/LinkButton'
import type { ExperienceSearchResult, FacetValue } from '@/lib/search/types'

interface FavouritesPageClientProps {
  initialFavourites: ExperienceSearchResult[]
}

const TYPE_LABELS_KEYS: Record<string, string> = {
  hotel: 'typeHotel',
  restaurant: 'typeRestaurant',
  activity: 'typeActivity',
  attraction: 'typeAttraction',
  event: 'typeEvent',
}

export default function FavouritesPageClient({ initialFavourites }: FavouritesPageClientProps) {
  const t = useTranslations('favourites')
  const tExp = useTranslations('experienceListing')
  const { toggleFavorite } = useFavoritesContext()

  const [favourites, setFavourites] = useState(initialFavourites)
  const [activeTypes, setActiveTypes] = useState<string[]>([])

  // Build type labels from existing i18n keys
  const typeLabels = useMemo(() => {
    const labels: Record<string, string> = {}
    for (const [type, key] of Object.entries(TYPE_LABELS_KEYS)) {
      labels[type] = tExp(key as any)
    }
    return labels
  }, [tExp])

  // Compute facets from the full (unfiltered) list
  const facets = useMemo<FacetValue[]>(() => {
    const counts: Record<string, number> = {}
    for (const fav of favourites) {
      counts[fav.type] = (counts[fav.type] || 0) + 1
    }
    return Object.entries(counts).map(([value, count]) => ({ value, count }))
  }, [favourites])

  // Filter by active types
  const filteredFavourites = useMemo(() => {
    if (activeTypes.length === 0) return favourites
    return favourites.filter((f) => activeTypes.includes(f.type))
  }, [favourites, activeTypes])

  const handleUnfavourite = useCallback(
    async (id: string) => {
      await toggleFavorite(id)
      setFavourites((prev) => prev.filter((f) => f.id !== id))
    },
    [toggleFavorite],
  )

  return (
    <div className="min-h-[70vh] py-4">
      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-grey-50">
            <SpriteIcon name="heart-regular" className="h-8 w-8 text-grey-300" />
          </div>
          <h1 className="font-heading text-h4 text-grey-900">{t('emptyTitle')}</h1>
          <p className="max-w-sm text-body-sm text-grey-400">{t('emptyDescription')}</p>
          <LinkButton href="/search" variant="primary" size="md">
            {t('emptyAction')}
          </LinkButton>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <header className="flex min-w-0 flex-col gap-4">
            <h1 className="font-heading text-h3 text-grey-900">
              {t('title')}
            </h1>
            <p className="max-w-md text-body-lg text-grey-500">
              {t('subtitle')}
            </p>
          </header>

          {facets.length > 1 && (
            <div className="mt-4">
              <TypeFilterChips
                facets={facets}
                activeTypes={activeTypes}
                allLabel={t('allTypes')}
                typeLabels={typeLabels}
                onTypeChange={setActiveTypes}
              />
            </div>
          )}

          {filteredFavourites.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-body-sm text-grey-400">{t('noResults')}</p>
              <button
                type="button"
                onClick={() => setActiveTypes([])}
                className="text-body-sm font-medium text-primary-700 hover:underline"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFavourites.map((result) => (
                <ExperienceCardAdapter
                  key={result.id}
                  result={result}
                  liked
                  onLike={() => handleUnfavourite(result.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
