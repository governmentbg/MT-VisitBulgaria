import { cn } from '@/components/ui/theme/cn'
import {
  ReceiptMoneyRegular,
  StarRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import * as React from 'react'
import { LikeButton } from '../primitives/LikeButton'

export interface MapObjectCardProps extends React.HTMLAttributes<HTMLElement> {
  image: string
  title: string
  rating?: number
  ratingCount?: number
  priceLabel?: string
  location?: string
  href?: string
  onLike?: () => void
  liked?: boolean
  ref?: React.Ref<HTMLElement>
}

const cardClasses =
  'group flex gap-6 rounded-xl border border-grey-200 bg-white p-4 font-sans no-underline'

const CardContent: React.FC<{
  image: string
  title: string
  rating?: number
  ratingCount?: number
  priceLabel?: string
  location?: string
  onLike?: () => void
  liked?: boolean
}> = ({ image, title, rating, ratingCount, priceLabel, location, onLike, liked }) => (
  <>
    {/* Content */}
    <div className="flex flex-1 flex-col gap-3">
      <h4 className="text-base font-bold leading-[1.5] text-black line-clamp-2">{title}</h4>
      <div className="mt-auto flex flex-col gap-2 text-xs font-medium text-grey-400">
        {rating !== undefined && (
          <span className="flex items-center gap-2">
            <span>{rating.toFixed(1)}</span>
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) =>
                i < Math.round(rating) ? (
                  <SpriteIcon name="star-filled" key={i} className="h-3 w-3 text-warning-100" />
                ) : (
                  <StarRegular key={i} className="h-3 w-3 text-grey-400" />
                ),
              )}
            </span>
            {ratingCount !== undefined && <span>({ratingCount})</span>}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {priceLabel && (
            <span className="flex items-center gap-2">
              <ReceiptMoneyRegular className="h-3 w-3" />
              <span>| {priceLabel}</span>
            </span>
          )}
          {location && (
            <span className="flex items-center gap-2">
              <SpriteIcon name="location" className="h-3 w-3" />
              <span>{location}</span>
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Image */}
    <div className="relative aspect-square w-[100px] shrink-0 overflow-hidden rounded-xl">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
      {onLike && (
        <div className="relative z-10">
          <LikeButton liked={liked} onToggle={() => onLike()} size="sm" variant="primary" className="absolute right-1.5 top-1.5" />
        </div>
      )}
    </div>
  </>
)

const MapObjectCard: React.FC<MapObjectCardProps> = ({
  image,
  title,
  rating,
  ratingCount,
  priceLabel,
  location,
  href,
  onLike,
  liked,
  className,
  ref,
  ...props
}) => {
  const contentProps = { image, title, rating, ratingCount, priceLabel, location, onLike, liked }

  if (href) {
    return (
      <a
        href={href}
        className={cn(cardClasses, className)}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <CardContent {...contentProps} />
      </a>
    )
  }

  return (
    <div
      className={cn(cardClasses, className)}
      ref={ref as React.Ref<HTMLDivElement>}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      <CardContent {...contentProps} />
    </div>
  )
}

export { MapObjectCard }
