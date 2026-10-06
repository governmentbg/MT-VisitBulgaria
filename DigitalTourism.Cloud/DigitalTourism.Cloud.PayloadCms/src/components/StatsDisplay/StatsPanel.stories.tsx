'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { StatsPanel } from './StatsPanel'
import { figmaItems, sampleImage } from './storyData'

const meta = {
  title: 'Blocks/StatsDisplay/StatsPanel',
  component: StatsPanel,
  parameters: {
    layout: 'fullscreen',
    ...figmaDesign('904-16215'),
  },
} satisfies Meta<typeof StatsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: figmaItems,
    imageSlot: sampleImage,
  },
  parameters: figmaDesign('904-16215'),
}

export const DarkCard: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: figmaItems,
    imageSlot: sampleImage,
    cardColor: 'grey-900',
  },
}

export const PrimaryDark: Story = {
  args: {
    heading: 'Българският туризъм в цифри',
    items: figmaItems,
    imageSlot: sampleImage,
    cardColor: 'primary-900',
  },
}

export const NoHeading: Story = {
  args: {
    items: figmaItems,
    imageSlot: sampleImage,
  },
}

export const TwoItems: Story = {
  args: {
    heading: 'Бързи факти',
    items: figmaItems.slice(0, 2),
    imageSlot: sampleImage,
  },
}
