'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { WeatherElement } from '@/components/ui'
import {
  CloudRegular,
  DocumentTextRegular,
  CurrencyDollarEuroRegular,
  ShieldCheckmarkRegular,
  VehicleBusRegular,
  FoodRegular,
  GlobeRegular,
} from '@/components/ui/icons'
import { FactsListing, type FactItemData } from './index'

const sampleImage = (
  <img
    src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=700&fit=crop"
    alt="Mountain landscape"
    className="h-full w-full object-cover"
    style={{ minHeight: 500 }}
  />
)

const sampleItems: FactItemData[] = [
  {
    icon: <DocumentTextRegular />,
    title: 'Visa and travel documents',
    description:
      'Travelers from the European Union, the United Kingdom, and many other countries enter Bulgaria without a visa for short-term stays.',
    linkLabel: 'Learn more',
    linkHref: '/travel-documents',
  },
  {
    icon: <CurrencyDollarEuroRegular />,
    title: 'Currency and payments',
    description:
      'The official currency is the euro (EUR) since the beginning of 2026. Most hotels, restaurants, and shops accept bank cards.',
    linkLabel: 'Learn more',
    linkHref: '/currency',
  },
  {
    icon: <ShieldCheckmarkRegular />,
    title: 'Health and safety tips',
    description:
      'No special vaccinations are required for travel. It is recommended to have valid health insurance.',
    linkLabel: 'Learn more',
    linkHref: '/health-safety',
  },
]

const manyItems: FactItemData[] = [
  ...sampleItems,
  {
    icon: <VehicleBusRegular />,
    title: 'Getting around',
    description:
      'A well-developed bus network connects the major cities. Renting a car is convenient for exploring the countryside.',
    linkLabel: 'Learn more',
    linkHref: '/transport',
  },
  {
    icon: <FoodRegular />,
    title: 'Food and dining',
    description:
      'Bulgarian cuisine is a rich blend of Balkan and Mediterranean flavors. Don\'t miss shopska salad and banitsa.',
    linkLabel: 'Learn more',
    linkHref: '/food',
  },
  {
    icon: <GlobeRegular />,
    title: 'Language and culture',
    description:
      'The official language is Bulgarian, written in the Cyrillic script. English is widely spoken in tourist areas.',
    linkLabel: 'Learn more',
    linkHref: '/culture',
  },
]

const weatherSlot = (
  <WeatherElement
    city="Sofia"
    temperature={-2}
    unit="C"
    humidity={82}
    conditionIcon={<CloudRegular />}
  />
)

const meta = {
  title: 'Blocks/FactsListing',
  component: FactsListing,
  parameters: {
    layout: 'fullscreen',
    ...figmaDesign('1340:5413'),
  },
} satisfies Meta<typeof FactsListing>

export default meta
type Story = StoryObj<typeof meta>

export const ImageLeft: Story = {
  args: {
    heading: 'Prepare for your trip',
    description: 'Everything you need to know before visiting Bulgaria.',
    imageSlot: sampleImage,
    imagePosition: 'left',
    items: sampleItems,
  },
  parameters: figmaDesign('1340:5413'),
}

export const ImageRight: Story = {
  args: {
    heading: 'Prepare for your trip',
    description: 'Everything you need to know before visiting Bulgaria.',
    imageSlot: sampleImage,
    imagePosition: 'right',
    items: sampleItems,
  },
}

export const WithWeather: Story = {
  args: {
    heading: 'Prepare for your trip',
    description: 'Everything you need to know before visiting Bulgaria.',
    imageSlot: sampleImage,
    imagePosition: 'left',
    weatherSlot,
    items: sampleItems,
  },
}

export const WithoutWeather: Story = {
  args: {
    heading: 'Prepare for your trip',
    description: 'Everything you need to know before visiting Bulgaria.',
    imageSlot: sampleImage,
    imagePosition: 'left',
    items: sampleItems,
  },
}

export const ManyItems: Story = {
  args: {
    heading: 'Prepare for your trip',
    description: 'Everything you need to know before visiting Bulgaria.',
    imageSlot: sampleImage,
    imagePosition: 'left',
    weatherSlot,
    items: manyItems,
  },
}
