import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { Link } from '@/i18n/routing'
import * as React from 'react'
import { LinkButton } from '../primitives/LinkButton'
import { LikeButton } from '../primitives/LikeButton'
import { Pill } from '../primitives/Pill'
import { DateOverlay } from './DataOverlay'

export interface CardBadge {
  label: string
  icon?: React.ReactNode
}

export interface ObjectCardStandardProps extends React.HTMLAttributes<HTMLElement> {
  image: string
  title: string
  description?: string
  category?: string
  date?: Date | string
  location?: string
  locationDesc?: string
  href?: string
  actionLabel?: string
  liked?: boolean
  onLike?: () => void
  rating?: number
  priceLevel?: string
  badge?: string
  badges?: CardBadge[]
  /** Compact mode: hides description and badges */
  compact?: boolean
  ref?: React.Ref<HTMLElement>
}

const cardClasses =
  'group relative flex h-full flex-col overflow-hidden rounded-3xl border border-grey-50 bg-white font-sans shadow-lg no-underline'

const ObjectCardStandard: React.FC<ObjectCardStandardProps> = ({
  image,
  title,
  description,
  category,
  date,
  location,
  locationDesc,
  href,
  actionLabel = 'Explore',
  liked,
  onLike,
  rating,
  priceLevel,
  badge,
  badges,
  compact = false,
  className,
  ref,
  ...props
}) => {
  const dateValue = typeof date === 'string' ? new Date(date) : date

  const imageBlock = (
    <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden">
      {href ? (
        <Link href={href} className="block h-full w-full">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20" />
        </Link>
      ) : (
        <>
          <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-between p-7">
        <div className="flex flex-col gap-2">
          {dateValue ? <DateOverlay date={dateValue} /> : null}
          {category && (
            <Pill variant="default" size="xl" className="self-start">
              {category}
            </Pill>
          )}
          {badge && (
            <Pill variant="primary" size="sm" className="self-start">
              {badge}
            </Pill>
          )}
        </div>
        {onLike && (
          <div className="pointer-events-auto relative z-10">
            <LikeButton liked={liked} onToggle={() => onLike()} size="lg" variant="secondary" />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      className={cn(cardClasses, className)}
      ref={ref as React.Ref<HTMLDivElement>}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {imageBlock}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center gap-6 px-7 py-3 mob-ls:gap-3 mob-ls:px-4 mob-ls:py-2">
        <div className="flex flex-col gap-4 mob-ls:gap-2">
          {rating != null && rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SpriteIcon
                    name="star-filled"
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < Math.round(rating) ? 'text-warning-100' : 'text-grey-100',
                    )}
                  />
                ))}
              </div>
            </div>
          )}
          <h3 className="font-heading text-xl font-bold leading-[1.4] tracking-[-0.03rem] text-button-primary mob-ls:text-base line-clamp-3">
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                'text-sm font-medium leading-[1.4] text-button-primary line-clamp-4',
                compact ? 'hidden mob-ls:!hidden sm:block' : 'max-sm:hidden',
              )}
            >
              {description}
            </p>
          )}
          {(location || locationDesc || priceLevel) && (
            <div className="flex items-center gap-3 text-sm font-medium text-grey-500">
              {location && (
                <span className="flex items-center gap-1.5">
                  <SpriteIcon name="location" className="h-4 w-4" />
                  {location}
                </span>
              )}
              {location && (locationDesc || priceLevel) && (
                <span className="h-3.5 w-px bg-grey-300" aria-hidden="true" />
              )}
              {locationDesc && <span>{locationDesc}</span>}
              {priceLevel && <span>{priceLevel}</span>}
            </div>
          )}
          {badges && badges.length > 0 && !compact && (
            <div className="flex flex-wrap gap-1.5">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-grey-50 px-2.5 py-1 text-xs font-medium text-grey-500"
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
        {href && (
          <LinkButton href={href} variant="secondary" size="sm" className="w-full" icon={null}>
            {actionLabel}
          </LinkButton>
        )}
      </div>
    </div>
  )
}

export { ObjectCardStandard }
