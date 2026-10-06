import type { Meta, StoryObj } from '@storybook/react'
import { RegionInfoCard } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

const meta = {
  title: 'Components/RegionInfoCard',
  component: RegionInfoCard,
  parameters: {
    layout: 'centered',
    ...figmaDesign('1340-5370'),
  },
  argTypes: {
    name: { control: 'text' },
    description: { control: 'text' },
    linkHref: { control: 'text' },
    linkLabel: { control: 'text' },
  },
} satisfies Meta<typeof RegionInfoCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Sofia',
    description:
      'Sofia is the capital of Bulgaria. It is the largest city in the country and the 14th largest in the European Union.',
    linkHref: '/regions/sofia',
    linkLabel: 'Learn more',
  },
}

export const NoDescription: Story = {
  args: {
    name: 'Plovdiv',
    linkHref: '/regions/plovdiv',
    linkLabel: 'Explore',
  },
}

export const NoLink: Story = {
  args: {
    name: 'Varna',
    description:
      'Varna is the third-largest city in Bulgaria and the maritime capital of the country.',
  },
}

export const LongContent: Story = {
  args: {
    name: 'Veliko Tarnovo',
    description:
      'Veliko Tarnovo is a city in north central Bulgaria and the administrative centre of Veliko Tarnovo Province. Often referred to as the "City of the Tsars", Veliko Tarnovo is located on the Yantra River and is famously known as the historical capital of the Second Bulgarian Empire, attracting many tourists with its unique architecture. The old part of the city is situated on three hills: Tsarevets, Trapezitsa, and Sveta Gora, rising amidst the meanders of the Yantra. On Tsarevets are the palaces of the Bulgarian emperors and the Patriarchate, the Patriarchal Cathedral, and a number of administrative and residential buildings surrounded by thick walls.',
    linkHref: '/regions/veliko-tarnovo',
    linkLabel: 'Learn more',
  },
}

export const BulgarianContent: Story = {
  args: {
    name: 'София',
    description:
      'Софѝя е столицата на България. Той е най-големият град в страната, както и 14-ият по големина в Европейския съюз.',
    linkHref: '/regions/sofia',
    linkLabel: 'Научи повече',
  },
}
