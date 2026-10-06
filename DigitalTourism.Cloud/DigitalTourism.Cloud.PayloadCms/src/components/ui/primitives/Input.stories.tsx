import type { Meta, StoryObj } from '@storybook/react'
import { MailRegular, SearchRegular } from '@/components/ui/icons'
import { Input } from './Input'
import { Label } from './Label'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: { layout: 'padded', ...figmaDesign('1335:10886') },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search'] },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">Input</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Pure input primitive with optional icon slots. Labels are composed externally.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Label>Default</Label>
          <Input placeholder="Enter text..." />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>With value</Label>
          <Input defaultValue="John Doe" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Email</Label>
          <Input type="email" placeholder="name@example.com" leftIcon={<MailRegular />} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Search</Label>
          <Input type="search" placeholder="Search..." leftIcon={<SearchRegular />} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Password</Label>
          <Input type="password" placeholder="Enter password" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Disabled</Label>
          <Input placeholder="Disabled input" disabled />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Disabled with value</Label>
          <Input defaultValue="Cannot edit" disabled />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { placeholder: 'Enter text...' },
}
