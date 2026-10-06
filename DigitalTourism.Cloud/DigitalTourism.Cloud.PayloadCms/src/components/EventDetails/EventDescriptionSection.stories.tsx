'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { EventDescriptionSection } from './EventDescriptionSection'

const mockCategories = [
  { id: 1, title: 'Бизнес', slug: 'business', createdAt: '', updatedAt: '' },
  { id: 2, title: 'Развитие', slug: 'development', createdAt: '', updatedAt: '' },
  { id: 3, title: 'Развлечение', slug: 'entertainment', createdAt: '', updatedAt: '' },
] as any[]

const mockDescription = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'На 10ти февруари 2026 г. от 19:00 ч. ви очакваме в Emu Fun Bar за двадесето издание на Hills of Business – среща, посветена на създаването на нови контакти и партньорства. Този път залагаме на по-неформална атмосфера, в която участниците ще могат да се опознаят по нов начин чрез игрови елементи.',
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
  title: 'EventDetails/EventDescriptionSection',
  component: EventDescriptionSection,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1000-4157',
    },
  },
} satisfies Meta<typeof EventDescriptionSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    heading: 'Какво Ви очаква?',
    categories: mockCategories,
    description: mockDescription,
  },
}

export const WithManyCategories: Story = {
  args: {
    ...Default.args,
    categories: [
      ...mockCategories,
      { id: 4, title: 'Нетуъркинг', slug: 'networking', createdAt: '', updatedAt: '' },
      { id: 5, title: 'Технологии', slug: 'tech', createdAt: '', updatedAt: '' },
    ] as any[],
  },
}

export const NoCategories: Story = {
  args: {
    ...Default.args,
    categories: [],
  },
}
