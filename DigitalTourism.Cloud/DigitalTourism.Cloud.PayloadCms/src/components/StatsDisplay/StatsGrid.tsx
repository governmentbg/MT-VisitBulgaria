'use client'

import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { Section, Container } from '@/components/ui'
import { StatItem } from './StatItem'
import type { StatItemData } from './types'

const bgClasses = {
  transparent: '',
  'primary-800': 'bg-primary-800',
  'grey-900': 'bg-grey-900',
  'grey-50': 'bg-grey-0',
} as const

const colClasses = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
} as const

export interface StatsGridProps {
  heading?: string
  items: StatItemData[]
  columns?: 2 | 3 | 4
  colorScheme?: 'light' | 'dark'
  background?: keyof typeof bgClasses
  className?: string
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  heading,
  items,
  columns = 2,
  colorScheme = 'dark',
  background = 'primary-800',
  className,
}) => {
  if (!items.length) return null

  const isDark = colorScheme === 'dark'

  return (
    <Section
      padding="lg"
      className={cn(bgClasses[background], className)}
    >
      <Container>
        {heading && (
          <h2
            className={cn(
              'mb-10 text-center font-heading text-3xl font-bold leading-[1.1] md:mb-12 md:text-[2.5rem]',
              isDark ? 'text-white' : 'text-grey-900',
            )}
          >
            {heading}
          </h2>
        )}
        <div
          className={cn(
            'mx-auto grid max-w-4xl grid-cols-2 gap-x-8 gap-y-8 md:gap-y-10',
            colClasses[columns],
          )}
        >
          {items.map((item, index) => (
            <StatItem
              key={index}
              {...item}
              size="lg"
              colorScheme={colorScheme}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
