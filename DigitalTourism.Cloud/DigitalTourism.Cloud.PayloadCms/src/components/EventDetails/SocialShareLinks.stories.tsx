'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { SocialShareLinks } from './SocialShareLinks'

const meta = {
  title: 'EventDetails/SocialShareLinks',
  component: SocialShareLinks,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=1562-19005',
    },
  },
} satisfies Meta<typeof SocialShareLinks>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Бизнес събитие #20 - HoB',
    url: 'https://example.com/events/hob-20',
  },
}
