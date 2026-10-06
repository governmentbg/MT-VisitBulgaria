'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { EventCountdownUnit } from './EventCountdownUnit'

const meta = {
  title: 'EventDetails/EventCountdownUnit',
  component: EventCountdownUnit,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1000-4134',
    },
  },
} satisfies Meta<typeof EventCountdownUnit>

export default meta
type Story = StoryObj<typeof meta>

export const Days: Story = {
  args: { value: 9, label: 'Дни' },
}

export const Hours: Story = {
  args: { value: 3, label: 'Часа' },
}

export const Minutes: Story = {
  args: { value: 22, label: 'Минути' },
}

export const Seconds: Story = {
  args: { value: 28, label: 'Секунди' },
}

export const Zero: Story = {
  args: { value: 0, label: 'Дни' },
}

export const Inactive: Story = {
  args: { value: 0, label: 'Дни', inactive: true },
}

export const InactiveWithValue: Story = {
  args: { value: 9, label: 'Дни', inactive: true },
}
