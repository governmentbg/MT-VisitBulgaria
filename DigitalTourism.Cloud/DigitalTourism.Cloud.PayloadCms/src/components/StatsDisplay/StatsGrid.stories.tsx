'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { StatsGrid } from './StatsGrid'
import { figmaItems } from './storyData'

const meta = {
  title: 'Blocks/StatsDisplay/StatsGrid',
  component: StatsGrid,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof StatsGrid>

export default meta
type Story = StoryObj<typeof meta>

export const DarkPrimary: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: figmaItems,
    colorScheme: 'dark',
    background: 'primary-800',
  },
}

export const LightGrey: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: figmaItems,
    colorScheme: 'light',
    background: 'grey-50',
  },
}

export const DarkNeutral: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: figmaItems,
    colorScheme: 'dark',
    background: 'grey-900',
  },
}

export const ThreeColumns: Story = {
  args: {
    heading: 'Туризъм в цифри',
    items: [
      ...figmaItems,
      { value: '1,000+', label: 'Хотели и курорти' },
      { value: '500+', label: 'Екопътеки' },
    ],
    columns: 3,
    colorScheme: 'dark',
    background: 'grey-900',
  },
}

export const FourColumns: Story = {
  args: {
    heading: 'Туризъм в цифри',
    items: figmaItems,
    columns: 4,
    colorScheme: 'light',
    background: 'transparent',
  },
}

export const NoHeading: Story = {
  args: {
    items: figmaItems,
    colorScheme: 'dark',
    background: 'primary-800',
  },
}
