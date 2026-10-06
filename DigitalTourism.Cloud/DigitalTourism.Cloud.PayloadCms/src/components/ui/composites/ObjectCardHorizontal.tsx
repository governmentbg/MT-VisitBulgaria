import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { Link } from '@/i18n/routing'
import * as React from 'react'
import { LinkButton } from '../primitives/LinkButton'
import { LikeButton } from '../primitives/LikeButton'
import { Pill } from '../primitives/Pill'

export interface CardBadge {
  label: string
  icon?: React.ReactNode
}

export interface ObjectCardHorizontalProps extends React.HTMLAttributes<HTMLElement> {
  image: string
  title: string
  description?: string
  category?: string
  href?: string
  actionLabel?: string
  location?: string
  rating?: number
  badges?: CardBadge[]
  liked?: boolean
  onLike?: () => void
  badge?: string
  ref?: React.Ref<HTMLElement>
}

const cardClasses =
  'group flex flex-col gap-4 overflow-hidden rounded-[1.25rem] border border-grey-50 bg-white p-5 font-sans no-underline md:flex-row md:gap-6 md:p-6 lg:p-8'

const ObjectCardHorizontal: React.FC<ObjectCardHorizontalProps> = ({
  image,
  title,
  description,
  category,
  href,
  actionLabel = 'Explore',
  location,
  rating,
  badges,
  liked,
  onLike,
  badge,
  className,
  ref,
  ...props
}) => {
  return (
    <div
      className={cn(cardClasses, className)}
      ref={ref as React.Ref<HTMLDivElement>}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {/* Content */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
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
         
        </div>
        <h3 className="mt-2 font-heading text-2xl font-bold leading-[1.3] text-button-primary line-clamp-3">
          {title}
        </h3>
        {rating != null && rating > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <SpriteIcon
                  name="star-filled"
                  key={i}
                  className={cn('h-4 w-4', i < Math.round(rating) ? 'text-warning-100' : 'text-grey-100')}
                />
              ))}
            </div>
          </div>
        )}
        {location && (
          <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-grey-500">
            <SpriteIcon name="location" className="h-4 w-4" />
            {location}
          </div>
        )}
        {badges && badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
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
        <div className="mt-auto flex flex-col gap-4 mob-ls:hidden">
          {description && (
            <p className="line-clamp-[7] text-base leading-[1.5] text-black">{description}</p>
          )}
          {href && (
            <LinkButton href={href} variant="tertiary" size="sm" className="self-start pb-0 pl-0" icon={null}>
              {actionLabel}
            </LinkButton>
          )}
        </div>
      </div>

      {/* Image — top on mobile, right side on md+ */}
      <div className="-order-1 aspect-[16/9] w-full shrink-0 overflow-hidden rounded-2xl md:order-none md:aspect-[2/3] md:w-[45%] relative">
       {onLike && (
            <div className="absolute right-3 top-3 z-10">
              <LikeButton liked={liked} onToggle={() => onLike()} size="lg" variant="secondary" />
            </div>
          )}
        {href ? (
          <Link href={href} className="block h-full w-full">
            <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          </Link>
        ) : (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        )}
      </div>
    </div>
  )
}

export { ObjectCardHorizontal }
