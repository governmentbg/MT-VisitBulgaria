import type { Meta, StoryObj } from '@storybook/react'
import { CloseButton } from './CloseButton'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Primitives/CloseButton',
  component: CloseButton,
  parameters: { layout: 'padded', ...figmaDesign('1335:9605') },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof CloseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">CloseButton</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Dismiss/close button for panels and modals.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Sizes</span>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <CloseButton size="sm" onClose={() => alert('Close!')} />
              <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CloseButton size="md" onClose={() => alert('Close!')} />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CloseButton size="lg" onClose={() => alert('Close!')} />
              <span className="text-xs text-muted-foreground">Large</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { size: 'md' },
}
