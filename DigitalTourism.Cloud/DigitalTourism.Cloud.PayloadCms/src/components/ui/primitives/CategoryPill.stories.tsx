'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CategoryPill } from './CategoryPill'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Primitives/CategoryPill',
  component: CategoryPill,
  parameters: { layout: 'padded', ...figmaDesign('1335:10083') },
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof CategoryPill>

export default meta
type Story = StoryObj<typeof meta>

const categories = ['All', 'Hotels', 'Restaurants', 'Activities', 'Landmarks', 'Events']

const InteractiveCategoryPills = () => {
  const [active, setActive] = useState('All')
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <CategoryPill
          key={cat}
          label={cat}
          active={active === cat}
          onClick={() => setActive(cat)}
        />
      ))}
    </div>
  )
}

export const Showcase: Story = {
  args: { label: '' },
  render: () => (
    <div className="flex flex-col gap-10 max-w-lg">
      <div>
        <h2 className="text-h4 font-semibold">CategoryPill</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Filterable category pill for map view.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">States</span>
          <div className="flex gap-2">
            <CategoryPill label="Inactive" active={false} />
            <CategoryPill label="Active" active={true} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Interactive filter bar</span>
          <InteractiveCategoryPills />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { label: 'Category', active: false },
}
