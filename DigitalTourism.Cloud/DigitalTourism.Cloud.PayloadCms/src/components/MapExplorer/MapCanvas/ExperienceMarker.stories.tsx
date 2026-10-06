import type { Meta, StoryObj } from '@storybook/react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ExperienceMarker } from './ExperienceMarker'
import type { MapExplorerPOI } from '../types'

const mapDecorator = (Story: React.FC) => (
  <div style={{ width: 600, height: 400 }}>
    <MapContainer
      center={[42.7, 23.32]}
      zoom={14}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Story />
    </MapContainer>
  </div>
)

const meta = {
  title: 'MapExplorer/ExperienceMarker',
  component: ExperienceMarker,
  decorators: [mapDecorator],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ExperienceMarker>

export default meta
type Story = StoryObj<typeof meta>

const samplePOI: MapExplorerPOI = {
  id: 'poi-1',
  title: 'National History Museum',
  slug: 'national-history-museum',
  type: 'museum',
  categories: ['Museums'],
  location: { lat: 42.6977, lng: 23.3219 },
  city: 'Sofia',
  address: '16 Vitoshko Lale St',
  heroImageUrl: 'https://placehold.co/400x300',
  heroImageAlt: 'National History Museum',
}

export const WithImage: Story = {
  args: {
    poi: samplePOI,
    onSelect: () => {},
  },
}

export const WithoutImage: Story = {
  args: {
    poi: {
      ...samplePOI,
      id: 'poi-2',
      title: 'Hidden Garden',
      slug: 'hidden-garden',
      heroImageUrl: undefined,
      heroImageAlt: undefined,
    },
    onSelect: () => {},
  },
}

export const Selected: Story = {
  args: {
    poi: samplePOI,
    isSelected: true,
    onSelect: () => {},
  },
}
