import type { Meta, StoryObj } from '@storybook/react'
import { MapObjectCard } from './MapObjectCard'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Composites/MapObjectCard',
  component: MapObjectCard,
  parameters: { layout: 'padded', ...figmaDesign('1335:10127') },
} satisfies Meta<typeof MapObjectCard>

export default meta
type Story = StoryObj<typeof meta>

const sampleProps = {
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
  title: 'National History Museum',
  rating: 4.5,
  ratingCount: 362,
  priceLabel: 'Moderate Price',
  location: 'Sofia',
}

export const Showcase: Story = {
  args: { image: '', title: '' },
  render: () => (
    <div className="flex flex-col gap-10 max-w-md">
      <div>
        <h2 className="text-h4 font-semibold">MapObjectCard</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Compact card for displaying objects on the map.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <MapObjectCard
          {...sampleProps}
          href="#"
          onLike={() => {}}
        />

        <MapObjectCard
          {...sampleProps}
          title="Alexander Nevsky"
          priceLabel={undefined}
          href="#"
          onLike={() => {}}
          liked
        />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    ...sampleProps,
    href: '#',
    onLike: () => {},
  },
}
