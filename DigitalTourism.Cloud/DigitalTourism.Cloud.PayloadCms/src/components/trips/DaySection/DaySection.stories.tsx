import type { Meta, StoryObj } from '@storybook/react'
import { DaySection } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import type { DestinationItemData } from '../types'

const destinations: DestinationItemData[] = [
  { id: '1', title: 'Александър Невски', address: 'пл. Александър Невски, София', category: 'Забележителност', imageUrl: 'https://picsum.photos/seed/alex/200/200' },
  { id: '2', title: 'Ресторант Космос', address: 'бул. Витоша 15, София', category: 'Ресторант', imageUrl: 'https://picsum.photos/seed/cosmos/200/200' },
]

const meta = {
  title: 'Trips/DaySection',
  component: DaySection,
  parameters: { layout: 'padded', ...figmaDesign('1655:18917') },
} satisfies Meta<typeof DaySection>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: {
    dayNumber: 1,
    destinations: [],
    onAddDestination: () => {},
    onDeleteDestination: () => {},
  },
  render: () => (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <h2 className="text-h4 font-semibold">DaySection</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Collapsible section for a single day in the planner sidebar.
        </p>
      </div>

      <div className="rounded-lg border">
        <DaySection
          dayNumber={1}
          destinations={[]}
          onAddDestination={() => {}}
          onDeleteDestination={() => {}}
        />
        <DaySection
          dayNumber={2}
          destinations={destinations}
          onAddDestination={() => {}}
          onDeleteDestination={() => {}}
        />
        <DaySection
          dayNumber={3}
          destinations={destinations}
          isCollapsed
          onAddDestination={() => {}}
          onDeleteDestination={() => {}}
        />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    dayNumber: 1,
    destinations,
    onAddDestination: () => console.log('add'),
    onDeleteDestination: () => console.log('options'),
  },
}
