import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'
import { Label } from './Label'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: { layout: 'padded' },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">Checkbox</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Checkbox control in all states.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
          <span className="text-xs text-muted-foreground">Unchecked</span>
          <div className="flex items-center gap-2">
            <Checkbox id="unchecked" />
            <Label htmlFor="unchecked">Accept terms</Label>
          </div>

          <span className="text-xs text-muted-foreground">Checked</span>
          <div className="flex items-center gap-2">
            <Checkbox id="checked" defaultChecked />
            <Label htmlFor="checked">Accept terms</Label>
          </div>

          <span className="text-xs text-muted-foreground">Disabled</span>
          <div className="flex items-center gap-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled" className="text-muted-foreground">Accept terms</Label>
          </div>

          <span className="text-xs text-muted-foreground">Disabled checked</span>
          <div className="flex items-center gap-2">
            <Checkbox id="disabled-checked" defaultChecked disabled />
            <Label htmlFor="disabled-checked" className="text-muted-foreground">Accept terms</Label>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="playground" {...args} />
      <Label htmlFor="playground">Accept terms and conditions</Label>
    </div>
  ),
}
