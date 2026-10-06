import type { Meta, StoryObj } from '@storybook/react'
import { DayBadge } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/DayBadge',
  component: DayBadge,
  parameters: { layout: 'padded', ...figmaDesign('1655:19122') },
  argTypes: {
    dayNumber: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof DayBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { dayNumber: 1 },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-h4 font-semibold">DayBadge</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Colored circle with day number. Uses golden-angle hue rotation for unlimited distinct colors.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Medium (default)
        </h3>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <DayBadge key={n} dayNumber={n} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Small
        </h3>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <DayBadge key={n} dayNumber={n} size="sm" />
          ))}
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { dayNumber: 1, size: 'md' },
}
