'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { ObjectCardOverlay } from '@/components/ui'
import type { PageCardData } from './types'

interface PagesMasonryGridProps {
  items: PageCardData[]
}

interface InternalLayoutProps {
  items: PageCardData[]
  actionLabel: string
}

const card = (item: PageCardData, actionLabel: string, size?: 'sm') => (
  <ObjectCardOverlay
    key={item.id}
    image={item.image}
    title={item.title}
    category={item.label}
    href={item.href}
    actionLabel={actionLabel}
    className="h-full min-h-0"
    size={size}
  />
)

/** Column wrapper */
const col = (children: React.ReactNode, flex?: string) => (
  <div className={`flex min-h-0 min-w-0 flex-1 flex-col gap-4 lg:gap-8 ${flex ?? ''}`}>
    {children}
  </div>
)

/** Single item within a column with a specific flex ratio */
const flexItem = (item: PageCardData, flex: string, actionLabel: string) => (
  <div className={`min-h-0 ${flex}`}>{card(item, actionLabel)}</div>
)

/** Two equal items in a row with a specific flex ratio for the row */
const flexRow = (a: PageCardData, b: PageCardData, flex: string, actionLabel: string) => (
  <div className={`flex min-h-0 gap-4 lg:gap-8 ${flex}`}>
    <div className="min-h-0 flex-1">{card(a, actionLabel)}</div>
    <div className="min-h-0 flex-1">{card(b, actionLabel)}</div>
  </div>
)

function DesktopLayout({ items, actionLabel }: InternalLayoutProps) {
  const [a, b, c, d, e, f, g, h] = items
  const count = items.length

  if (count === 1) {
    return <div className="h-full">{card(a, actionLabel)}</div>
  }

  if (count === 2) {
    return (
      <div className="flex h-full gap-4 lg:gap-8">
        <div className="min-h-0 flex-1">{card(a, actionLabel)}</div>
        <div className="min-h-0 flex-1">{card(b, actionLabel)}</div>
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className="flex h-full gap-4 lg:gap-8">
        <div className="min-h-0 flex-1">{card(a, actionLabel)}</div>
        {col(
          <>
            <div className="min-h-0 flex-1">{card(b, actionLabel)}</div>
            <div className="min-h-0 flex-1">{card(c, actionLabel)}</div>
          </>,
        )}
      </div>
    )
  }

  // 4 items: A full-height left, B flex-[59] + row(C,D) flex-[41] right
  if (count === 4) {
    return (
      <div className="flex h-full gap-4 lg:gap-8">
        <div className="min-h-0 flex-1">{card(a, actionLabel)}</div>
        {col(
          <>
            {flexItem(b, 'flex-[59]', actionLabel)}
            {flexRow(c, d, 'flex-[41]', actionLabel)}
          </>,
        )}
      </div>
    )
  }

  // 5 items: A flex-[60] + row(B,C) flex-[40] left, D + E equal halves right
  if (count === 5) {
    return (
      <div className="flex h-full gap-4 lg:gap-8">
        {col(
          <>
            {flexItem(a, 'flex-[60]', actionLabel)}
            {flexRow(b, c, 'flex-[40]', actionLabel)}
          </>,
        )}
        {col(
          <>
            <div className="min-h-0 flex-1">{card(d, actionLabel)}</div>
            <div className="min-h-0 flex-1">{card(e, actionLabel)}</div>
          </>,
        )}
      </div>
    )
  }

  // 6 items: A flex-[68] + row(B,C) flex-[32] left, D flex-[43] + row(E,F) flex-[57] right
  if (count === 6) {
    return (
      <div className="flex h-full gap-4 lg:gap-8">
        {col(
          <>
            {flexItem(a, 'flex-[68]', actionLabel)}
            {flexRow(b, c, 'flex-[32]', actionLabel)}
          </>,
        )}
        {col(
          <>
            {flexItem(d, 'flex-[43]', actionLabel)}
            {flexRow(e, f, 'flex-[57]', actionLabel)}
          </>,
        )}
      </div>
    )
  }

  // 7 items: A flex-[68] + row(B,C) flex-[32] left, D flex-[30] + row(E,F) flex-[35] + G flex-[35] right
  if (count === 7) {
    return (
      <div className="flex h-full gap-4 lg:gap-8">
        {col(
          <>
            {flexItem(a, 'flex-[68]', actionLabel)}
            {flexRow(b, c, 'flex-[32]', actionLabel)}
          </>,
        )}
        {col(
          <>
            {flexItem(d, 'flex-[30]', actionLabel)}
            {flexRow(e, f, 'flex-[35]', actionLabel)}
            {flexItem(g, 'flex-[35]', actionLabel)}
          </>,
        )}
      </div>
    )
  }

  // 8 items: A flex-[40] + B flex-[30] + row(C,D) flex-[30] left, E flex-[40] + F flex-[30] + row(G,H) flex-[30] right
  return (
    <div className="flex h-full gap-4 lg:gap-8">
      {col(
        <>
          {flexItem(a, 'flex-[40]', actionLabel)}
          {flexItem(b, 'flex-[30]', actionLabel)}
          {flexRow(c, d, 'flex-[30]', actionLabel)}
        </>,
      )}
      {col(
        <>
          {flexItem(e, 'flex-[40]', actionLabel)}
          {flexItem(f, 'flex-[30]', actionLabel)}
          {flexRow(g, h, 'flex-[30]', actionLabel)}
        </>,
      )}
    </div>
  )
}

/**
 * Tablet layout config: height (rem) + flex ratios per column.
 * Items are distributed left-first: items[0..left.length-1] → left, rest → right.
 */
const tabletLayouts: Record<number, { h: number; left: number[]; right: number[] }> = {
  1: { h: 18, left: [1],          right: [] },
  2: { h: 18, left: [1],          right: [1] },
  3: { h: 32, left: [1],          right: [1, 1] },
  4: { h: 40, left: [1],          right: [50, 50, 40] },
  5: { h: 44, left: [50, 35, 35], right: [45, 55] },
  6: { h: 50, left: [55, 45, 40], right: [40, 55, 45] },
  7: { h: 58, left: [50, 50, 40], right: [35, 45, 35, 35] },
  8: { h: 62, left: [40, 35, 35, 35], right: [35, 40, 35, 35] },
}

function TabletLayout({ items, actionLabel }: InternalLayoutProps) {
  const layout = tabletLayouts[items.length]
  if (!layout) return null

  const { h, left, right } = layout
  const leftItems = items.slice(0, left.length)
  const rightItems = items.slice(left.length)

  const renderCol = (colItems: PageCardData[], flexes: number[]) => (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {colItems.map((item, i) => (
        <div key={item.id} className="min-h-0" style={{ flex: flexes[i] }}>
          {card(item, actionLabel)}
        </div>
      ))}
    </div>
  )

  if (!right.length) {
    return <div style={{ height: `${h}rem` }}>{card(leftItems[0], actionLabel)}</div>
  }

  return (
    <div className="flex gap-4" style={{ height: `${h}rem` }}>
      {renderCol(leftItems, left)}
      {renderCol(rightItems, right)}
    </div>
  )
}

function MobileLayout({ items, actionLabel }: InternalLayoutProps) {
  const remaining = items.length - 1 // items after the hero
  const lastIsAlone = remaining > 0 && remaining % 2 === 1

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => {
        const isHero = i === 0
        const isLast = i === items.length - 1
        const spanFull = isHero || (isLast && lastIsAlone)

        return (
          <div
            key={item.id}
            className={spanFull ? 'col-span-2 h-[18rem]' : 'h-[16rem]'}
          >
            {card(item, actionLabel, 'sm')}
          </div>
        )
      })}
    </div>
  )
}

export const PagesMasonryGrid: React.FC<PagesMasonryGridProps> = ({ items }) => {
  const t = useTranslations('common')
  const actionLabel = t('learnMore')

  if (!items.length) return null

  return (
    <>
      {/* Desktop (lg+): full masonry flex layouts */}
      <div className="hidden lg:block lg:h-[62rem]">
        <DesktopLayout items={items} actionLabel={actionLabel} />
      </div>
      {/* Tablet (sm–lg): two-column masonry with fixed heights */}
      <div className="hidden sm:block lg:hidden">
        <TabletLayout items={items} actionLabel={actionLabel} />
      </div>
      {/* Mobile (<sm): compact two-column grid */}
      <div className="sm:hidden">
        <MobileLayout items={items} actionLabel={actionLabel} />
      </div>
    </>
  )
}
