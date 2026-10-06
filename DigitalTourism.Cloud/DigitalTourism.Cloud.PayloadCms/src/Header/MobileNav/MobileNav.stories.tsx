'use client'

import React from 'react'
import Link from 'next/link'
import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { Logo } from '@/components/Logo/Logo'
import { MobileNav } from './index'
import type { MainMenu } from '@/payload-types'

type Tab = NonNullable<MainMenu['tabs']>[number]

// ── Mock tabs matching existing MegaMenu stories ──
const mockTabs = [
  {
    label: 'Дестинации',
    enableDropdown: true,
    dropdownType: 'directions',
    link: { type: 'custom', url: '/destinations' },
    navItems: [
      {
        listLinks: {
          tag: 'Региони',
          links: [
            { link: { type: 'custom', url: '#', label: 'Софийски регион' } },
            { link: { type: 'custom', url: '#', label: 'Бургаски Черноморски регион' } },
            { link: { type: 'custom', url: '#', label: 'Старопланински регион' } },
            { link: { type: 'custom', url: '#', label: 'Рила-Пирински регион' } },
            { link: { type: 'custom', url: '#', label: 'Варненски Черноморски регион' } },
            { link: { type: 'custom', url: '#', label: 'Долината на розите' } },
          ],
        },
      },
      {
        listLinks: {
          tag: 'Градове',
          links: [
            { link: { type: 'custom', url: '#', label: 'София' } },
            { link: { type: 'custom', url: '#', label: 'Пловдив' } },
            { link: { type: 'custom', url: '#', label: 'Варна' } },
          ],
        },
      },
      {
        listLinks: {
          tag: 'Плажове и крайбрежие',
          links: [
            { link: { type: 'custom', url: '#', label: 'Слънчев бряг' } },
            { link: { type: 'custom', url: '#', label: 'Златни пясъци' } },
          ],
        },
      },
      {
        listLinks: {
          tag: 'Планини и ски',
          links: [
            { link: { type: 'custom', url: '#', label: 'Банско' } },
            { link: { type: 'custom', url: '#', label: 'Пампорово' } },
          ],
        },
      },
      {
        listLinks: {
          tag: 'По интерес',
          links: [
            { link: { type: 'custom', url: '#', label: 'Културен туризъм' } },
            { link: { type: 'custom', url: '#', label: 'Приключенски туризъм' } },
          ],
        },
      },
      {
        listLinks: {
          tag: 'Видове туризъм',
          links: [
            { link: { type: 'custom', url: '#', label: 'Плажен туризъм' } },
            { link: { type: 'custom', url: '#', label: 'Еко и природа' } },
          ],
        },
      },
    ],
  },
  {
    label: 'Активности',
    enableDropdown: true,
    dropdownType: 'directions',
    navItems: [
      {
        listLinks: {
          tag: 'На открито',
          links: [
            { link: { type: 'custom', url: '#', label: 'Каякинг и рафтинг' } },
            { link: { type: 'custom', url: '#', label: 'Планинско колоездене' } },
          ],
        },
      },
    ],
  },
  {
    label: 'Планирай пътуване',
    enableDropdown: true,
    dropdownType: 'directions',
    navItems: [
      {
        listLinks: {
          tag: 'Настаняване',
          links: [
            { link: { type: 'custom', url: '#', label: 'Хотели и курорти' } },
          ],
        },
      },
    ],
  },
  {
    label: 'Опознай',
    enableDropdown: true,
    dropdownType: 'info',
    navItems: [
      {
        listLinks: {
          tag: 'Основни',
          links: [
            { link: { type: 'custom', url: '#', label: 'Настаняване' } },
            { link: { type: 'custom', url: '#', label: 'Транспорт' } },
          ],
        },
      },
    ],
  },
  { label: 'Събития', enableDirectLink: true, link: { type: 'custom', url: '/events' } },
] as unknown as Tab[]

const HeaderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <header className="relative z-50 bg-white shadow-sm">
    <div className="container flex items-center justify-between p-5">
      <Link href="/" className="flex-shrink-0" prefetch={false}>
        <Logo variant="dark" loading="eager" priority="high" />
      </Link>
      {children}
    </div>
  </header>
)

const meta: Meta<typeof MobileNav> = {
  title: 'Header/MobileMenu',
  component: MobileNav,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile' },
    ...figmaDesign('1578:12833'),
  },
  args: { tabHeaders: mockTabs, fullTabs: mockTabs, onMenuOpen: () => {} },
  decorators: [
    (Story) => (
      <HeaderWrapper>
        <Story />
      </HeaderWrapper>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Phone: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    ...figmaDesign('1578:12833'),
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'sm' },
    ...figmaDesign('1577:14361'),
  },
}
