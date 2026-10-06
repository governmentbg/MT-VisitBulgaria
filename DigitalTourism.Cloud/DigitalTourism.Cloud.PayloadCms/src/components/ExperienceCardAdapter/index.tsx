'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { ObjectCardStandard } from '@/components/ui/composites/ObjectCardStandard'
import type { ExperienceSearchResult } from '@/lib/search/types'
import { buildExperienceUrl } from '@/utilities/buildExperienceUrl'

const typeToKey: Record<string, string> = {
  hotel: 'typeHotel',
  restaurant: 'typeRestaurant',
  activity: 'typeActivity',
  attraction: 'typeAttraction',
  event: 'typeEvent',
}

export interface ExperienceCardAdapterProps {
  result: ExperienceSearchResult
  liked?: boolean
  onLike?: () => void
  actionLabel?: string
  compact?: boolean
}

function buildHref(result: ExperienceSearchResult): string {
  return buildExperienceUrl(result.type, result.slug)
}

function buildLocation(result: ExperienceSearchResult): string | undefined {
  const parts: string[] = []
  if (result.location?.city) parts.push(result.location.city)
  if (result.location?.region) parts.push(result.location.region)
  return parts.length > 0 ? parts.join(', ') : undefined
}

export const ExperienceCardAdapter: React.FC<ExperienceCardAdapterProps> = ({
  result,
  liked,
  onLike,
  actionLabel,
  compact = false,
}) => {
  const t = useTranslations('experienceListing')
  const tCommon = useTranslations('common')
  const resolvedActionLabel = actionLabel ?? tCommon('explore')
  const href = buildHref(result)
  const location = buildLocation(result)
  const image = result.heroImage?.url || ''

  // Events: show first category (e.g. "Music", "Festival")
  // Non-events: show singular type label (e.g. "Hotel", "Restaurant")
  const typeKey = typeToKey[result.type]
  const category =
    result.type === 'event'
      ? result.categories?.[0]
      : typeKey ? t(typeKey as 'typeHotel') : undefined

  return (
    <ObjectCardStandard
      image={image}
      title={result.title}
      description={result.description}
      category={category}
      rating={result.starRating ?? result.rating}
      location={location}
      priceLevel={result.priceLevel}
      date={result.date}
      liked={liked}
      onLike={onLike}
      href={href}
      actionLabel={resolvedActionLabel}
      compact={compact}
    />
  )
}
