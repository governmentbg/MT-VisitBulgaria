'use client'

import { cn } from '@/components/ui/theme/cn'
import {
  NavigationRegular,
  ShareRegular,
  StarRegular,
  DirectionsFilled,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import * as React from 'react'
import { Button } from '../primitives/Button'
import { LinkButton } from '../primitives/LinkButton'
import { LinkIconButton } from '../primitives/LinkIconButton'
import { CloseButton } from '../primitives/CloseButton'
import { LikeButton } from '../primitives/LikeButton'
import { Pill } from '../primitives/Pill'

export interface MapObjectCardExpandedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card layout variant */
  variant?: 'default' | 'popup'
  image: string
  images?: string[]
  title: string
  description?: string
  rating?: number
  reviewCount?: number
  category?: string
  location?: string
  visitorInfo?: string
  onClose?: () => void
  onLike?: () => void
  onShare?: () => void
  onDirections?: () => void
  liked?: boolean
  /** CTA button label (popup variant) */
  ctaLabel?: string
  /** CTA button click handler (popup variant) */
  onCtaClick?: () => void
  /** CTA button href — renders as a link (popup variant) */
  ctaHref?: string
  /** Directions button label (popup variant) */
  directionsLabel?: string
  /** Coordinates for Google Maps directions link */
  coordinates?: { lat: number; lng: number }
  ref?: React.Ref<HTMLDivElement>
}

/* ------------------------------------------------------------------ */
/*  Popup variant — matches Figma "Map object card" (1662:52813)      */
/* ------------------------------------------------------------------ */
const PopupLayout: React.FC<
  Pick<
    MapObjectCardExpandedProps,
    | 'image'
    | 'title'
    | 'category'
    | 'onClose'
    | 'onLike'
    | 'liked'
    | 'ctaLabel'
    | 'onCtaClick'
    | 'ctaHref'
    | 'directionsLabel'
    | 'coordinates'
    | 'className'
    | 'ref'
  >
> = ({
  image,
  title,
  category,
  onClose,
  onLike,
  liked,
  ctaLabel,
  onCtaClick,
  ctaHref,
  directionsLabel,
  coordinates,
  className,
  ref,
}) => {
  const directionsHref = coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
    : undefined

  return (
    <div
      ref={ref}
      className={cn(
        'flex w-64 flex-col rounded-[24px] border border-grey-50 bg-white shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)]',
        className,
      )}
    >
      {/* Hero image with overlaid actions */}
      <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-t-[24px]">
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute right-4 top-4 flex items-start gap-2">
          {onLike && (
            <LikeButton
              liked={liked}
              onToggle={() => onLike()}
              size="md"
              variant="secondary"
              className="size-10"
            />
          )}
          {onClose && (
            <CloseButton
              onClose={onClose}
              size="md"
              className="bg-white text-grey-600 hover:bg-grey-200"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="flex flex-col gap-2">
          {category && (
            <div>
              <Pill variant="brand" size="md">
                {category}
              </Pill>
            </div>
          )}
          <h3 className="font-heading text-[16px] font-bold leading-[22px] tracking-[-0.5px] text-heading line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Action buttons */}
        {(ctaLabel || ctaHref || directionsHref) && (
          <div className="mt-3 flex flex-row gap-2">
            {(ctaLabel || ctaHref) &&
              (ctaHref ? (
                <LinkButton
                  href={ctaHref}
                  variant="secondary"
                  size="xs"
                  icon={null}
                  className="min-w-0 flex-1"
                >
                  {ctaLabel}
                </LinkButton>
              ) : (
                <Button
                  variant="secondary"
                  size="xs"
                  icon={null}
                  onClick={onCtaClick}
                  className="min-w-0 flex-1"
                >
                  {ctaLabel}
                </Button>
              ))}
            {directionsHref && (
              <LinkIconButton
                href={directionsHref}
                icon={<DirectionsFilled className="!size-8" />}
                label={directionsLabel || 'Directions'}
                variant="primary"
                size="md"
                className="shrink-0 !p-2 [&_svg]:!stroke-0"
                newTab
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Default variant — expanded detail view                            */
/* ------------------------------------------------------------------ */
const DefaultLayout: React.FC<
  Omit<MapObjectCardExpandedProps, 'variant' | 'ctaLabel' | 'onCtaClick' | 'ctaHref'>
> = ({
  image,
  images = [],
  title,
  description,
  rating,
  reviewCount,
  category,
  location,
  visitorInfo,
  onClose,
  onLike,
  onShare,
  onDirections,
  liked,
  className,
  ref,
  ...props
}) => {
  const allImages = [image, ...images]

  return (
    <div
      ref={ref}
      className={cn('flex w-96 flex-col overflow-hidden rounded-2xl bg-white shadow-xl', className)}
      {...props}
    >
      {/* Image gallery */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img src={allImages[0]} alt={title} className="h-full w-full object-cover" />
        {onClose && (
          <div className="absolute right-3 top-3">
            <CloseButton onClose={onClose} size="sm" />
          </div>
        )}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {allImages.slice(0, 4).map((img, i) => (
              <div key={i} className="h-8 w-8 overflow-hidden rounded border-2 border-white">
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {allImages.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-white bg-black/50 text-xs font-medium text-white">
                +{allImages.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {category && (
              <Pill variant="brand" size="sm">
                {category}
              </Pill>
            )}
            <h3 className="text-lg font-bold text-grey-900 line-clamp-2">{title}</h3>
          </div>
        </div>

        {rating !== undefined && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) =>
              i < Math.round(rating) ? (
                <SpriteIcon name="star-filled" key={i} className="h-4 w-4 text-warning-100" />
              ) : (
                <StarRegular key={i} className="h-4 w-4 text-grey-200" />
              ),
            )}
            {reviewCount !== undefined && (
              <span className="ml-1 text-sm text-grey-500">({reviewCount})</span>
            )}
          </div>
        )}

        {location && (
          <div className="flex items-center gap-1.5 text-sm text-grey-500">
            <SpriteIcon name="location" className="h-4 w-4 shrink-0" />
            <span>{location}</span>
          </div>
        )}

        {description && <p className="text-sm leading-relaxed text-grey-600">{description}</p>}

        {visitorInfo && <p className="text-sm text-grey-500">{visitorInfo}</p>}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 border-t border-grey-100 p-4">
        {onLike && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onLike}
            icon={
              liked ? (
                <SpriteIcon name="heart-filled" className="h-4 w-4 text-error-100" />
              ) : (
                <SpriteIcon name="heart-regular" className="h-4 w-4" />
              )
            }
          >
            {liked ? 'Liked' : 'Like'}
          </Button>
        )}
        {onShare && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onShare}
            icon={<ShareRegular className="h-4 w-4" />}
          >
            Share
          </Button>
        )}
        {onDirections && (
          <Button
            variant="primary"
            size="sm"
            onClick={onDirections}
            icon={<NavigationRegular className="h-4 w-4" />}
            className="ml-auto"
          >
            Directions
          </Button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Exported component                                                */
/* ------------------------------------------------------------------ */
const MapObjectCardExpanded: React.FC<MapObjectCardExpandedProps> = ({
  variant = 'default',
  ref,
  ...props
}) => {
  if (variant === 'popup') {
    return (
      <PopupLayout
        ref={ref}
        image={props.image}
        title={props.title}
        category={props.category}
        onClose={props.onClose}
        onLike={props.onLike}
        liked={props.liked}
        ctaLabel={props.ctaLabel}
        onCtaClick={props.onCtaClick}
        ctaHref={props.ctaHref}
        directionsLabel={props.directionsLabel}
        coordinates={props.coordinates}
        className={props.className}
      />
    )
  }

  return <DefaultLayout ref={ref} {...props} />
}

export { MapObjectCardExpanded }
