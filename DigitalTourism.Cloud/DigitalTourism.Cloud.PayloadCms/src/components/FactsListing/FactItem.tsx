'use client'

import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { Link } from '@/i18n/routing'

export interface FactItemData {
  icon?: React.ReactNode
  title: string
  description?: string
  linkLabel?: string
  linkHref?: string
}

interface FactItemProps extends FactItemData {
  className?: string
}

export const FactItem: React.FC<FactItemProps> = ({
  title,
  description,
  linkLabel,
  linkHref,
  className,
}) => {
  return (
    <div className={cn('flex gap-5', className)}>
      {/* Vertical accent line */}
      <div className="hidden shrink-0 md:block">
        <div className="h-[2.5em] w-[3px] rounded-full bg-primary" />
      </div>

      <div className="flex flex-1 flex-col gap-5 border-l-2 border-primary py-1 pl-5 md:border-l-0 md:py-2 md:pl-0">
        <h3 className="font-sans text-lg font-bold text-grey-900 md:text-[1.375rem] md:leading-[1.3]">
          {title}
        </h3>

        {description && (
          <p className="font-sans text-base font-light leading-relaxed text-grey-600 md:text-lg md:leading-[1.5]">
            {description}
          </p>
        )}

        {linkLabel && linkHref && (
          <Link
            href={linkHref}
            className="inline-flex items-center gap-1.5 font-sans text-base font-semibold text-grey-900 transition-colors hover:text-primary"
          >
            {linkLabel}
            <SpriteIcon name="arrow-up-right" className="h-5 w-5" />
          </Link>
        )}

        <div className="border-b border-grey-200" />
      </div>
    </div>
  )
}
