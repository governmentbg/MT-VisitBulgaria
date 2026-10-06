import type { Meta, StoryObj } from '@storybook/react'
import { TripCard } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import type { TripSummary } from '../types'

const trips: TripSummary[] = [
  { id: '1', name: 'Зимна ваканция 2026', startDate: '2026-06-01', duration: 7, status: 'upcoming', dayCount: 7, stopCount: 8 },
  { id: '2', name: 'Лято на морето', startDate: '2026-03-09', duration: 7, status: 'ongoing', dayCount: 7, stopCount: 12 },
  { id: '3', name: 'Рила и Пирин', startDate: '2025-09-01', duration: 5, status: 'completed', dayCount: 5, stopCount: 10 },
  { id: '4', name: 'Много дълго име на план което трябва да се съкрати', startDate: '2026-05-01', duration: 2, status: 'draft', dayCount: 2, stopCount: 0 },
]

const meta = {
  title: 'Trips/TripCard',
  component: TripCard,
  parameters: { layout: 'padded', ...figmaDesign('1747:25875') },
  argTypes: {
    onOpen: { action: 'open' },
    onDelete: { action: 'delete' },
    onDownload: { action: 'download' },
  },
} satisfies Meta<typeof TripCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trip: trips[0],
    onOpen: () => console.log('open'),
    onDelete: () => console.log('delete'),
    onDownload: () => console.log('download'),
  },
  decorators: [(Story) => <div className="max-w-[440px]"><Story /></div>],
}

export const AllStatuses: Story = {
  args: { trip: trips[0] },
  render: () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-h4 font-semibold">TripCard - All Statuses</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onOpen={() => console.log('open', trip.id)}
            onDelete={() => console.log('delete', trip.id)}
            onDownload={() => console.log('download', trip.id)}
          />
        ))}
      </div>
    </div>
  ),
}

export const WithoutDownload: Story = {
  args: {
    trip: trips[0],
    onOpen: () => console.log('open'),
    onDelete: () => console.log('delete'),
  },
  decorators: [(Story) => <div className="max-w-[440px]"><Story /></div>],
}

export const Mobile: Story = {
  args: {
    trip: trips[0],
    onOpen: () => console.log('open'),
    onDelete: () => console.log('delete'),
    onDownload: () => console.log('download'),
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
