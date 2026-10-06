'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import {
  SearchRegular,
  MapRegular,
  GlobeRegular,
  DismissRegular,
} from '@/components/ui/icons'
import { MobileMenuOverlay } from './MobileMenuOverlay'
import { MobileMenuHeader } from './MobileMenuHeader'
import { MobileMenuActions } from './MobileMenuActions'
import type { MobileMenuItem } from './MobileMenuList'
import type { MobileMenuAction } from './MobileMenuHeader'

// ── Mock data matching Figma designs ──

const mockLogo = (
  <div className="font-heading text-primary text-[14px] font-bold leading-tight">
    <div className="text-primary text-2xl">&#x2766;</div>
    <div>БЪЛГАРИЯ</div>
  </div>
)

const headerActions: MobileMenuAction[] = [
  { icon: <SearchRegular />, label: 'Търсене', href: '/search' },
  { icon: <MapRegular />, label: 'Карта', href: '/map', hideOnPhone: true },
  { icon: <GlobeRegular />, label: 'Език' },
  { icon: <DismissRegular />, label: 'Затвори' },
]

const level1Items: MobileMenuItem[] = [
  { label: 'Дестинации', hasChildren: true },
  { label: 'Активности', hasChildren: true },
  { label: 'Планирай пътуване', hasChildren: true },
  { label: 'Опознай', hasChildren: true },
  { label: 'Събития', href: '/events' },
]

const level2Items: MobileMenuItem[] = [
  { label: 'Региони', hasChildren: true },
  { label: 'Градове', hasChildren: true },
  { label: 'Плажове и крайбрежие', hasChildren: true },
  { label: 'Планини и ски', hasChildren: true },
  { label: 'По интерес', hasChildren: true },
  { label: 'Видове туризъм', hasChildren: true },
]

const level3Items: MobileMenuItem[] = [
  { label: 'Софийски регион', href: '#' },
  { label: 'Бургаски Черноморски регион', href: '#' },
  { label: 'Старопланински регион', href: '#' },
  { label: 'Рила-Пирински регион', href: '#' },
  { label: 'Варненски Черноморски регион', href: '#' },
  { label: 'Долината на розите', href: '#' },
]

const mapActionIcon = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" stroke="#00BBA7" strokeWidth="2" />
    <path d="M9 18L12 10L19 13L16 21L9 18Z" fill="#00BBA7" />
  </svg>
)

const loginActionIcon = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" stroke="#00BBA7" strokeWidth="2" />
    <circle cx="14" cy="11" r="4" fill="#00BBA7" />
    <path d="M7 22C7 18.134 10.134 15 14 15C17.866 15 21 18.134 21 22" stroke="#00BBA7" strokeWidth="2" />
  </svg>
)

const HeaderSlot = () => <MobileMenuHeader logo={mockLogo} actions={headerActions} />

const FooterSlot = () => (
  <MobileMenuActions
    actions={[
      { label: 'Карта', icon: mapActionIcon },
      { label: 'Вход', icon: loginActionIcon },
    ]}
  />
)

// ── Meta ──
const meta = {
  title: 'Composites/Navigation/MobileMenuOverlay',
  component: MobileMenuOverlay,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    isOpen: true,
    level: { items: level1Items },
    onClose: () => {},
  },
} satisfies Meta<typeof MobileMenuOverlay>

export default meta
type Story = StoryObj<typeof meta>

// ── Tablet Stories ──

export const TabletLevel1: Story = {
  parameters: {
    viewport: { defaultViewport: 'sm' },
    ...figmaDesign('1577:14361'),
  },
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ items: level1Items }}
      onClose={() => {}}
      headerSlot={<HeaderSlot />}
      footerSlot={<FooterSlot />}
    />
  ),
}

export const TabletLevel2: Story = {
  parameters: {
    viewport: { defaultViewport: 'sm' },
    ...figmaDesign('1578:12045'),
  },
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ title: 'Дестинации', backLabel: 'Главно меню', items: level2Items }}
      onBack={() => {}}
      onClose={() => {}}
      direction="forward"
    />
  ),
}

export const TabletLevel3: Story = {
  parameters: {
    viewport: { defaultViewport: 'sm' },
    ...figmaDesign('1578:12145'),
  },
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ title: 'Региони', backLabel: 'Дестинации', items: level3Items }}
      onBack={() => {}}
      onClose={() => {}}
      direction="forward"
    />
  ),
}

// ── Phone Stories ──

export const PhoneLevel1: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    ...figmaDesign('1578:12833'),
  },
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ items: level1Items }}
      onClose={() => {}}
      headerSlot={<HeaderSlot />}
      footerSlot={<FooterSlot />}
    />
  ),
}

export const PhoneLevel2: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    ...figmaDesign('1578:13316'),
  },
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ title: 'Дестинации', backLabel: 'Главно меню', items: level2Items }}
      onBack={() => {}}
      onClose={() => {}}
      direction="forward"
    />
  ),
}

export const PhoneLevel3: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    ...figmaDesign('1578:13418'),
  },
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ title: 'Региони', backLabel: 'Дестинации', items: level3Items }}
      onBack={() => {}}
      onClose={() => {}}
      direction="forward"
    />
  ),
}

// ── Overflow Stories ──

const manyItems: MobileMenuItem[] = Array.from({ length: 20 }, (_, i) => ({
  label: `Регион ${i + 1}`,
  href: '#',
}))

export const PhoneOverflow: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ title: 'Региони', backLabel: 'Дестинации', items: manyItems }}
      onBack={() => {}}
      onClose={() => {}}
      direction="forward"
    />
  ),
}

// ── Interactive Playground ──

export const Playground: Story = {
  render: () => (
    <MobileMenuOverlay
      isOpen
      level={{ items: level1Items }}
      onClose={() => {}}
      headerSlot={<HeaderSlot />}
      footerSlot={<FooterSlot />}
    />
  ),
}
