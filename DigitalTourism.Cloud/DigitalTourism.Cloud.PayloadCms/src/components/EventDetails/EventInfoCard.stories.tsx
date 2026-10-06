'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EventInfoCard } from './EventInfoCard'
import { CalendarLtrRegular, ClockRegular, LocationRegular, TicketDiagonalRegular } from '@/components/ui/icons'

const meta = {
  title: 'EventDetails/EventInfoCard',
  component: EventInfoCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1000-4703',
    },
  },
} satisfies Meta<typeof EventInfoCard>

export default meta
type Story = StoryObj<typeof meta>

export const Date: Story = {
  args: {
    icon: <CalendarLtrRegular className="h-6 w-6 text-primary" />,
    label: 'Дата',
    value: '10 Февруари 2026',
  },
}

export const Time: Story = {
  args: {
    icon: <ClockRegular className="h-6 w-6 text-primary" />,
    label: 'Час',
    value: '19:00 - 22:00 часа',
  },
}

export const Location: Story = {
  args: {
    icon: <LocationRegular className="h-6 w-6 text-primary" />,
    label: 'Локация',
    value: 'Пловдив, България',
  },
}

export const Tickets: Story = {
  args: {
    icon: <TicketDiagonalRegular className="h-6 w-6 text-primary" />,
    label: 'Билети',
    value: 'Стартират от 30€',
  },
}
