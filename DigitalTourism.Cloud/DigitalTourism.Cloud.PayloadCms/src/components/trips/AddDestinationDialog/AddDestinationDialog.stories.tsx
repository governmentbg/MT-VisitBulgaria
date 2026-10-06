import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { AddDestinationDialog } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import type { DestinationItemData } from '../types'
import type { ExperienceSearchResponse } from '@/lib/search/types'

const favoriteDestinations: DestinationItemData[] = [
  { id: '1', title: 'Александър Невски', address: 'пл. Александър Невски, София', category: 'Забележителност', imageUrl: 'https://picsum.photos/seed/alex/200/200' },
  { id: '2', title: 'Ресторант Космос', address: 'бул. Витоша 15, София', category: 'Ресторант', imageUrl: 'https://picsum.photos/seed/cosmos/200/200' },
]

const mockSearchResults = [
  { id: '3', title: 'Хижа Алеко', slug: 'hizha-aleko', type: 'attractions', location: { city: 'Витоша' }, heroImage: { url: 'https://picsum.photos/seed/aleko/200/200' } },
  { id: '4', title: 'НДК', slug: 'ndk', type: 'attractions', location: { city: 'София' }, heroImage: { url: 'https://picsum.photos/seed/ndk/200/200' } },
  { id: '5', title: 'Боянска църква', slug: 'boyanska-tsarkva', type: 'attractions', location: { city: 'София' }, heroImage: { url: 'https://picsum.photos/seed/boyana/200/200' } },
  { id: '6', title: 'Витошка', slug: 'vitoshka', type: 'attractions', location: { city: 'София' }, heroImage: { url: 'https://picsum.photos/seed/vitosha/200/200' } },
]

const mockSearchAction = async (): Promise<ExperienceSearchResponse> => {
  await new Promise((r) => setTimeout(r, 500))
  return {
    hits: mockSearchResults as any,
    found: mockSearchResults.length,
    page: 1,
    totalPages: 1,
    searchTimeMs: 50,
    facets: {},
  }
}

const emptySearchAction = async (): Promise<ExperienceSearchResponse> => {
  await new Promise((r) => setTimeout(r, 500))
  return { hits: [], found: 0, page: 1, totalPages: 0, searchTimeMs: 10, facets: {} }
}

const mockLoadFavorites = async (): Promise<DestinationItemData[]> => {
  await new Promise((r) => setTimeout(r, 300))
  return favoriteDestinations
}

const emptyLoadFavorites = async (): Promise<DestinationItemData[]> => {
  await new Promise((r) => setTimeout(r, 300))
  return []
}

const meta = {
  title: 'Trips/AddDestinationDialog',
  component: AddDestinationDialog,
  parameters: { layout: 'centered', ...figmaDesign('1655:19122') },
} satisfies Meta<typeof AddDestinationDialog>

export default meta
type Story = StoryObj<typeof meta>

const InteractiveDialog = () => {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button onClick={() => setOpen(true)} className="rounded-lg border px-4 py-2 text-sm">
        Open Dialog
      </button>
      <AddDestinationDialog
        open={open}
        onOpenChange={setOpen}
        dayNumber={1}
        onAdd={(d) => console.log('Add:', d.title)}
        locale="en"
        loadFavorites={mockLoadFavorites}
        searchAction={mockSearchAction}
      />
    </div>
  )
}

export const Showcase: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    dayNumber: 1,
    onAdd: () => {},
    locale: 'en',
    loadFavorites: mockLoadFavorites,
    searchAction: mockSearchAction,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-h4 font-semibold">AddDestinationDialog</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Large modal for adding destinations to a day (Figma Screen 4).
        </p>
      </div>
      <InteractiveDialog />
    </div>
  ),
}

export const Populated: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    dayNumber: 3,
    onAdd: () => {},
    locale: 'en',
    loadFavorites: mockLoadFavorites,
    searchAction: mockSearchAction,
  },
}

export const Empty: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    dayNumber: 1,
    onAdd: () => {},
    locale: 'en',
    loadFavorites: emptyLoadFavorites,
    searchAction: emptySearchAction,
  },
}
