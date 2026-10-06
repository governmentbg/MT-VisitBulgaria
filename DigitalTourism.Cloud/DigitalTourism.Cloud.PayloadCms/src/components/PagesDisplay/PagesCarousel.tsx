'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import AutoScroll from 'embla-carousel-auto-scroll'
import { CarouselShell } from '@/components/CarouselShell'
import { ObjectCardOverlay } from '@/components/ui'
import type { PageCardData } from './types'

interface PagesCarouselProps {
  id?: string
  items: PageCardData[]
}

/**
 * Sinusoidal vertical offsets repeating every 4 slides.
 * Pattern: middle → top → middle → bottom
 */
const slideOffsets = [
  'pt-6 lg:pt-10', // middle
  'pt-0', // top
  'pt-6 lg:pt-10', // middle
  'pt-12 lg:pt-20', // bottom
]

export const PagesCarousel: React.FC<PagesCarouselProps> = ({ id, items }) => {
  const t = useTranslations('common')
  const plugins = useMemo(
    () => [
      AutoScroll({
        speed: 0.5,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ],
    [],
  )

  if (!items.length) return null

  return (
    <div className="pages-carousel">
      <CarouselShell
        id={id}
        options={{ loop: true }}
        plugins={plugins}
        showArrows={false}
        showProgress={false}
        slideClassName="basis-[65%] sm:basis-[30%] mob-ls:basis-[24%]  lg:basis-[30rem]"
      >
        {items.map((item, index) => (
          <div key={item.id} className={slideOffsets[index % slideOffsets.length]}>
            <ObjectCardOverlay
              image={item.image}
              title={item.title}
              category={item.label}
              href={item.href}
              actionVariant="secondary"
              actionLabel={t('learnMore')}
              className="aspect-[460/672] min-h-0"
            />
          </div>
        ))}
      </CarouselShell>
    </div>
  )
}
