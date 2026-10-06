'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { cn, StatusDot } from '@/components/ui'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/primitives/Button'
import { EventCountdownUnit } from './EventCountdownUnit'
import { CalendarLtrRegular, DismissRegular } from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import type { Media as MediaType } from '@/payload-types'

export interface EventCountdownHeroProps {
  heroImage: MediaType | number | string
  title: string
  subtitle?: string
  dateRange?: string
  targetDate?: string
  ctaLabel?: string
  ctaHref?: string
  isExpired?: boolean
  isActive?: boolean
  expiredLabel?: string
  activeLabel?: string
  countdownLabels?: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }
  className?: string
}

interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function computeCountdown(target: Date): CountdownValues {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export const EventCountdownHero: React.FC<EventCountdownHeroProps> = ({
  heroImage,
  title,
  subtitle,
  dateRange,
  targetDate,
  ctaLabel,
  ctaHref,
  isExpired: initialExpired = false,
  isActive: initialActive = false,
  expiredLabel: _expiredLabel,
  activeLabel,
  countdownLabels,
  className,
}) => {
  // Initialize with server-computed values to avoid flicker
  const [status, setStatus] = useState<'upcoming' | 'active' | 'expired'>(
    initialExpired ? 'expired' : initialActive ? 'active' : 'upcoming',
  )
  const [countdown, setCountdown] = useState<CountdownValues>(() => {
    if (initialExpired || initialActive || !targetDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    return computeCountdown(new Date(targetDate))
  })

  const updateCountdown = useCallback(() => {
    if (!targetDate || initialExpired) return
    const target = new Date(targetDate)
    const now = new Date()
    if (target <= now) {
      // Start date passed — check if this is an active event (server told us)
      if (initialActive) {
        setStatus('active')
      } else {
        setStatus('expired')
      }
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }
    setStatus('upcoming')
    setCountdown(computeCountdown(target))
  }, [targetDate, initialExpired, initialActive])

  useEffect(() => {
    updateCountdown()
    if (status === 'expired' || status === 'active' || !targetDate) return
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [updateCountdown, status, targetDate])

  const isExpired = status === 'expired'
  const isActive = status === 'active'

  return (
    <div
      className={cn(
        'relative flex min-h-[60vh] flex-col items-center justify-end pb-12 md:min-h-[70vh] md:pb-[120px] lg:min-h-[75vh] lg:pb-[197px]',
        className,
      )}
    >
      {/* Background image */}
      {heroImage && typeof heroImage !== 'string' && typeof heroImage !== 'number' && (
        <Media
          fill
          priority
          usePayloadSizes
          imgClassName="object-cover"
          resource={heroImage}
          preferredSize="og"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0) 4%, rgba(0,0,0,0.7) 74%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.36) 100%)',
        }}
      />

      {/* Wave decoration at bottom */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 translate-y-[1px] block w-full h-[30px] sm:h-[40px] md:h-[60px] lg:h-[80px]"
        viewBox="0 0 1920 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 26Q480 74 960 50Q1440 26 1920 42V80H0Z"
          fill="white"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-4 text-center">
        <h1 className="font-heading text-3xl font-bold leading-[1.2] text-white sm:text-5xl md:text-[60px] md:leading-[72px] pt-16">
          {title}
        </h1>

        {subtitle && (
          <p className="max-w-[926px] font-heading text-base font-semibold leading-7 text-white/90 md:text-lg">
            {subtitle}
          </p>
        )}

        {dateRange && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 backdrop-blur-sm">
            <CalendarLtrRegular className="h-5 w-5 shrink-0 text-white" />
            <span className="font-heading text-center text-sm font-semibold text-white sm:text-base md:text-lg">
              {dateRange}
            </span>
          </div>
        )}

        {/* Active badge */}
        {isActive && (
          <div className="flex items-center gap-2.5 rounded-full border border-countdown-stroke bg-countdown px-6 py-3 backdrop-blur-sm">
            <StatusDot color="primary" size="md" ping />
            <span className="font-heading text-lg font-semibold text-white md:text-xl">
              {activeLabel ?? 'Happening now'}
            </span>
          </div>
        )}

        {/* Countdown — only for upcoming events */}
        {targetDate && !isActive && (
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
            <EventCountdownUnit value={countdown.days} label={countdownLabels?.days ?? 'Days'} inactive={isExpired} />
            <EventCountdownUnit value={countdown.hours} label={countdownLabels?.hours ?? 'Hours'} inactive={isExpired} />
            <EventCountdownUnit value={countdown.minutes} label={countdownLabels?.minutes ?? 'Minutes'} inactive={isExpired} />
            <EventCountdownUnit value={countdown.seconds} label={countdownLabels?.seconds ?? 'Seconds'} inactive={isExpired} />
          </div>
        )}

        {/* CTA button */}
        {ctaHref && (
          <Button
            asChild
            variant="secondary"
            size="sm"
            className={cn(isExpired && 'pointer-events-none opacity-70')}
          >
            <a
              href={isExpired ? undefined : ctaHref}
              target={isExpired ? undefined : '_blank'}
              rel={isExpired ? undefined : 'noopener noreferrer'}
              aria-disabled={isExpired}
            >
              {ctaLabel}
              {isExpired ? (
                <DismissRegular />
              ) : (
                <SpriteIcon name="arrow-up-right" />
              )}
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
