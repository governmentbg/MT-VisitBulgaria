import type { Meta, StoryObj } from '@storybook/react'
import { MapObjectCardExpanded } from './MapObjectCardExpanded'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Composites/MapObjectCardExpanded',
  component: MapObjectCardExpanded,
  parameters: { layout: 'padded', ...figmaDesign('1335:10259') },
} satisfies Meta<typeof MapObjectCardExpanded>

export default meta
type Story = StoryObj<typeof meta>

const sampleProps = {
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop',
  ],
  title: 'Rila Monastery',
  description: 'Rila Monastery is the largest and most famous Eastern Orthodox monastery in Bulgaria. It is situated in the southwestern part of the Rila Mountains.',
  rating: 4.8,
  reviewCount: 234,
  category: 'Culture',
  location: 'Rila, Kyustendil Province, Bulgaria',
  visitorInfo: 'Open: 08:00 - 17:00, every day',
}

export const Showcase: Story = {
  args: { image: '', title: '' },
  render: () => (
    <div className="flex flex-col gap-10 max-w-lg">
      <div>
        <h2 className="text-h4 font-semibold">MapObjectCardExpanded</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Expanded detail view for map objects.
        </p>
      </div>

      <MapObjectCardExpanded
        {...sampleProps}
        onClose={() => {}}
        onLike={() => {}}
        onShare={() => {}}
        onDirections={() => {}}
      />
    </div>
  ),
}

export const Playground: Story = {
  args: {
    ...sampleProps,
    onClose: () => {},
    onLike: () => {},
    onShare: () => {},
    onDirections: () => {},
  },
}

export const PopupVariant: Story = {
  args: { image: '', title: '' },
  parameters: { ...figmaDesign('1662:52813') },
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-h4 font-semibold">Popup Variant</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Map popup card matching Figma &quot;Map object card&quot; design.
        </p>
      </div>

      <MapObjectCardExpanded
        variant="popup"
        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
        title="Църквата Свети Александър Невски"
        category="Църква"
        location='София център, pl. "Sveti Aleksandar Nevski"'
        onClose={() => {}}
        onLike={() => {}}
        ctaLabel="Виж повече"
        onCtaClick={() => {}}
        directionsLabel="Упътване"
        coordinates={{ lat: 42.6966, lng: 23.3317 }}
      />
    </div>
  ),
}

export const PopupVariantLiked: Story = {
  args: { image: '', title: '' },
  parameters: { ...figmaDesign('1662:52813') },
  render: () => (
    <MapObjectCardExpanded
      variant="popup"
      image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
      title="Рилски Манастир"
      category="Култура"
      location="Рила, Кюстендил, България"
      onClose={() => {}}
      onLike={() => {}}
      liked
      ctaLabel="Виж повече"
      ctaHref="/bg/experiences/rilski-manastir"
      directionsLabel="Упътване"
      coordinates={{ lat: 42.1333, lng: 23.3333 }}
    />
  ),
}
