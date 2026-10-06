'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { PagesOrganizer } from './PagesOrganizer'

const mockItems = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/org1/474/582',
    title: 'Hills of Business',
    href: '#',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/org2/474/582',
    title: 'Съвременен нетуъркинг',
    href: '#',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/org3/474/582',
    title: 'Бизнес идеи и опит',
    href: '#',
  },
]

const mockDescription = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'В Hills of Business (HoB) вярваме, че пътят на предприемача не трябва да бъде самотен и обмяната на информация е ключова за успеха на всеки. Ние сме общност от 270+ активни лидери, водени от принципите на честност и взаимна помощ.',
          },
        ],
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}

const meta = {
  title: 'Blocks/PagesBlock/PagesOrganizer',
  component: PagesOrganizer,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1000-4664',
    },
  },
} satisfies Meta<typeof PagesOrganizer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    heading: 'Организатор на събитието',
    description: mockDescription,
    ctaLabel: 'Научи повече',
    ctaUrl: 'https://example.com/organizer',
    items: mockItems,
  },
}

export const NoImages: Story = {
  args: {
    heading: 'Организатор на събитието',
    description: mockDescription,
    ctaLabel: 'Научи повече',
    ctaUrl: 'https://example.com/organizer',
    items: [],
  },
}

export const LongDescription: Story = {
  args: {
    ...Default.args,
    heading: 'Организатор с много дълго заглавие за тестване',
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
              },
            ],
            version: 1,
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
