import type { Meta, StoryObj } from '@storybook/react'
import { ObjectCardStandard } from './ObjectCardStandard'
import { ObjectCardOverlay } from './ObjectCardOverlay'
import { ObjectCardHorizontal } from './ObjectCardHorizontal'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Composites/ObjectCard',
  component: ObjectCardStandard,
  parameters: { layout: 'padded', ...figmaDesign('1335:10482') },
} satisfies Meta<typeof ObjectCardStandard>

export default meta
type Story = StoryObj<typeof meta>

const sampleImage =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'

export const Showcase: Story = {
  args: { image: '', title: '' },
  render: () => (
    <div className="flex flex-col gap-10 max-w-5xl">
      <div>
        <h2 className="text-h4 font-semibold">ObjectCard</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          3 card components for displaying tourism objects.
        </p>
      </div>

      {/* Figma: Standard 487×650, Overlay 484×594 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-2 max-w-[487px]">
          <span className="text-xs text-muted-foreground">Standard (Card_01)</span>
          <ObjectCardStandard
            image={sampleImage}
            title="Mish Mash Fest – St. Valentine Edition 2026"
            description="Twentieth edition of Hills of Business – a meeting dedicated to creating new contacts..."
            category="Label"
            date="2026-02-14"
            location="GPS"
            locationDesc="€€"
            onLike={() => {}}
            href="#"
            actionLabel="Primary Button"
          />
        </div>

        <div className="flex flex-col gap-2 max-w-[484px]">
          <span className="text-xs text-muted-foreground">Overlay (Card_02)</span>
          <ObjectCardOverlay
            image={sampleImage}
            title="Kukerlandia"
            subtitle={['26 FEB - 01 MAR 2026', 'Yambol, Bulgaria']}
            category="Label"
            onLike={() => {}}
            href="#"
            actionLabel="Primary Button"
            className="h-[594px]"
          />
        </div>
      </div>

      {/* Horizontal variant */}
      <div className="grid grid-cols-1 gap-6 items-start">
        <div className="flex flex-col gap-2 max-w-[585px]">
          <span className="text-xs text-muted-foreground">Horizontal (legacy)</span>
          <ObjectCardHorizontal
            image={sampleImage}
            title="Rila Monastery"
            description="One of the most impressive cultural monuments in Bulgaria."
            category="Culture"
            href="#"
            actionLabel="Explore"
          />
        </div>
      </div>
    </div>
  ),
}

export const Standard: Story = {
  args: {
    image: sampleImage,
    title: 'Mish Mash Fest – St. Valentine Edition 2026',
    description:
      'Twentieth edition of Hills of Business – a meeting dedicated to creating new contacts...',
    category: 'Label',
    date: '2026-02-14',
    location: 'GPS',
    locationDesc: '€€',
    href: '#',
    onLike: () => {},
    actionLabel: 'Primary Button',
  },
}

export const StandardWithBadges: Story = {
  args: {
    image: sampleImage,
    title: 'Mountain Lodge Resort',
    description: 'A beautiful mountain retreat with panoramic views and spa facilities.',
    category: 'Hotel',
    location: 'Bansko',
    locationDesc: 'Blagoevgrad',
    rating: 4,
    href: '#',
    onLike: () => {},
    actionLabel: 'Explore',
    badges: [
      { label: 'Wi-Fi' },
      { label: 'Pool' },
      { label: 'Spa' },
    ],
  },
}
