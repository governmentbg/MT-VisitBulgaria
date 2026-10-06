'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { CMSLink } from '@/components/Link'
import { SpriteIcon } from '@/components/ui/SpriteIcon'

import type { MainMenu, Media } from '@/payload-types'

type Tab = NonNullable<MainMenu['tabs']>[number]
type NavItem = NonNullable<Tab['navItems']>[number]

const DEFAULT_CARD_IMAGE = '/placeholder-destination.svg'

/** Extract the best image URL from a populated media upload field. */
function getCardImageUrl(image: unknown): string {
  if (typeof image !== 'object' || image === null) return DEFAULT_CARD_IMAGE
  const media = image as Media
  return (
    media.sizes?.thumbnail?.url ?? media.sizes?.small?.url ?? media.url ?? DEFAULT_CARD_IMAGE
  )
}

export interface DestinationsOverlayProps {
  tab: Tab
  onClose: () => void
}

function getCategories(tab: Tab) {
  const items = tab.navItems ?? []
  return items
    .filter(
      (item): item is NavItem & { listLinks: NonNullable<NavItem['listLinks']> } =>
        item.listLinks != null && (item.listLinks.links?.length ?? 0) > 0,
    )
    .map((item) => ({
      tag: item.listLinks.tag ?? '',
      links: (item.listLinks.links ?? []).map((l) => ({
        link: l.link,
        label: l.link?.label ?? '',
        image: getCardImageUrl(l.image),
      })),
    }))
}

export const DestinationsOverlay: React.FC<DestinationsOverlayProps> = ({ tab, onClose }) => {
  const tNav = useTranslations('navigation')
  const categories = getCategories(tab)
  const [activeIndex, setActiveIndex] = useState(0)

  const activeCategory = categories[activeIndex]
  const cards = activeCategory?.links ?? []

  return (
    <div className="flex w-[1408px] rounded-2xl bg-white overflow-hidden min-h-[440px]">
      {/* Left sidebar */}
      <div className="shrink-0 pl-16 py-6 flex flex-col justify-between">
        <nav className="w-[192px]">
          {categories.map((cat, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="float-left clear-left mb-4 text-left font-sans text-[16px] leading-[1.5] transition-colors"
              >
                <span
                  className={`relative pb-1 after:block after:absolute after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:ease-out ${
                    isActive
                      ? 'font-bold text-grey-900 after:w-[calc(100%)]'
                      : 'font-normal text-grey-900 after:w-0 hover:text-grey-700'
                  }`}
                >
                  {cat.tag}
                </span>
              </button>
            )
          })}
        </nav>

        {tab.link && (
          <CMSLink
            {...tab.link}
            appearance="inline"
            className="inline-flex items-center gap-1.5 font-sans text-[14px] font-bold text-grey-900 underline underline-offset-4 decoration-1 transition-colors hover:text-primary"
            onClick={onClose}
          >
            {tNav('viewAll')}
            <SpriteIcon name="arrow-up-right" className="size-3" />
          </CMSLink>
        )}
      </div>

      {/* Green background area covering the entire grid */}
      <div className="relative flex-1 bg-primary-50 py-6 pr-8 pl-8">
        {/* Watermark aligned right */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/watermark.svg"
            alt=""
            className="absolute -right-10 top-[-37%] h-[870px] w-auto"
          />
        </div>

        {/* 3 cols at 1920px, wraps to 2 when narrower */}
        <div className="relative grid grid-cols-[repeat(auto-fill,minmax(338px,1fr))] gap-x-8 gap-y-2 content-start">
          {cards.map((card, cardIndex) => {
            return (
              <CMSLink
                key={cardIndex}
                {...card.link}
                appearance="inline"
                className="group flex h-[123px] items-center gap-6 py-2 no-underline cursor-pointer"
                onClick={onClose}
              >
                <div className="relative h-[107px] w-[160px] shrink-0 overflow-hidden rounded-md bg-grey-100">
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch pt-2.5 pb-2">
                  <span className="font-sans text-[14px] font-medium leading-[1.4] text-grey-900">
                    {card.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-sans text-[14px] font-bold text-grey-900 underline underline-offset-4 decoration-1 transition-colors group-hover:text-primary">
                    {tNav('viewAll')}
                    <SpriteIcon name="arrow-up-right" className="size-3" />
                  </span>
                </div>
              </CMSLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
