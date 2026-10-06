'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { HorizontalAccordion } from './index'
import type { HorizontalAccordionItem } from './index'
import type { Media as MediaType } from '@/payload-types'

function createMockImage(seed: string): MediaType {
  return {
    id: 1,
    alt: `Accordion image ${seed}`,
    url: `https://picsum.photos/seed/${seed}/800/600`,
    width: 800,
    height: 600,
    filename: `${seed}.jpg`,
    mimeType: 'image/jpeg',
    filesize: 80000,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  }
}

function createMockBody(text: string) {
  return {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          version: 1,
        },
      ],
      direction: null,
      format: '' as any,
      indent: 0,
      version: 1,
    },
  } as any
}

const twoItems: HorizontalAccordionItem[] = [
  {
    number: '01',
    title: 'История',
    body: createMockBody(
      'Рилският манастир е основан през X век от св. Иван Рилски. Той е най-значимият духовен и културен център на българската нация.',
    ),
    image: createMockImage('acc1'),
  },
  {
    number: '02',
    title: 'Архитектура',
    body: createMockBody(
      'Манастирският комплекс заема площ от 8800 кв.м. и включва църква, жилищни сгради и кула.',
    ),
    image: createMockImage('acc2'),
  },
]

const fourItems: HorizontalAccordionItem[] = [
  ...twoItems,
  {
    number: '03',
    title: 'Природа',
    body: createMockBody(
      'Околностите на манастира предлагат невероятни гледки към Рила планина с вековни гори и кристалночисти потоци.',
    ),
    image: createMockImage('acc3'),
  },
  {
    number: '04',
    title: 'Практическа информация',
    body: createMockBody(
      'Манастирът е отворен за посещения всеки ден от 07:00 до 20:00. Входът е свободен.',
    ),
    image: createMockImage('acc4'),
  },
]

const meta = {
  title: 'Components/HorizontalAccordion',
  component: HorizontalAccordion,
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=938:2437',
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[1200px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HorizontalAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const TwoItems: Story = {
  args: {
    items: twoItems,
  },
}

export const FourItems: Story = {
  args: {
    items: fourItems,
  },
}

export const WithoutImages: Story = {
  args: {
    items: fourItems.map(({ image: _image, ...rest }) => rest),
  },
}
