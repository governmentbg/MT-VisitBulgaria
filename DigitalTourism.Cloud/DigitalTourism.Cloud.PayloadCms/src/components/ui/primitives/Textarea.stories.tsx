import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'
import { Textarea } from './Textarea'

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">Textarea</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Multi-line text input in all states.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label>Default</Label>
          <Textarea placeholder="Type your message here..." />
        </div>

        <div className="flex flex-col gap-2">
          <Label>With value</Label>
          <Textarea defaultValue="This textarea already has some content filled in to demonstrate how it looks with text." />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Disabled</Label>
          <Textarea placeholder="Disabled textarea" disabled />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Disabled with value</Label>
          <Textarea defaultValue="This content cannot be edited." disabled />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { placeholder: 'Type your message here...' },
}
