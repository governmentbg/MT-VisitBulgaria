'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/components/ui'
import { SpriteIcon } from '@/components/ui/SpriteIcon'

export interface RegionInfoCardProps {
  name: string
  description?: string
  linkHref?: string
  linkLabel?: string
  className?: string
}

export const RegionInfoCard: React.FC<RegionInfoCardProps> = ({
  name,
  description,
  linkHref,
  linkLabel,
  className,
}) => {
  const t = useTranslations('common')
  const content = (
    <div className="flex h-full flex-col gap-4">
      <h3 className="font-heading text-xl font-medium text-grey-900 lg:text-2xl line-clamp-2">{name}</h3>
      {description && (
        <p className="line-clamp-3 min-h-[4.875em] text-sm leading-relaxed text-grey-500 lg:text-base">
          {description}
        </p>
      )}
      {linkHref && (
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-grey-900 transition-colors group-hover:text-primary">
          {linkLabel || t('learnMore')}
          <SpriteIcon name="arrow-up-right" className="h-4 w-4" />
        </span>
      )}
    </div>
  )

  if (linkHref) {
    return (
      <a
        href={linkHref}
        className={cn('group block rounded-2xl bg-white px-8 py-6 transition-shadow hover:shadow-lg', className)}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={cn('rounded-2xl bg-white px-8 py-6', className)}>
      {content}
    </div>
  )
}
