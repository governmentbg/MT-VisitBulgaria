'use client'

import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { Section, Container } from '@/components/ui'
import { StatItem } from './StatItem'
import type { StatItemData } from './types'

const cardColorClasses = {
  'primary-800': 'bg-primary-800',
  'primary-900': 'bg-primary-900',
  'grey-900': 'bg-grey-900',
} as const

export interface StatsPanelProps {
  heading?: string
  items: StatItemData[]
  imageSlot: React.ReactNode
  cardColor?: keyof typeof cardColorClasses
  className?: string
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  heading,
  items,
  imageSlot,
  cardColor = 'primary-800',
  className,
}) => {
  if (!items.length) return null

  return (
    <Section padding="lg" className={className}>
      <Container>
        {/* Desktop/Tablet: relative/absolute overlap — image left, card right */}
        <div className="relative hidden sm:block">
          {/* Image — left side, ~58% width */}
          <div className="w-[58%] overflow-hidden rounded-[2.3125rem]">
            <div className="aspect-[3/2]">{imageSlot}</div>
          </div>

          {/* Card — positioned from right, vertically centered, overlapping image */}
          <div className="absolute right-0 top-1/2 z-10 w-[50%] -translate-y-1/2">
            <div
              className={cn(
                'rounded-[2.3125rem] p-8 lg:p-10',
                cardColorClasses[cardColor],
              )}
            >
              {heading && (
                <h2 className="mb-8 font-heading text-[1.875rem] font-bold leading-[1.1] text-white lg:text-[2.5rem]">
                  {heading}
                </h2>
              )}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 lg:gap-y-8">
                {items.map((item, index) => (
                  <StatItem
                    key={index}
                    {...item}
                    size="md"
                    colorScheme="dark"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile portrait: stacked with overlap */}
        <div className="sm:hidden">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl">
            <div className="aspect-[4/3]">{imageSlot}</div>
          </div>

          {/* Card overlapping image */}
          <div className="relative z-10 mx-2 -mt-16">
            <div
              className={cn(
                'rounded-2xl p-6',
                cardColorClasses[cardColor],
              )}
            >
              {heading && (
                <h2 className="mb-6 font-heading text-2xl font-bold leading-[1.1] text-white">
                  {heading}
                </h2>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {items.map((item, index) => (
                  <StatItem
                    key={index}
                    {...item}
                    size="sm"
                    colorScheme="dark"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
