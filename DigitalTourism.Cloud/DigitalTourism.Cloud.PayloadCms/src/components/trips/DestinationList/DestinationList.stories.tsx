import type { Meta, StoryObj } from '@storybook/react'
import { DestinationList } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import type { DestinationItemData } from '../types'

const destinations: DestinationItemData[] = [
  { id: '1', title: 'Александър Невски', address: 'пл. Александър Невски, София', category: 'Забележителност', imageUrl: 'https://picsum.photos/seed/alex/200/200' },
  { id: '2', title: 'Ресторант Космос', address: 'бул. Витоша 15, София', category: 'Ресторант', imageUrl: 'https://picsum.photos/seed/cosmos/200/200' },
  { id: '3', title: 'Хижа Алеко', address: 'Витоша', category: 'Хижа', imageUrl: 'https://picsum.photos/seed/aleko/200/200' },
  { id: '4', title: 'НДК', address: 'пл. България 1, София', category: 'Култура', imageUrl: 'https://picsum.photos/seed/ndk/200/200' },
  { id: '5', title: 'Боянска църква', address: 'кв. Бояна, София', category: 'ЮНЕСКО', imageUrl: 'https://picsum.photos/seed/boyana/200/200' },
]

const meta = {
  title: 'Trips/DestinationList',
  component: DestinationList,
  parameters: { layout: 'padded', ...figmaDesign('1655:19122') },
  argTypes: {
    variant: { control: 'select', options: ['add', 'sidebar'] },
  },
} satisfies Meta<typeof DestinationList>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { destinations: [], variant: 'add' },
  render: () => (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <h2 className="text-h4 font-semibold">DestinationList</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Scrollable list of destination items with dividers.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Empty</h3>
        <div className="border rounded-lg">
          <DestinationList destinations={[]} variant="add" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Add variant</h3>
        <div className="border rounded-lg max-h-[300px] overflow-y-auto">
          <DestinationList destinations={destinations} variant="add" onAdd={() => {}} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Sidebar variant</h3>
        <div className="border rounded-lg">
          <DestinationList destinations={destinations.slice(0, 3)} variant="sidebar" dayNumber={1} onDelete={() => {}} />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    destinations: destinations.slice(0, 3),
    variant: 'add',
  },
}
