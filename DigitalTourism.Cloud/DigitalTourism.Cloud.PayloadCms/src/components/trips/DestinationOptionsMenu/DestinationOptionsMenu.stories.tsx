import type { Meta, StoryObj } from '@storybook/react'
import { DestinationOptionsMenu } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/DestinationOptionsMenu',
  component: DestinationOptionsMenu,
  parameters: { layout: 'padded', ...figmaDesign('1655:21931') },
} satisfies Meta<typeof DestinationOptionsMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: {
    onViewInfo: () => console.log('View info'),
    onAddToFavorites: () => console.log('Add to favorites'),
    onMoveToDay: () => console.log('Move to day'),
    onDelete: () => console.log('Delete'),
  },
}
