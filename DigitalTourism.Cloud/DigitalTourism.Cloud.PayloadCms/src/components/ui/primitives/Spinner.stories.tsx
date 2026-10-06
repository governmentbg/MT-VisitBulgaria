import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">Spinner</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Loading indicator at all sizes.
        </p>
      </div>

      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span className="text-xs text-muted-foreground">Small</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span className="text-xs text-muted-foreground">Large</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="xl" />
          <span className="text-xs text-muted-foreground">X-Large</span>
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { size: 'md' },
}
