import type { Meta, StoryObj } from '@storybook/react'
import { TripListHeader } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/TripListHeader',
  component: TripListHeader,
  parameters: { layout: 'padded', ...figmaDesign('1747:25875') },
  argTypes: {
    onCreateTrip: { action: 'createTrip' },
  },
} satisfies Meta<typeof TripListHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Моите планове',
    subtitle: 'Планирайте и организирайте вашите приключения',
    onCreateTrip: () => console.log('create trip'),
  },
}

export const EmptyState: Story = {
  args: {
    title: 'Моите планове',
    subtitle: 'Все още нямате създадени планове за пътуване. Създайте първия си план сега!',
    onCreateTrip: () => console.log('create trip'),
  },
}

export const WithCustomButton: Story = {
  args: {
    title: 'My Plans',
    subtitle: 'Plan and organize your travel adventures',
    buttonLabel: 'New Plan',
    onCreateTrip: () => console.log('create trip'),
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Моите планове',
    onCreateTrip: () => console.log('create trip'),
  },
}

export const Mobile: Story = {
  args: {
    title: 'Моите планове',
    subtitle: 'Планирайте и организирайте вашите приключения',
    onCreateTrip: () => console.log('create trip'),
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
