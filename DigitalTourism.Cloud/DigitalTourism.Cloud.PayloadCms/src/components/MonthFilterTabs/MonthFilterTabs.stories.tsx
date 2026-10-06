'use client'

import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { MonthFilterTabs, type MonthFilterValue } from './index'

const MonthFilterTabsControlled: React.FC<{
  initialValue?: MonthFilterValue
  variant?: 'light' | 'dark'
  labels?: { thisMonth?: string; nextMonth?: string }
}> = ({ initialValue = 'thisMonth', variant = 'dark', labels }) => {
  const [value, setValue] = useState<MonthFilterValue>(initialValue)
  return (
    <MonthFilterTabs
      value={value}
      onChange={setValue}
      variant={variant}
      labels={labels}
    />
  )
}

const meta = {
  title: 'Components/MonthFilterTabs',
  component: MonthFilterTabsControlled,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MonthFilterTabsControlled>

export default meta
type Story = StoryObj<typeof meta>

export const DarkVariant: Story = {
  args: { variant: 'dark' },
  decorators: [
    (Story) => (
      <div className="rounded-3xl bg-primary-900 p-8">
        <Story />
      </div>
    ),
  ],
}

export const LightVariant: Story = {
  args: { variant: 'light' },
}

export const Bulgarian: Story = {
  args: {
    variant: 'dark',
    labels: { thisMonth: 'Този месец', nextMonth: 'Следващия месец' },
  },
  decorators: [
    (Story) => (
      <div className="rounded-3xl bg-primary-900 p-8">
        <Story />
      </div>
    ),
  ],
}

export const NextMonthSelected: Story = {
  args: { initialValue: 'nextMonth', variant: 'dark' },
  decorators: [
    (Story) => (
      <div className="rounded-3xl bg-primary-900 p-8">
        <Story />
      </div>
    ),
  ],
}
