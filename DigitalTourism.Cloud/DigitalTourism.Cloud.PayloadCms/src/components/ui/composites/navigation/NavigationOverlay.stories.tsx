import type { Meta, StoryObj } from '@storybook/react'
import { FoodRegular, BuildingRegular, CompassNorthwestRegular, CalendarLtrRegular } from '@/components/ui/icons'
import { NavigationOverlay } from './NavigationOverlay'
import { figmaDesign } from '../../theme/figma'

const meta = {
  title: 'Composites/Navigation/NavigationOverlay',
  component: NavigationOverlay,
  parameters: { layout: 'padded', ...figmaDesign('1335:9662') },
} satisfies Meta<typeof NavigationOverlay>

export default meta
type Story = StoryObj<typeof meta>

const categories = [
  {
    label: 'Destinations',
    items: [
      { label: 'Restaurants', icon: <FoodRegular />, href: '#' },
      { label: 'Attractions', icon: <BuildingRegular />, href: '#' },
      { label: 'Adventures', icon: <CompassNorthwestRegular />, href: '#' },
      { label: 'Seasonal Events', icon: <CalendarLtrRegular />, href: '#' },
    ],
  },
  {
    label: 'Entertainment',
    items: [
      { label: 'Festivals', icon: <CalendarLtrRegular />, href: '#' },
      { label: 'Concerts', icon: <CompassNorthwestRegular />, href: '#' },
    ],
  },
  {
    label: 'Culture',
    items: [
      { label: 'Museums', icon: <BuildingRegular />, href: '#' },
      { label: 'Galleries', icon: <CompassNorthwestRegular />, href: '#' },
    ],
  },
]

const images = [
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', alt: 'Image 1' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop', alt: 'Image 2' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop', alt: 'Image 3' },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=200&fit=crop', alt: 'Image 4' },
]

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-h4 font-semibold">NavigationOverlay</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Dropdown mega-menu panel with categories and images.
        </p>
      </div>

      <NavigationOverlay
        categories={categories}
        images={images}
        onClose={() => {}}
      />
    </div>
  ),
}

export const Playground: Story = {
  args: {
    categories,
    images,
    onClose: () => {},
  },
}
