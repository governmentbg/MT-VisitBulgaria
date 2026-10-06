import type { Meta, StoryObj } from '@storybook/react'
import { TripEmptyState } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/TripEmptyState',
  component: TripEmptyState,
  parameters: { layout: 'fullscreen', ...figmaDesign('1747:25875') },
} satisfies Meta<typeof TripEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { onCreateTrip: () => console.log('Create trip') },
  render: (args) => (
    <div className="bg-grey-25 min-h-screen p-8">
      <TripEmptyState {...args} />
    </div>
  ),
}

export const Mobile: Story = {
  args: { onCreateTrip: () => console.log('Create trip') },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <div className="bg-grey-25 min-h-screen p-4">
      <TripEmptyState {...args} />
    </div>
  ),
}
