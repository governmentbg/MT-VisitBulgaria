'use client'

import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { Section, Container } from '@/components/ui'
import type { StatItemData } from './types'
import { useAnimatedValue } from './useCountUp'

interface CounterCardProps extends StatItemData {
  className?: string
}

const CounterCard: React.FC<CounterCardProps> = ({ value, label, icon, className }) => {
  const { displayValue, ref } = useAnimatedValue(value)

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-md',
        className,
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary [&_svg]:h-6 [&_svg]:w-6">
          {icon}
        </div>
      )}
      <span className="font-heading text-3xl font-bold tabular-nums text-grey-900 md:text-4xl">
        {displayValue}
      </span>
      <span className="font-sans text-sm text-grey-500">{label}</span>
    </div>
  )
}

export interface StatsCountersProps {
  heading?: string
  items: StatItemData[]
  className?: string
}

export const StatsCounters: React.FC<StatsCountersProps> = ({
  heading,
  items,
  className,
}) => {
  if (!items.length) return null

  return (
    <Section padding="lg" className={cn('bg-grey-0', className)}>
      <Container>
        {heading && (
          <h2 className="mb-10 text-center font-heading text-3xl font-bold leading-[1.1] text-grey-900 md:mb-12 md:text-[2.5rem]">
            {heading}
          </h2>
        )}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((item, index) => (
            <CounterCard key={index} {...item} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
