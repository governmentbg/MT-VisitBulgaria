'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { StepperInput } from './StepperInput'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Composites/StepperInput',
  component: StepperInput,
  parameters: { layout: 'padded', ...figmaDesign('1335:11176') },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof StepperInput>

export default meta
type Story = StoryObj<typeof meta>

const InteractiveStepper = () => {
  const [value, setValue] = useState(3)
  return (
    <StepperInput
      label="Duration (days)"
      value={value}
      onChange={(v) => setValue(Number(v) || 0)}
      onIncrement={() => setValue((prev) => prev + 1)}
      onDecrement={() => setValue((prev) => Math.max(0, prev - 1))}
    />
  )
}

const InteractiveDateStepper = () => {
  const dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [index, setIndex] = useState(0)
  return (
    <StepperInput
      label="Day of week"
      value={dates[index] || 'DD'}
      onIncrement={() => setIndex((prev) => (prev + 1) % dates.length)}
      onDecrement={() => setIndex((prev) => (prev - 1 + dates.length) % dates.length)}
    />
  )
}

export const Showcase: Story = {
  args: { value: 0 },
  render: () => (
    <div className="flex flex-col gap-10 max-w-sm">
      <div>
        <h2 className="text-h4 font-semibold">StepperInput</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Date/duration stepper input with increment/decrement.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <InteractiveStepper />
        <InteractiveDateStepper />
        <StepperInput label="Disabled" value="DD" disabled />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    label: 'Value',
    value: 5,
  },
}
