import type { Meta, StoryObj } from '@storybook/react'
import { AddButton } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/AddButton',
  component: AddButton,
  parameters: { layout: 'padded', ...figmaDesign('1655:19122') },
  argTypes: {
    label: { control: 'text' },
  },
} satisfies Meta<typeof AddButton>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { label: 'Добави' },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-h4 font-semibold">AddButton</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Dashed border pill button for adding items.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <AddButton label="Добави" onClick={() => {}} />
        <AddButton label="Добави обект" onClick={() => {}} />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { label: 'Добави' },
}
