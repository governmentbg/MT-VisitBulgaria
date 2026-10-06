'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { EventDetailsPanel } from './EventDetailsPanel'
import type { Media as MediaType } from '@/payload-types'

const mockImage: MediaType = {
  id: 1,
  alt: 'Event photo',
  url: 'https://picsum.photos/seed/event-details/704/704',
  width: 704,
  height: 704,
  filename: 'event-details.jpg',
  mimeType: 'image/jpeg',
  filesize: 100000,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

const meta = {
  title: 'EventDetails/EventDetailsPanel',
  component: EventDetailsPanel,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1000-4695',
    },
  },
} satisfies Meta<typeof EventDetailsPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockLabels = {
  heading: 'Детайли за събитието',
  ctaLabel: 'Към събитието',
  allDay: 'Целодневно',
  date: 'Дата',
  time: 'Час',
  location: 'Локация',
  tickets: 'Билети',
}

export const Default: Story = {
  args: {
    startDate: '2026-02-10T19:00:00.000Z',
    endDate: '2026-02-10T22:00:00.000Z',
    location: 'Пловдив, България',
    ticketPriceLabel: 'Стартират от 30€',
    ctaHref: 'https://example.com/register',
    image: mockImage,
    labels: mockLabels,
  },
}

export const Expired: Story = {
  args: {
    ...Default.args,
    isExpired: true,
  },
}

export const FreeEvent: Story = {
  args: {
    ...Default.args,
    ticketPriceLabel: 'Безплатно',
  },
}

export const AllDayEvent: Story = {
  args: {
    ...Default.args,
    allDay: true,
  },
}
