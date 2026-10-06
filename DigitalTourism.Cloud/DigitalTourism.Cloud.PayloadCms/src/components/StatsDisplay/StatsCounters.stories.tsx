'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { StatsCounters } from './StatsCounters'
import { countersItems, figmaItems } from './storyData'

const meta = {
  title: 'Blocks/StatsDisplay/StatsCounters',
  component: StatsCounters,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StatsCounters>

export default meta
type Story = StoryObj<typeof meta>

export const WithIcons: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: countersItems,
  },
}

export const WithoutIcons: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: figmaItems,
  },
}

export const NoHeading: Story = {
  args: {
    items: countersItems,
  },
}
