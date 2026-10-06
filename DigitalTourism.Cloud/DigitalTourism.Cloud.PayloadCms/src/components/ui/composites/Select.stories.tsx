'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SimpleSelect,
} from './Select'
import { Label } from '../primitives/Label'
import { Stack } from '../layout/Stack'

const meta = {
  title: 'Composites/Select',
  component: Select,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
    {children}
  </h3>
)

const options = [
  { label: 'Culture', value: 'culture' },
  { label: 'Nature', value: 'nature' },
  { label: 'Food & Drinks', value: 'food' },
  { label: 'Adventures', value: 'adventure' },
]

// ── SimpleSelect interactive wrappers ──

const InteractiveSimpleSelect = () => {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Category</Label>
      <SimpleSelect
        options={options}
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
        placeholder="Select a category"
      />
    </div>
  )
}

export const Showcase: Story = {
  render: () => (
    <Stack gap="2xl" className="max-w-md">
      <Stack gap="xs">
        <h2 className="text-h4 font-semibold">Select</h2>
        <p className="text-body-md text-muted-foreground">
          Dropdown select in different configurations.
        </p>
      </Stack>

      <Stack gap="xl">
        <Stack gap="sm">
          <SectionLabel>SimpleSelect</SectionLabel>
          <InteractiveSimpleSelect />
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Basic (composition API)</SectionLabel>
          <div className="flex flex-col gap-2">
            <Label>Basic select</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opt1">Option 1</SelectItem>
                <SelectItem value="opt2">Option 2</SelectItem>
                <SelectItem value="opt3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Grouped options</SectionLabel>
          <div className="flex flex-col gap-2">
            <Label>Choose a fruit</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Citrus</SelectLabel>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="lemon">Lemon</SelectItem>
                  <SelectItem value="lime">Lime</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Berry</SelectLabel>
                  <SelectItem value="strawberry">Strawberry</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="raspberry">Raspberry</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Pre-selected</SectionLabel>
          <div className="flex flex-col gap-2">
            <Label>Pre-selected</Label>
            <Select defaultValue="opt2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opt1">Option 1</SelectItem>
                <SelectItem value="opt2">Option 2</SelectItem>
                <SelectItem value="opt3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Disabled</SectionLabel>
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground">Disabled</Label>
            <SimpleSelect
              options={options}
              placeholder="Disabled selector"
              disabled
            />
          </div>
        </Stack>
      </Stack>
    </Stack>
  ),
}
