import React from 'react'
import { cn, Pill } from '@/components/ui'
import { CMSLink } from '@/components/Link'

import type { Page } from '@/payload-types'

type LinkData = {
  type?: 'custom' | 'reference' | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: Page | string | number
  } | null
  url?: string | null
  label?: string | null
  appearance?: string | null
}

export interface SectionHeaderProps {
  sectionLabel?: string | null
  heading: string
  description?: string | null
  viewAllLink?: LinkData | null
  className?: string
  headingAs?: 'h1' | 'h2' | 'h3'
  alignment?: 'left' | 'center' | 'right'
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionLabel,
  heading,
  description,
  viewAllLink,
  className,
  headingAs: Heading = 'h2',
  alignment = 'left',
}) => {
  return (
    <div className={cn('mb-10', alignment === 'center' && 'text-center', alignment === 'right' && 'text-right', className)}>
      <div
        className={cn(
          'flex flex-col gap-4',
          alignment === 'center' && 'items-center',
          alignment === 'right' && 'items-end',
          viewAllLink && alignment === 'left' && 'md:flex-row md:items-end md:justify-between',
        )}
      >
        <div className={cn('flex flex-col gap-3', alignment === 'center' && 'items-center', alignment === 'right' && 'items-end')}>
          {sectionLabel && (
            <Pill variant="brand" size="md">
              {sectionLabel}
            </Pill>
          )}
          <Heading className="font-heading text-2xl font-bold leading-tight text-grey-900 md:text-3xl lg:text-4xl">
            {heading}
          </Heading>
          {description && (
            <p className="max-w-2xl text-base font-medium leading-relaxed text-grey-500">
              {description}
            </p>
          )}
        </div>

        {(viewAllLink?.url || viewAllLink?.reference) && (
          <div className="shrink-0">
            <CMSLink {...viewAllLink} appearance="primary" size="sm" />
          </div>
        )}
      </div>
    </div>
  )
}
