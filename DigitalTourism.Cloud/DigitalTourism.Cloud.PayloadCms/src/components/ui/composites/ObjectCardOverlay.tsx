import { cn } from '@/components/ui/theme/cn'
import { Link } from '@/i18n/routing'
import * as React from 'react'
import { DecorativeButton } from '../primitives/DecorativeButton'
import { LikeButton } from '../primitives/LikeButton'
import { Pill } from '../primitives/Pill'

export interface ObjectCardOverlayProps extends React.HTMLAttributes<HTMLElement> {
  image: string
  title: string
  subtitle?: string | string[]
  category?: string
  href?: string
  actionLabel?: string
  actionVariant?: 'text' | 'primary' | 'secondary'
  liked?: boolean
  onLike?: () => void
  size?: 'default' | 'sm'
  ref?: React.Ref<HTMLElement>
}

const cardClasses =
  'group relative flex h-full flex-col overflow-hidden rounded-2xl font-sans no-underline md:min-h-0'

const paddingClasses = {
  default: {
    top: 'p-5 mob-ls:p-3 md:px-10 md:pt-9',
    bottom: 'p-5 mob-ls:p-3 md:px-10 md:pb-9',
    title: 'font-heading text-3xl font-bold leading-[1.1] text-white mob-ls:text-xl lg:text-[2.5rem] line-clamp-4',
    subtitle: 'text-base font-medium leading-[1.44] text-white line-clamp-3 mob-ls:text-sm mob-ls:line-clamp-2',
  },
  sm: {
    top: 'p-4 mob-ls:p-3 md:p-5',
    bottom: 'p-4 mob-ls:p-3 md:p-5',
    title: 'font-heading text-2xl font-bold leading-[1.1] text-white mob-ls:text-lg md:text-3xl line-clamp-3',
    subtitle: 'text-sm font-medium leading-[1.44] text-white line-clamp-3 mob-ls:text-sm mob-ls:line-clamp-2',
  },
} as const

const ObjectCardOverlay: React.FC<ObjectCardOverlayProps> = ({
  image,
  title,
  subtitle,
  category,
  href,
  actionLabel = 'Explore',
  actionVariant = 'text',
  liked,
  onLike,
  size = 'default',
  className,
  ref,
  ...props
}) => {
  const subtitleLines = Array.isArray(subtitle) ? subtitle : subtitle ? [subtitle] : []
  const pad = paddingClasses[size]

  return (
    <div
      className={cn(cardClasses, className)}
      ref={ref as React.Ref<HTMLDivElement>}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {/* Background image + gradient */}
      <div className="absolute inset-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-grey-300" />
        )}
        <div className="card-overlay-gradient pointer-events-none absolute inset-0" />
      </div>

      {/* Top row: Pill + Like */}
      <div className={cn('pointer-events-none relative z-10 flex items-start justify-between gap-2', pad.top)}>
        {category ? (
          <Pill variant="default" size="xl" className="min-w-0 shrink truncate">
            {category}
          </Pill>
        ) : (
          <div />
        )}
        {onLike && (
          <div className="pointer-events-auto relative z-10 shrink-0">
            <LikeButton liked={liked} onToggle={() => onLike()} size="lg" variant="secondary" />
          </div>
        )}
      </div>

      {/* Bottom content */}
      <div className={cn('pointer-events-none relative z-10 mt-auto flex flex-col gap-4', pad.bottom)}>
        <h3 className={pad.title}>
          {title}
        </h3>
        {subtitleLines.length > 0 && (
          <div className={pad.subtitle}>
            {subtitleLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {href && (
          <DecorativeButton
            variant={actionVariant === 'text' ? 'link' : actionVariant}
            size={actionVariant === 'text' ? 'clear' : 'sm'}
            className={actionVariant === 'text' ? 'text-white group-hover:text-white/80' : 'self-start'}
          >
            {actionLabel}
          </DecorativeButton>
        )}
      </div>

      {/* Stretched link — makes the entire card clickable */}
      {href && (
        <Link href={href} className="absolute inset-0 z-[5]" aria-label={title}>
          <span className="sr-only">{title}</span>
        </Link>
      )}
    </div>
  )
}

export { ObjectCardOverlay }
