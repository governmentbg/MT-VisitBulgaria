import type { Meta, StoryObj } from '@storybook/react'
import { DestinationItem } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import type { DestinationItemData } from '../types'

const sampleDestination: DestinationItemData = {
  id: '1',
  title: 'Александър Невски',
  address: 'пл. Александър Невски, София',
  category: 'Забележителност',
  imageUrl: 'https://picsum.photos/seed/alex/200/200',
}

const sampleDestination2: DestinationItemData = {
  id: '2',
  title: 'Ресторант Космос',
  address: 'бул. Витоша 15, София',
  category: 'Ресторант',
  imageUrl: 'https://picsum.photos/seed/cosmos/200/200',
}

const noImageDestination: DestinationItemData = {
  id: '3',
  title: 'Хижа Алеко',
  address: 'Витоша',
  category: 'Хижа',
}

const meta = {
  title: 'Trips/DestinationItem',
  component: DestinationItem,
  parameters: { layout: 'padded', ...figmaDesign('1655:19122') },
  argTypes: {
    variant: { control: 'select', options: ['add', 'sidebar'] },
    isHighlighted: { control: 'boolean' },
    dayNumber: { control: 'number' },
  },
} satisfies Meta<typeof DestinationItem>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { destination: sampleDestination, variant: 'add' },
  render: () => (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <h2 className="text-h4 font-semibold">DestinationItem</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Single destination row with two variants: add (for dialog) and sidebar (for planner).
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Add variant
        </h3>
        <div className="flex flex-col gap-1 border rounded-lg p-2">
          <DestinationItem destination={sampleDestination} variant="add" onAdd={() => {}} />
          <DestinationItem destination={sampleDestination2} variant="add" onAdd={() => {}} />
          <DestinationItem destination={noImageDestination} variant="add" onAdd={() => {}} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Sidebar variant
        </h3>
        <div className="flex flex-col gap-1 border rounded-lg p-2">
          <DestinationItem destination={sampleDestination} variant="sidebar" dayNumber={1} onDelete={() => {}} />
          <DestinationItem destination={sampleDestination2} variant="sidebar" dayNumber={2} onDelete={() => {}} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Highlighted
        </h3>
        <div className="flex flex-col gap-1 border rounded-lg p-2">
          <DestinationItem destination={sampleDestination} variant="sidebar" dayNumber={1} isHighlighted onDelete={() => {}} />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    destination: sampleDestination,
    variant: 'add',
    dayNumber: 1,
    isHighlighted: false,
  },
}
