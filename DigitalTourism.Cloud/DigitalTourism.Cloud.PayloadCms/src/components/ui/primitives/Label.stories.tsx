import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'
import { Input } from './Input'
import { Label } from './Label'

const meta = {
  title: 'Primitives/Label',
  component: Label,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">Label</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Form labels for inputs and controls.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="standalone">Standalone label</Label>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="with-input">With input</Label>
          <Input id="with-input" placeholder="Enter text..." />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="with-checkbox" />
          <Label htmlFor="with-checkbox">With checkbox</Label>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="disabled-input" className="text-muted-foreground">
            Disabled state
          </Label>
          <Input id="disabled-input" placeholder="Disabled" disabled />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { children: 'Email address' },
}
