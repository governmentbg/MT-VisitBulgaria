import type { Meta, StoryObj } from '@storybook/react'
import { TripPlannerHeader } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Trips/TripPlannerHeader',
  component: TripPlannerHeader,
  parameters: { layout: 'fullscreen', ...figmaDesign('1655:18917') },
} satisfies Meta<typeof TripPlannerHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: {
    tripName: 'Уикенд в Пловдив',
    dateRange: '15 апр. — 17 апр. 2026',
    onExit: () => {},
    onEditName: () => {},
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="px-6 pt-6">
        <h2 className="text-h4 font-semibold">TripPlannerHeader</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Custom header for the trip planner view (Figma Screen 3).
        </p>
      </div>

      <TripPlannerHeader
        tripName="Уикенд в Пловдив"
        dateRange="15 апр. — 17 апр. 2026"
        onExit={() => {}}
        onEditName={() => {}}
      />

      <TripPlannerHeader
        tripName="Лято на морето"
        dateRange="1 юли — 7 юли 2026"
        onExit={() => {}}
        onEditName={() => {}}
        isSaving
      />

      <TripPlannerHeader
        tripName="Рила и Пирин"
        dateRange="1 сеп. — 5 сеп. 2026"
        onExit={() => {}}
        onEditName={() => {}}
        onDownloadPdf={() => {}}
      />
    </div>
  ),
}

export const Playground: Story = {
  args: {
    tripName: 'Уикенд в Пловдив',
    dateRange: '15 апр. — 17 апр. 2026',
    onExit: () => console.log('exit'),
    onEditName: () => console.log('edit name'),
    isSaving: false,
  },
}
