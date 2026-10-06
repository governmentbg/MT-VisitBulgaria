'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { StatsInline } from './StatsInline'
import { figmaItems } from './storyData'

const meta = {
  title: 'Blocks/StatsDisplay/StatsInline',
  component: StatsInline,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StatsInline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: figmaItems,
  },
}

export const ManyItems: Story = {
  args: {
    items: [
      ...figmaItems,
      { value: '1,000+', label: 'Хотели' },
      { value: '500+', label: 'Екопътеки' },
      { value: '3,000+', label: 'Ресторанти' },
      { value: '150', label: 'Минерални извори' },
    ],
  },
}

export const TwoItems: Story = {
  args: {
    items: figmaItems.slice(0, 2),
  },
}
