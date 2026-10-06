import React from 'react'

import type { StatsBlock as StatsBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { StatsPanel } from '@/components/StatsDisplay/StatsPanel'
import { StatsGrid } from '@/components/StatsDisplay/StatsGrid'
import { StatsCounters } from '@/components/StatsDisplay/StatsCounters'
import { StatsInline } from '@/components/StatsDisplay/StatsInline'
import type { StatItemData } from '@/components/StatsDisplay/types'

type Props = StatsBlockProps & { pageId?: number }

export const StatsBlockComponent: React.FC<Props> = (props) => {
  const { displayMode = 'panel', heading, image, cardColor, columns, items } = props

  if (!items?.length) return null

  const statItems: StatItemData[] = items.map((item) => {
    let iconSlot: React.ReactNode = undefined
    if (item.icon) {
      iconSlot = (
        <Media
          resource={item.icon}
          usePayloadSizes
          preferredSize="thumbnail"
          className="h-6 w-6 object-contain"
          imgClassName="h-6 w-6 object-contain"
        />
      )
    }
    return {
      value: item.value,
      label: item.label,
      icon: iconSlot,
    }
  })

  const panelCardColors = ['primary-800', 'primary-900', 'grey-900'] as const
  const gridBackgrounds = ['transparent', 'primary-800', 'grey-900', 'grey-50'] as const

  switch (displayMode) {
    case 'panel':
      return (
        <StatsPanel
          heading={heading || undefined}
          items={statItems}
          cardColor={
            panelCardColors.includes(cardColor as (typeof panelCardColors)[number])
              ? (cardColor as (typeof panelCardColors)[number])
              : 'primary-800'
          }
          imageSlot={
            image ? (
              <Media
                resource={image}
                usePayloadSizes
                preferredSize="large"
                className="h-full w-full object-cover"
                imgClassName="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-grey-200" />
            )
          }
        />
      )
    case 'grid':
      return (
        <StatsGrid
          heading={heading || undefined}
          items={statItems}
          columns={columns ? (Number(columns) as 2 | 3 | 4) : 2}
          background={
            gridBackgrounds.includes(cardColor as (typeof gridBackgrounds)[number])
              ? (cardColor as (typeof gridBackgrounds)[number])
              : 'primary-800'
          }
          colorScheme={
            cardColor === 'grey-50' || cardColor === 'transparent' ? 'light' : 'dark'
          }
        />
      )
    case 'counters':
      return <StatsCounters heading={heading || undefined} items={statItems} />
    case 'inline':
      return <StatsInline items={statItems} />
    default:
      return null
  }
}
