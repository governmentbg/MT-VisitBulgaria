'use client'

import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { Section, Container } from '@/components/ui'
import { FactItem, type FactItemData } from './FactItem'

export type { FactItemData } from './FactItem'

export interface FactsListingProps {
  heading?: string
  description?: string
  imageSlot: React.ReactNode
  imagePosition?: 'left' | 'right'
  weatherSlot?: React.ReactNode
  items: FactItemData[]
}

export const FactsListing: React.FC<FactsListingProps> = ({
  heading,
  description,
  imageSlot,
  imagePosition = 'left',
  weatherSlot,
  items,
}) => {
  if (!items.length) return null

  // Weather overflows toward the facts column; flip anchor based on image side
  const weatherPosition =
    imagePosition === 'left'
      ? 'right-0 md:right-[-2rem]'
      : 'left-0 md:left-[-2rem]'

  const imageColumn = (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">{imageSlot}</div>
      {weatherSlot && (
        <div className={cn('absolute top-16 z-10', weatherPosition)}>
          {weatherSlot}
        </div>
      )}
    </div>
  )

  const factsColumn = (
    <div className="flex flex-col gap-6 md:gap-7">
      {items.map((item, index) => (
        <FactItem key={index} {...item} />
      ))}
    </div>
  )

  const isImageRight = imagePosition === 'right'

  return (
    <Section>
      <Container>
        {/* Heading + description */}
        {(heading || description) && (
          <div className="mb-12 text-center md:mb-16">
            {heading && (
              <h2 className="font-heading text-3xl font-bold leading-tight text-grey-900 md:text-4xl lg:text-[3.75rem] lg:leading-[1.15]">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 font-sans text-base font-medium leading-relaxed text-grey-500 md:text-lg">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Two-column layout: desktop/tablet */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
          {/* Mobile: facts first, then image. Desktop: controlled by imagePosition */}
          <div className={cn('order-2 md:order-none', isImageRight && 'md:order-2')}>
            {imageColumn}
          </div>
          <div className={cn('order-1 md:order-none', isImageRight && 'md:order-1')}>
            {factsColumn}
          </div>
        </div>
      </Container>
    </Section>
  )
}
