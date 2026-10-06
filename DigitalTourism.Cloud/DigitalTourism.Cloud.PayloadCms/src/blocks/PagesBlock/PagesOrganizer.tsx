'use client'

import React from 'react'
import { cn, Section, Container } from '@/components/ui'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/primitives/Button'
import { CarouselShell } from '@/components/CarouselShell'
import RichText from '@/components/RichText'
import type { PageCardData } from '@/components/PagesDisplay/types'

export interface PagesOrganizerProps {
  heading?: string
  description?: any
  ctaLabel?: string
  ctaUrl?: string
  items: PageCardData[]
  className?: string
}

export const PagesOrganizer: React.FC<PagesOrganizerProps> = ({
  heading,
  description,
  ctaLabel,
  ctaUrl,
  items,
  className,
}) => {
  return (
    <Section padding="none" className={cn(className)}>
      <div className="relative overflow-hidden rounded-bl-[180px] rounded-br-[47px] rounded-tl-[47px] rounded-tr-[47px] bg-primary-100 md:rounded-bl-[385px]">
        {/* Decorative watermark */}
        <img
          src="/watermark.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-[200px] -top-[100px] h-[1200px] w-[1200px] opacity-30"
        />

        <Container className="relative z-10 py-16 md:py-28">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
            {/* Left: text content */}
            <div className="flex max-w-[510px] shrink-0 flex-col gap-7">
              {heading && (
                <h2 className="font-heading text-3xl font-bold leading-[1.1] text-heading md:text-5xl lg:text-[60px]">
                  {heading}
                </h2>
              )}
              {description && (
                <RichText
                  data={description}
                  enableGutter={false}
                  className="text-lg font-medium leading-normal text-heading md:text-xl"
                />
              )}
              {ctaLabel && ctaUrl && (
                <div>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={ctaUrl}>{ctaLabel}</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right: card carousel */}
            {items.length > 0 && (
              <div className="min-w-0 flex-1">
                <CarouselShell
                  options={{ loop: true, align: 'start', containScroll: false }}
                  showProgress={false}
                  slideClassName="basis-[80%] sm:basis-[55%] md:basis-[40%] lg:basis-[33.33%]"
                >
                  {items.map((item, index) => (
                    <Link
                      key={item.id ?? index}
                      href={item.href}
                      className="group relative block h-[480px] overflow-hidden rounded-2xl md:h-[582px]"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-black/70 to-75%" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <p className="font-heading text-2xl font-extrabold leading-tight text-white md:text-[29px]">
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </CarouselShell>
              </div>
            )}
          </div>
        </Container>
      </div>
    </Section>
  )
}
