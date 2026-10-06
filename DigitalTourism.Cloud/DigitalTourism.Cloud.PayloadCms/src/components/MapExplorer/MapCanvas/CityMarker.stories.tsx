import type { Meta, StoryObj } from '@storybook/react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { CityMarker } from './CityMarker'
import type { CityCluster } from '../types'

const mapDecorator = (Story: React.FC) => (
  <div style={{ width: 600, height: 400 }}>
    <MapContainer
      center={[42.7, 23.32]}
      zoom={8}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Story />
    </MapContainer>
  </div>
)

const meta = {
  title: 'MapExplorer/CityMarker',
  component: CityMarker,
  decorators: [mapDecorator],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CityMarker>

export default meta
type Story = StoryObj<typeof meta>

const sofiaCluster: CityCluster = {
  city: 'Sofia',
  count: 24,
  location: { lat: 42.6977, lng: 23.3219 },
  previewImageUrl: 'https://placehold.co/400x300',
}

export const WithImage: Story = {
  args: {
    cluster: sofiaCluster,
  },
}

export const WithoutImage: Story = {
  args: {
    cluster: {
      city: 'Plovdiv',
      count: 12,
      location: { lat: 42.15, lng: 24.75 },
    },
  },
}

export const HighCount: Story = {
  args: {
    cluster: {
      city: 'Varna',
      count: 487,
      location: { lat: 43.21, lng: 27.91 },
      previewImageUrl: 'https://placehold.co/400x300',
    },
  },
}
