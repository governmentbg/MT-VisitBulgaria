import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DayCounter } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/DayCounter',
  component: DayCounter,
  parameters: { layout: 'padded', ...figmaDesign('1655:18917') },
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    subtitle: { control: 'text' },
  },
} satisfies Meta<typeof DayCounter>

export default meta
type Story = StoryObj<typeof meta>

const DayCounterInteractive = ({ initial = 7, ...props }: { initial?: number; min?: number; max?: number }) => {
  const [value, setValue] = useState(initial)
  return (
    <DayCounter
      value={value}
      onIncrement={() => setValue((v) => v + 1)}
      onDecrement={() => setValue((v) => v - 1)}
      {...props}
    />
  )
}

export const Showcase: Story = {
  args: { value: 7, onIncrement: () => {}, onDecrement: () => {} },
  render: () => (
    <div className="flex flex-col gap-8 max-w-sm">
      <div>
        <h2 className="text-h4 font-semibold">DayCounter</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Day count stepper with chevron controls and subtitle.
        </p>
      </div>

      <div className="flex flex-col gap-6 border rounded-lg">
        <h3 className="px-6 pt-4 text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          At minimum (1)
        </h3>
        <DayCounterInteractive initial={1} min={1} max={30} />
      </div>

      <div className="flex flex-col gap-6 border rounded-lg">
        <h3 className="px-6 pt-4 text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Mid range (7)
        </h3>
        <DayCounterInteractive initial={7} min={1} max={30} />
      </div>

      <div className="flex flex-col gap-6 border rounded-lg">
        <h3 className="px-6 pt-4 text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          At maximum (30)
        </h3>
        <DayCounterInteractive initial={30} min={1} max={30} />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    value: 7,
    min: 1,
    max: 30,
    subtitle: 'Добави или премахни',
    onIncrement: () => {},
    onDecrement: () => {},
  },
}
