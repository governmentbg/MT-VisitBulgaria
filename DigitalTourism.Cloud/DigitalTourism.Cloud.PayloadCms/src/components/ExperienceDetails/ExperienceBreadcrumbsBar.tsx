'use client'

import React, { useEffect, useState } from 'react'
import { cn, LinkIconButton } from '@/components/ui'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { FacebookIcon, XIcon, InstagramIcon } from '@/Footer/icons'
import { SaveFavoriteButton } from '@/components/favorites'
import { AddToTripButton } from '@/components/AddToTrip'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface ExperienceBreadcrumbsBarProps {
  breadcrumbs: BreadcrumbItem[]
  experienceTitle: string
  /** Collection slug, e.g. "hotels", "events" */
  collectionSlug?: string
  /** Numeric experience ID */
  experienceId?: number
  saveLabel?: string
  savedLabel?: string
  socialLinks?: {
    facebook?: string
    x?: string
    instagram?: string
  }
  className?: string
}

export const ExperienceBreadcrumbsBar: React.FC<ExperienceBreadcrumbsBarProps> = ({
  breadcrumbs,
  experienceTitle,
  collectionSlug,
  experienceId,
  saveLabel = 'Запази в любими',
  savedLabel = 'Запазено в любими',
  socialLinks,
  className,
}) => {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const socialIcons = [
    {
      key: 'facebook',
      Icon: FacebookIcon,
      href:
        socialLinks?.facebook ||
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      label: 'Facebook',
    },
    {
      key: 'x',
      Icon: XIcon,
      href:
        socialLinks?.x ||
        `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(experienceTitle)}`,
      label: 'X',
    },
    {
      key: 'instagram',
      Icon: InstagramIcon,
      href: socialLinks?.instagram || '#',
      label: 'Instagram',
    },
  ]

  return (
    <div className={cn('container py-4', className)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex flex-wrap items-center gap-2 font-heading text-sm leading-[1.2] text-grey-900 sm:text-base lg:text-xl">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <li key={index} className="flex items-center gap-2">
                  {crumb.href && !isLast ? (
                    <a
                      href={crumb.href}
                      className="font-semibold transition-colors hover:text-primary-700"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className={cn('font-semibold', isLast && 'truncate font-extrabold')}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <SpriteIcon name="chevron-right" className="h-5 w-5 flex-shrink-0 text-grey-400" />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Like / Favorite */}
          {collectionSlug && experienceId != null && (
            <SaveFavoriteButton collectionSlug={collectionSlug} id={experienceId} saveLabel={saveLabel} savedLabel={savedLabel} />
          )}

          {/* Add to Trip */}
          {collectionSlug && experienceId != null && (
            <AddToTripButton collectionSlug={collectionSlug} experienceId={experienceId} />
          )}

          {/* Social icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {socialIcons.map(({ key, Icon, href, label }) => (
              <LinkIconButton
                key={key}
                href={href}
                icon={<Icon />}
                label={label}
                variant="secondary"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
