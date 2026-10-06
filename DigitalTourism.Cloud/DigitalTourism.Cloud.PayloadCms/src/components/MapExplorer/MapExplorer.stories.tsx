import type { Meta, StoryObj } from '@storybook/react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapExplorerSidebar } from './Sidebar/MapExplorerSidebar'
import { TypeFilterChips } from './Sidebar/TypeFilterChips'
import { ResultsList } from './Sidebar/ResultsList'
import { CityMarker } from './MapCanvas/CityMarker'
import { ExperienceMarker } from './MapCanvas/ExperienceMarker'
import type { MapExplorerPOI, CityCluster } from './types'

/**
 * Full MapExplorer integration story.
 * Since the real MapExplorer component uses server actions (useMapSearch, useMapDeepLink)
 * and next-intl, we compose the layout from its sub-components with mock data instead.
 */

const typeFacets = [
  { value: 'museum', count: 1 },
  { value: 'nature', count: 1 },
  { value: 'food', count: 1 },
  { value: 'landmark', count: 1 },
]

const typeLabels: Record<string, string> = {
  museum: 'Museums',
  nature: 'Nature',
  food: 'Food & Drink',
  landmark: 'Landmarks',
}

const samplePois: MapExplorerPOI[] = [
  {
    id: 'poi-1',
    title: 'National History Museum',
    slug: 'national-history-museum',
    type: 'museum',
    categories: ['Museums'],
    location: { lat: 42.6977, lng: 23.3219 },
    city: 'Sofia',
    address: '16 Vitoshko Lale St',
    heroImageUrl: 'https://placehold.co/400x300',
  },
  {
    id: 'poi-2',
    title: 'Vitosha Mountain',
    slug: 'vitosha-mountain',
    type: 'nature',
    categories: ['Nature'],
    location: { lat: 42.5634, lng: 23.2785 },
    city: 'Sofia',
    heroImageUrl: 'https://placehold.co/400x300',
  },
  {
    id: 'poi-3',
    title: 'Alexander Nevsky Cathedral',
    slug: 'alexander-nevsky',
    type: 'landmark',
    categories: ['Landmarks'],
    location: { lat: 42.6959, lng: 23.3327 },
    city: 'Sofia',
    heroImageUrl: 'https://placehold.co/400x300',
  },
  {
    id: 'poi-4',
    title: 'Central Market Hall',
    slug: 'central-market-hall',
    type: 'food',
    categories: ['Food & Drink'],
    location: { lat: 42.6985, lng: 23.3215 },
    city: 'Sofia',
    heroImageUrl: 'https://placehold.co/400x300',
  },
]

const sampleClusters: CityCluster[] = [
  { city: 'Sofia', count: 24, location: { lat: 42.6977, lng: 23.3219 }, previewImageUrl: 'https://placehold.co/400x300' },
  { city: 'Plovdiv', count: 18, location: { lat: 42.15, lng: 24.75 }, previewImageUrl: 'https://placehold.co/400x300' },
  { city: 'Varna', count: 12, location: { lat: 43.21, lng: 27.91 } },
]

// Dummy component to act as the story target since we can't render the real MapExplorer
function MapExplorerLayout() {
  return <div />
}

const meta = {
  title: 'MapExplorer/MapExplorer',
  component: MapExplorerLayout,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MapExplorerLayout>

export default meta
type Story = StoryObj<typeof meta>

export const DesktopLayout: Story = {
  render: () => (
    <div className="relative flex h-screen w-full gap-4 p-4" style={{ background: '#f1f5f9' }}>
      <MapExplorerSidebar title="Explore">
        <TypeFilterChips
          facets={typeFacets}
          activeTypes={[]}
          allLabel="All"
          typeLabels={typeLabels}
          onTypeChange={() => {}}
        />
        <ResultsList
          pois={samplePois}
          selectedSlug={null}
          totalFound={4}
          resultsLabel="Results"
          typeLabels={typeLabels}
          onSelectPOI={() => {}}
        />
      </MapExplorerSidebar>

      <div className="flex-1 overflow-hidden rounded-2xl">
        <MapContainer
          center={[42.7, 23.32]}
          zoom={14}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {samplePois.map((poi) => (
            <ExperienceMarker key={poi.id} poi={poi} onSelect={() => {}} />
          ))}
        </MapContainer>
      </div>
    </div>
  ),
}

export const DesktopCityView: Story = {
  render: () => (
    <div className="relative flex h-screen w-full gap-4 p-4" style={{ background: '#f1f5f9' }}>
      <MapExplorerSidebar title="Explore">
        <TypeFilterChips
          facets={typeFacets}
          activeTypes={[]}
          allLabel="All"
          typeLabels={typeLabels}
          onTypeChange={() => {}}
        />
        <ResultsList
          pois={[]}
          selectedSlug={null}
          totalFound={0}
          resultsLabel="Results"
          typeLabels={typeLabels}
          onSelectPOI={() => {}}
        />
      </MapExplorerSidebar>

      <div className="flex-1 overflow-hidden rounded-2xl">
        <MapContainer
          center={[42.7, 25.5]}
          zoom={7}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {sampleClusters.map((cluster) => (
            <CityMarker key={cluster.city} cluster={cluster} />
          ))}
        </MapContainer>
      </div>
    </div>
  ),
}

export const MobileLayout: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div className="relative h-screen w-full" style={{ maxWidth: 390, margin: '0 auto' }}>
      <MapContainer
        center={[42.7, 23.32]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {samplePois.map((poi) => (
          <ExperienceMarker key={poi.id} poi={poi} onSelect={() => {}} />
        ))}
      </MapContainer>

    </div>
  ),
}
