'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { ExperienceBreadcrumbsBar } from './ExperienceBreadcrumbsBar'

const meta = {
  title: 'ExperienceDetails/ExperienceBreadcrumbsBar',
  component: ExperienceBreadcrumbsBar,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=938:2311',
    },
  },
} satisfies Meta<typeof ExperienceBreadcrumbsBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    breadcrumbs: [
      { label: 'Начало', href: '/' },
      { label: 'Активности', href: '/activities' },
      { label: 'Култура' },
      { label: 'Храм-паметник „Свети Александър Невски"' },
    ],
    experienceTitle: 'Храм-паметник „Свети Александър Невски"',
  },
}

export const ShortBreadcrumbs: Story = {
  args: {
    breadcrumbs: [
      { label: 'Начало', href: '/' },
      { label: 'Хотели', href: '/hotels' },
      { label: 'Хотел Марица' },
    ],
    experienceTitle: 'Хотел Марица',
  },
}

export const Liked: Story = {
  args: {
    breadcrumbs: [
      { label: 'Начало', href: '/' },
      { label: 'Ресторанти', href: '/restaurants' },
      { label: 'Ресторант Воденицата' },
    ],
    experienceTitle: 'Ресторант Воденицата',
    collectionSlug: 'restaurants',
    experienceId: 1,
  },
}

export const WithCustomSocialLinks: Story = {
  args: {
    breadcrumbs: [
      { label: 'Начало', href: '/' },
      { label: 'Забележителности', href: '/attractions' },
      { label: 'Рилски манастир' },
    ],
    experienceTitle: 'Рилски манастир',
    socialLinks: {
      facebook: 'https://facebook.com/rilskimanastir',
      x: 'https://x.com/rilskimanastir',
      instagram: 'https://instagram.com/rilskimanastir',
    },
  },
}
