import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DaySidebar } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import type { TripDay } from '../types'

const emptyDays = (count: number): TripDay[] =>
  Array.from({ length: count }, (_, i) => ({ dayNumber: i + 1, stops: [] }))

const populatedDays: TripDay[] = [
  {
    dayNumber: 1,
    stops: [
      { experience: { relationTo: 'attractions' as any, value: { id: 1, title: 'Александър Невски', address: 'пл. Александър Невски' } } },
      { experience: { relationTo: 'restaurants' as any, value: { id: 2, title: 'Ресторант Космос', address: 'бул. Витоша 15' } } },
    ],
  },
  {
    dayNumber: 2,
    stops: [
      { experience: { relationTo: 'attractions' as any, value: { id: 3, title: 'Боянска църква', address: 'кв. Бояна' } } },
    ],
  },
  { dayNumber: 3, stops: [] },
]

const meta = {
  title: 'Trips/DaySidebar',
  component: DaySidebar,
  parameters: { layout: 'fullscreen', ...figmaDesign('1655:18917') },
} satisfies Meta<typeof DaySidebar>

export default meta
type Story = StoryObj<typeof meta>

const InteractiveSidebar = ({ initialDays }: { initialDays: TripDay[] }) => {
  const [days, setDays] = useState(initialDays)
  const [dayCount, setDayCount] = useState(initialDays.length)

  const handleDayCountChange = (delta: number) => {
    const newCount = dayCount + delta
    setDayCount(newCount)
    if (delta > 0) {
      setDays([...days, { dayNumber: newCount, stops: [] }])
    } else {
      setDays(days.slice(0, newCount))
    }
  }

  return (
    <div className="h-[600px]">
      <DaySidebar
        days={days}
        dayCount={dayCount}
        onDayCountChange={handleDayCountChange}
        onAddDestination={(d) => console.log('Add to day', d)}
        onDeleteDestination={(dest) => console.log('Options for', dest.title)}
      />
    </div>
  )
}

export const Showcase: Story = {
  args: {
    days: [],
    dayCount: 0,
    onDayCountChange: () => {},
    onAddDestination: () => {},
    onDeleteDestination: () => {},
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="px-6 pt-6">
        <h2 className="text-h4 font-semibold">DaySidebar</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Left panel with day sections and day counter (Figma Screen 3 & 5).
        </p>
      </div>

      <div className="flex gap-8 px-6">
        <div>
          <h3 className="mb-2 text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Empty (3 days)</h3>
          <InteractiveSidebar initialDays={emptyDays(3)} />
        </div>
        <div>
          <h3 className="mb-2 text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">Populated</h3>
          <InteractiveSidebar initialDays={populatedDays} />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    days: populatedDays,
    dayCount: 3,
    onDayCountChange: () => {},
    onAddDestination: () => console.log('add'),
    onDeleteDestination: () => console.log('options'),
  },
}
