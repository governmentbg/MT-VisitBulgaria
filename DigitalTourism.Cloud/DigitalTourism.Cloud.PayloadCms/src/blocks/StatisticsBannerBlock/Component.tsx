'use client'

import React from 'react'

import type { StatisticsBannerBlock as StatisticsBannerBlockProps } from '@/payload-types'

import { cn, Container } from '@/components/ui'
import { Media } from '@/components/Media'
import { useAnimatedValue } from '@/components/StatsDisplay/useCountUp'

const bgClasses = {
  dark: 'bg-primary-900 text-white',
  primary: 'bg-primary text-white',
  'primary-dark': 'bg-primary-800 text-white',
  light: 'bg-primary-50 text-grey-900',
} as const

type StatItemProps = {
  value: string
  label: string
  icon?: NonNullable<StatisticsBannerBlockProps['items']>[number]['icon']
  colorScheme: 'dark' | 'light'
}

const StatisticItem: React.FC<StatItemProps> = ({ value, label, icon, colorScheme }) => {
  const { displayValue, ref } = useAnimatedValue(value)
  const isDark = colorScheme === 'dark'

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      {icon && typeof icon === 'object' && (
        <div
          className={cn(
            'mb-1 flex h-12 w-12 items-center justify-center rounded-xl',
            isDark ? 'bg-white/15' : 'bg-primary/15',
          )}
        >
          <Media
            resource={icon}
            usePayloadSizes
            preferredSize="thumbnail"
            className="h-6 w-6"
            imgClassName="h-6 w-6 object-contain"
          />
        </div>
      )}
      <span className="font-heading text-3xl font-bold tabular-nums md:text-4xl lg:text-5xl">
        {displayValue}
      </span>
      <span
        className={cn(
          'text-sm font-medium md:text-base',
          isDark ? 'text-white/70' : 'text-grey-500',
        )}
      >
        {label}
      </span>
    </div>
  )
}

export const StatisticsBannerBlockComponent: React.FC<StatisticsBannerBlockProps> = ({
  items,
  backgroundColor = 'dark',
}) => {
  if (!items?.length) return null

  const bgKey = backgroundColor as keyof typeof bgClasses
  const colorScheme = bgKey === 'light' ? 'light' : 'dark'

  return (
    <div className={cn('py-16 md:py-20', bgClasses[bgKey] ?? bgClasses.dark)}>
      <Container>
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-around md:gap-8">
          {items.map(
            (
              item: NonNullable<StatisticsBannerBlockProps['items']>[number],
              index: number,
            ) => (
              <StatisticItem
                key={index}
                value={item.value}
                label={item.label}
                icon={item.icon}
                colorScheme={colorScheme}
              />
            ),
          )}
        </div>
      </Container>
    </div>
  )
}
