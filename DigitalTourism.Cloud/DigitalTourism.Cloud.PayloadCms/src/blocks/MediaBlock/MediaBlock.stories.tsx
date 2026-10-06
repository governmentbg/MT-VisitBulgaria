import type { Meta, StoryObj } from '@storybook/react'
import { MediaBlock } from './Component'

const mockMedia = {
  id: 1,
  alt: 'Beautiful mountain landscape',
  url: 'https://picsum.photos/seed/media1/1920/1080',
  width: 1920,
  height: 1080,
  filename: 'landscape.jpg',
  mimeType: 'image/jpeg',
  filesize: 100000,
  updatedAt: '2024-01-01',
  createdAt: '2024-01-01',
} as any

const mockPortraitMedia = {
  ...mockMedia,
  id: 2,
  url: 'https://picsum.photos/seed/media2/1080/1440',
  width: 1080,
  height: 1440,
} as any

const meta = {
  title: 'Blocks/MediaBlock',
  component: MediaBlock,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story: any) => (
      <div className="min-h-screen bg-white py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaBlock>

export default meta
type Story = StoryObj<typeof MediaBlock>

// ─── Basic layouts ───

export const Default: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'default',
    background: 'none',
  },
}

export const FullWidth: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    background: 'none',
  },
}

export const FullBleed: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullBleed',
    background: 'none',
  },
}

// ─── With heading & description ───

export const WithHeadingCentered: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    heading: 'Discover Bulgaria',
    description: 'Explore the most beautiful landscapes in the heart of the Balkans.',
    textAlignment: 'center',
  },
}

export const WithHeadingLeft: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    heading: 'Mountain Adventures',
    description: 'From the Rila peaks to the Rhodope ridges, adventure awaits.',
    textAlignment: 'left',
  },
}

export const WithHeadingRight: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    heading: 'Coastal Charm',
    description: 'The Black Sea coast offers golden beaches and ancient towns.',
    textAlignment: 'right',
  },
}

// ─── Backgrounds ───

export const DarkBackground: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    background: 'dark',
    heading: 'Night Skies',
    description: "Experience stargazing in Bulgaria's mountain observatories.",
    textAlignment: 'center',
  },
}

export const PrimaryLightBackground: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    background: 'primaryLight',
    heading: 'Spring Blossoms',
    description: 'The Rose Valley comes alive every May with fragrant fields.',
    textAlignment: 'center',
  },
}

// ─── Image heights ───

export const HeightSmall: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    imageHeight: 'sm',
    heading: 'Small Height (30vh)',
  },
}

export const HeightMedium: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    imageHeight: 'md',
    heading: 'Medium Height (50vh)',
  },
}

export const HeightLarge: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    imageHeight: 'lg',
    heading: 'Large Height (70vh)',
  },
}

export const HeightFullScreen: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullBleed',
    imageHeight: 'screen',
    heading: 'Full Screen',
  },
}

// ─── Parallax ───

export const WithParallax: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    imageHeight: 'md',
    enableParallax: true,
    heading: 'Parallax Effect',
    description: 'Scroll down to see the parallax movement.',
  },
  decorators: [
    (Story: any) => (
      <div>
        <div className="h-[50vh] bg-grey-100 flex items-center justify-center">
          <p className="text-grey-400 text-lg">Scroll down ↓</p>
        </div>
        <Story />
        <div className="h-[100vh] bg-grey-100 flex items-center justify-center">
          <p className="text-grey-400 text-lg">Content below the parallax block</p>
        </div>
      </div>
    ),
  ],
}

// ─── With caption ───

export const WithCaption: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'default',
    heading: 'Seven Rila Lakes',
    blockCaption: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'The Seven Rila Lakes are a group of glacial lakes in the northwestern Rila Mountains. Photo by Ivan Petrov, 2024.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    textAlignment: 'center',
  },
}

// ─── Portrait image ───

export const PortraitImage: Story = {
  args: {
    media: mockPortraitMedia,
    mediaType: 'image',
    layout: 'default',
    heading: 'Portrait Format',
    description: 'Works with portrait-oriented images too.',
  },
}

// ─── Combined: Dark + FullWidth + Heading + Caption ───

export const FullCombo: Story = {
  args: {
    media: mockMedia,
    mediaType: 'image',
    layout: 'fullWidth',
    background: 'dark',
    heading: 'Rila Monastery',
    description: 'A UNESCO World Heritage Site nestled in the Rila Mountains.',
    textAlignment: 'center',
    imageHeight: 'lg',
    blockCaption: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                text: 'Founded in the 10th century, the monastery is one of the most important cultural and historical monuments in Bulgaria.',
              },
            ],
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
}
