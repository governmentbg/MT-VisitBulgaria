import React from 'react'
import { cn } from '@/components/ui'
import { Media } from '@/components/Media'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import type { Media as MediaType } from '@/payload-types'
import type { Category, Tag } from '@/payload-types'

export interface ExperienceHeroV2Props {
  heroImage: MediaType | number | string
  title: string
  type?: string
  typeLabel?: string
  categories?: (Category | number)[]
  tags?: (Tag | number)[]
  starRating?: number | null
  cityName?: string
  municipalityName?: string
  locationLabel?: string
  className?: string
}

export const ExperienceHeroV2: React.FC<ExperienceHeroV2Props> = ({
  heroImage,
  title,
  type,
  typeLabel,
  categories,
  tags,
  starRating,
  cityName,
  municipalityName,
  locationLabel = 'Location',
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex min-h-[60vh] items-end overflow-clip md:min-h-[70vh] lg:min-h-[75vh]',
        'rounded-br-[120px] md:rounded-br-[240px] lg:rounded-br-[342px]',
        className,
      )}
    >
      {/* Background image */}
      {heroImage && typeof heroImage !== 'string' && typeof heroImage !== 'number' && (
        <Media
          fill
          priority
          usePayloadSizes
          imgClassName="object-cover"
          resource={heroImage}
          preferredSize="og"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0) 26%, rgba(0,0,0,0.7) 90%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.36) 100%)',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 py-12">
        {/* Type badge + categories */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {type && typeLabel && (
            <span className="rounded bg-white/20 px-2 py-1 text-sm uppercase text-white">
              {typeLabel}
            </span>
          )}
          {categories && categories.length > 0 && (
            <span className="text-sm uppercase text-white">
              {categories
                .map((cat) => (typeof cat === 'object' && cat !== null ? cat.title : null))
                .filter(Boolean)
                .join(', ')}
            </span>
          )}
          {tags && tags.length > 0 && (
            <>
              {categories && categories.length > 0 && (
                <span className="text-sm text-white/50">|</span>
              )}
              {tags
                .map((tag) => (typeof tag === 'object' && tag !== null ? tag : null))
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag!.id}
                    className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm"
                  >
                    {tag!.title}
                  </span>
                ))}
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl ">
          {title}
        </h1>

        {/* Star rating */}
        {starRating != null && starRating > 0 && (
          <div className="mt-4 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SpriteIcon
                name="star-filled"
                key={i}
                className={cn(
                  'h-5 w-5',
                  i < Math.round(starRating) ? 'text-warning-100' : 'text-white/30',
                )}
              />
            ))}
          </div>
        )}

        {/* Location */}
        {cityName && (
          <div className="mt-6 flex flex-col gap-1 text-white md:flex-row md:gap-8">
            <div className="flex flex-col gap-1">
              <p className="text-sm opacity-80">{locationLabel}</p>
              <p>
                {cityName}
                {municipalityName && `, ${municipalityName}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
