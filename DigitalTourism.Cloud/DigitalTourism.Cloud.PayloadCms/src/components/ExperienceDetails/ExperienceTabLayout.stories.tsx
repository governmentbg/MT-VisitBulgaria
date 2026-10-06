'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ExperienceTabLayout } from './ExperienceTabLayout'

const meta = {
  title: 'ExperienceDetails/ExperienceTabLayout',
  component: ExperienceTabLayout,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=938:1831',
    },
  },
} satisfies Meta<typeof ExperienceTabLayout>

export default meta
type Story = StoryObj<typeof meta>

export const TwoTabs: Story = {
  args: {
    tabs: [
      {
        id: 'info',
        label: 'Информация',
        content: (
          <div className="container py-8">
            <div className="mx-auto max-w-[1066px]">
              <h2 className="mb-4 text-3xl font-bold">Информация</h2>
              <p className="text-lg text-grey-500">
                Рилският манастир е най-големият и най-известен източноправославен манастир в
                България. Намира се в югозападната част на Рила планина.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'contacts',
        label: 'Работно време и контакти',
        content: (
          <div className="container py-8">
            <div className="mx-auto max-w-[1066px]">
              <h2 className="mb-4 text-3xl font-bold">Контакти</h2>
              <p className="text-lg text-grey-500">Телефон: +359 888 123 456</p>
            </div>
          </div>
        ),
      },
    ],
  },
}

export const ThreeTabs: Story = {
  args: {
    tabs: [
      {
        id: 'info',
        label: 'Информация',
        content: <div className="container py-8"><p>Tab 1 content</p></div>,
      },
      {
        id: 'contacts',
        label: 'Контакти',
        content: <div className="container py-8"><p>Tab 2 content</p></div>,
      },
      {
        id: 'reviews',
        label: 'Отзиви',
        content: <div className="container py-8"><p>Tab 3 content</p></div>,
      },
    ],
  },
}
