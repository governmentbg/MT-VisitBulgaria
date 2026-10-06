'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StarRegular } from '@/components/ui/icons'
import { StatItem } from './StatItem'

const meta = {
  title: 'Components/StatsDisplay/StatItem',
  component: StatItem,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatItem>

export default meta
type Story = StoryObj<typeof meta>

export const DarkLarge: Story = {
  args: {
    value: '40,000+',
    label: 'Културни паметници',
    size: 'lg',
    colorScheme: 'dark',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-primary-800 p-8">
        <Story />
      </div>
    ),
  ],
}

export const DarkMedium: Story = {
  args: {
    value: '250+',
    label: 'Музеи и галерии',
    size: 'md',
    colorScheme: 'dark',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-primary-800 p-8">
        <Story />
      </div>
    ),
  ],
}

export const DarkSmall: Story = {
  args: {
    value: '10',
    label: 'Обекти под закрила на UNESCO',
    size: 'sm',
    colorScheme: 'dark',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-primary-800 p-8">
        <Story />
      </div>
    ),
  ],
}

export const LightLarge: Story = {
  args: {
    value: '60,000+',
    label: 'Места за настаняване',
    size: 'lg',
    colorScheme: 'light',
  },
}

export const WithIcon: Story = {
  args: {
    value: '200+',
    label: 'Защитени природни обекта',
    icon: <StarRegular />,
    size: 'lg',
    colorScheme: 'light',
  },
}

export const WithIconDark: Story = {
  args: {
    value: '200+',
    label: 'Защитени природни обекта',
    icon: <StarRegular />,
    size: 'lg',
    colorScheme: 'dark',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-primary-800 p-8">
        <Story />
      </div>
    ),
  ],
}

export const NoBorder: Story = {
  args: {
    value: '7,000+',
    label: 'Години история',
    size: 'lg',
    colorScheme: 'light',
    showAccentBorder: false,
  },
}
