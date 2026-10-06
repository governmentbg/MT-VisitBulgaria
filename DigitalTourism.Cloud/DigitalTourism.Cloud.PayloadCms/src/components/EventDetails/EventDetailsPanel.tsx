import React from 'react'
import { cn, Container } from '@/components/ui'
import { Button } from '@/components/ui/primitives/Button'
import { Media } from '@/components/Media'
import { EventInfoCard } from './EventInfoCard'
import {
  CalendarLtrRegular,
  ClockRegular,
  TicketDiagonalRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import type { Media as MediaType } from '@/payload-types'

export interface EventDetailsPanelLabels {
  heading?: string
  ctaLabel?: string
  allDay?: string
  date?: string
  time?: string
  duration?: string
  location?: string
  tickets?: string
}

export interface EventDetailsPanelProps {
  startDate?: string
  endDate?: string
  allDay?: boolean
  duration?: string
  location?: string
  ticketPriceLabel?: string
  ctaHref?: string
  image?: MediaType | number | string
  isExpired?: boolean
  locale?: string
  labels?: EventDetailsPanelLabels
  className?: string
}

function formatDate(dateString: string, locale = 'bg'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(dateString: string, locale = 'bg'): string {
  return new Date(dateString).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const EventDetailsPanel: React.FC<EventDetailsPanelProps> = ({
  startDate,
  endDate,
  allDay: isAllDay,
  duration,
  location,
  ticketPriceLabel,
  ctaHref,
  image,
  isExpired = false,
  locale = 'bg',
  labels = {},
  className,
}) => {
  const dateDisplay = startDate ? formatDate(startDate, locale) : undefined
  const timeDisplay =
    startDate && !isAllDay
      ? `${formatTime(startDate, locale)}${endDate ? ` - ${formatTime(endDate, locale)}` : ''}`
      : isAllDay
        ? (labels.allDay ?? 'All day')
        : undefined

  const infoCards = [
    dateDisplay && {
      icon: <CalendarLtrRegular className="h-6 w-6 text-primary" />,
      label: labels.date ?? 'Date',
      value: dateDisplay,
    },
    timeDisplay && {
      icon: <ClockRegular className="h-6 w-6 text-primary" />,
      label: labels.time ?? 'Time',
      value: timeDisplay,
    },
    duration && {
      icon: <ClockRegular className="h-6 w-6 text-primary" />,
      label: labels.duration ?? 'Duration',
      value: duration,
    },
    location && {
      icon: <SpriteIcon name="location" className="h-6 w-6 text-primary" />,
      label: labels.location ?? 'Location',
      value: location,
    },
    ticketPriceLabel && {
      icon: <TicketDiagonalRegular className="h-6 w-6 text-primary" />,
      label: labels.tickets ?? 'Tickets',
      value: ticketPriceLabel,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[]

  return (
    <div className={cn('mx-auto max-w-[1920px]', className)}>
      <div className="overflow-hidden rounded-3xl bg-primary-800">
        <Container className="py-8 lg:py-16">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: heading + info cards + CTA */}
            <div className="flex w-full max-w-[827px] flex-col gap-10">
              <h2 className="font-heading text-3xl font-bold leading-[1.15] text-white md:text-5xl ">
                {labels.heading ?? 'Event Details'}
              </h2>

              <div className="flex flex-col gap-6">
                {infoCards.map((card, i) => (
                  <EventInfoCard key={i} icon={card.icon} label={card.label} value={card.value} />
                ))}
              </div>

              {!isExpired && ctaHref && (
                <Button asChild variant="secondary" size="xs">
                  <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                    {labels.ctaLabel ?? 'Go to event'}
                    <SpriteIcon name="arrow-up-right" />
                  </a>
                </Button>
              )}
            </div>

            {/* Right: image */}
            {image && typeof image !== 'string' && typeof image !== 'number' && (
              <div className="relative aspect-square w-full max-w-[704px] overflow-hidden rounded-2xl lg:shrink-0">
                <Media
                  fill
                  imgClassName="object-cover rounded-2xl"
                  resource={image}
                  usePayloadSizes
                  preferredSize="xlarge"
                />
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  )
}
