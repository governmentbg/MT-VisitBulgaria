import type { Meta, StoryObj } from '@storybook/react'
import { TripCardGrid } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import type { TripSummary } from '../types'

const makeTrips = (count: number): TripSummary[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Зимна ваканция ${2026 + Math.floor(i / 3)}`,
    startDate: `2026-0${(i % 9) + 1}-${10 + i}`,
    duration: 7,
    status: (['upcoming', 'ongoing', 'completed', 'draft'] as const)[i % 4],
    dayCount: 7,
    stopCount: i * 2 + 3,
  }))

const meta = {
  title: 'Trips/TripCardGrid',
  component: TripCardGrid,
  parameters: { layout: 'padded', ...figmaDesign('1747:25875') },
} satisfies Meta<typeof TripCardGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { trips: [], onOpenTrip: () => {}, onDeleteTrip: () => {} },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-h4 font-semibold">TripCardGrid</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Responsive grid: 1 col mobile, 2 tablet, 3 desktop.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">3 trips</h3>
        <TripCardGrid
          trips={makeTrips(3)}
          onOpenTrip={() => console.log('open')}
          onDeleteTrip={() => console.log('delete')}
          onDownloadTrip={() => console.log('download')}
        />

        <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">12 trips (4x3 grid)</h3>
        <TripCardGrid
          trips={makeTrips(12)}
          onOpenTrip={() => console.log('open')}
          onDeleteTrip={() => console.log('delete')}
          onDownloadTrip={() => console.log('download')}
        />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    trips: makeTrips(6),
    onOpenTrip: () => console.log('open'),
    onDeleteTrip: () => console.log('delete'),
    onDownloadTrip: () => console.log('download'),
  },
}
