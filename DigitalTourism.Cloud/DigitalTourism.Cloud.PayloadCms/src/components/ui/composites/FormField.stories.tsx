'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { MailRegular } from '@/components/ui/icons'
import { FormField } from './FormField'
import { Input } from '../primitives/Input'
import { Textarea } from '../primitives/Textarea'
import { Checkbox } from '../primitives/Checkbox'
import { SimpleSelect } from './Select'
import { DateSelector } from './DateSelector'
import { StepperInput } from './StepperInput'

const meta = {
  title: 'Composites/FormField',
  component: FormField,
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
    description: { control: 'text' },
    error: { control: 'text' },
  },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

const InteractiveDateSelector = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  return (
    <FormField label="Travel date" name="travel-date">
      <DateSelector
        type="date"
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={(start, end) => {
          setStartDate(start)
          setEndDate(end)
        }}
      />
    </FormField>
  )
}

const InteractiveStepper = () => {
  const [value, setValue] = useState(2)
  return (
    <FormField label="Number of nights" name="nights">
      <StepperInput
        value={value}
        onChange={(v) => setValue(Number(v) || 0)}
        onIncrement={() => setValue((prev) => prev + 1)}
        onDecrement={() => setValue((prev) => Math.max(0, prev - 1))}
      />
    </FormField>
  )
}

export const Showcase: Story = {
  args: { label: 'Label', children: null },
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">FormField</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Composable wrapper providing label, error, and description layout around any input.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <FormField label="Email" name="email">
          <Input name="email" type="email" placeholder="name@example.com" leftIcon={<MailRegular />} />
        </FormField>

        <FormField label="Password" name="password">
          <Input name="password" type="password" placeholder="Enter password" />
        </FormField>

        <FormField label="Description" name="description" description="Maximum 500 characters">
          <Textarea name="description" placeholder="Describe..." />
        </FormField>

        <FormField label="Category" name="category">
          <SimpleSelect
            placeholder="Select..."
            options={[
              { label: 'Hotels', value: 'hotels' },
              { label: 'Restaurants', value: 'restaurants' },
              { label: 'Attractions', value: 'attractions' },
            ]}
          />
        </FormField>

        <FormField name="terms" className="flex flex-row items-center gap-2">
          <Checkbox id="terms" />
          <label htmlFor="terms" className="text-sm font-medium">
            I accept the terms of service
          </label>
        </FormField>

        <InteractiveDateSelector />
        <InteractiveStepper />
      </div>
    </div>
  ),
}

export const WithRequired: Story = {
  args: { label: 'Label', children: null },
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <FormField label="Name" name="name" required>
        <Input name="name" placeholder="Required field" />
      </FormField>

      <FormField label="Email" name="email" required>
        <Input name="email" type="email" placeholder="name@example.com" />
      </FormField>
    </div>
  ),
}

export const WithErrors: Story = {
  args: { label: 'Label', children: null },
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <FormField label="Name" name="name" required error="This field is required">
        <Input name="name" placeholder="Your name" />
      </FormField>

      <FormField label="Email" name="email" error="Invalid email address">
        <Input name="email" type="email" placeholder="name@example.com" leftIcon={<MailRegular />} />
      </FormField>

      <FormField label="Description" name="desc" error="Too short" description="Minimum 10 characters">
        <Textarea name="desc" placeholder="Describe..." />
      </FormField>
    </div>
  ),
}

export const WithDescription: Story = {
  args: { label: 'Label', children: null },
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <FormField label="Password" name="password" description="Minimum 8 characters, including a digit and a special character">
        <Input name="password" type="password" placeholder="Enter password" />
      </FormField>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    label: 'Field Label',
    name: 'field',
    required: false,
    description: 'Helper text goes here',
    error: '',
    children: <Input placeholder="Enter text..." />,
  },
}
