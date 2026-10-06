'use client'

import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { Section, Container } from '@/components/ui'
import { CarouselShell } from '@/components/CarouselShell'
import type { StatItemData } from './types'
import { useAnimatedValue } from './useCountUp'

const InlineStatValue: React.FC<{ value: string; label: string; showBorder: boolean }> = ({
  value,
  label,
  showBorder,
}) => {
  const { displayValue, ref } = useAnimatedValue(value)

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-baseline gap-2 whitespace-nowrap',
        showBorder && 'border-r border-grey-200 pr-6',
      )}
    >
      <span className="font-heading text-2xl font-bold tabular-nums text-primary-800">
        {displayValue}
      </span>
      <span className="font-sans text-sm text-grey-500">
        {label}
      </span>
    </div>
  )
}

export interface StatsInlineProps {
  items: StatItemData[]
  className?: string
}

export const StatsInline: React.FC<StatsInlineProps> = ({ items, className }) => {
  if (!items.length) return null

  return (
    <Section padding="sm" className={className}>
      <Container>
        <CarouselShell
          showArrows={false}
          showProgress={false}
          slideClassName="basis-auto"
          options={{ dragFree: true }}
        >
          {items.map((item, index) => (
            <InlineStatValue
              key={index}
              value={item.value}
              label={item.label}
              showBorder={index < items.length - 1}
            />
          ))}
        </CarouselShell>
      </Container>
    </Section>
  )
}
