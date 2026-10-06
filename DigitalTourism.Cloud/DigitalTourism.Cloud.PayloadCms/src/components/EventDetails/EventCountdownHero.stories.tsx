'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { EventCountdownHero } from './EventCountdownHero'
import type { Media as MediaType } from '@/payload-types'

const mockImage: MediaType = {
  id: 1,
  alt: 'Business event',
  url: 'https://picsum.photos/seed/event-hero/1920/1080',
  width: 1920,
  height: 1080,
  filename: 'event-hero.jpg',
  mimeType: 'image/jpeg',
  filesize: 100000,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
const soonDate = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

const meta = {
  title: 'EventDetails/EventCountdownHero',
  component: EventCountdownHero,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1000-4128',
    },
  },
} satisfies Meta<typeof EventCountdownHero>

export default meta
type Story = StoryObj<typeof meta>

const mockCountdownLabels = {
  days: 'Дни',
  hours: 'Часа',
  minutes: 'Минути',
  seconds: 'Секунди',
}

export const Default: Story = {
  args: {
    heroImage: mockImage,
    title: 'Бизнес събитие #20 - HoB',
    subtitle: 'Двадесето издание на Hills of Business – среща, посветена на създаването на нови контакти и партньорства.',
    dateRange: '10 февруари 2026, 19:00 - 22:00',
    targetDate: futureDate,
    ctaLabel: 'Запиши се сега',
    ctaHref: 'https://example.com/register',
    expiredLabel: 'Събитието приключи',
    countdownLabels: mockCountdownLabels,
  },
}

export const ExpiringSoon: Story = {
  args: {
    ...Default.args,
    targetDate: soonDate,
  },
}

export const Expired: Story = {
  args: {
    ...Default.args,
    targetDate: pastDate,
    isExpired: true,
  },
}

export const Active: Story = {
  args: {
    ...Default.args,
    targetDate: pastDate,
    isActive: true,
    activeLabel: 'Провежда се в момента',
  },
}

export const LongTitle: Story = {
  args: {
    ...Default.args,
    title: 'Международен фестивал на бизнес иновациите и предприемачеството в Пловдив 2026',
  },
}
