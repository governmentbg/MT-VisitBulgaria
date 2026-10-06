'use client'

import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { CarouselStandard } from './components/CarouselStandard'
import { CarouselOverlay } from './components/CarouselOverlay'
import { CarouselHorizontal } from './components/CarouselHorizontal'
import { CarouselSection } from './components/CarouselSection'
import { ResultGrid } from './components/ResultGrid'
import { MonthFilterTabs, type MonthFilterValue } from '@/components/MonthFilterTabs'
import type { BlockSearchResult, SectionVariant } from './types'

const mockItems: BlockSearchResult[] = Array.from({ length: 9 }, (_, i) => ({
  id: `item-${i + 1}`,
  title: [
    'Рилски манастир',
    'Боянска църква',
    'Велико Търново',
    'Пловдив – Стар град',
    'Созопол – Старият град',
    'Мелник',
    'Банско – зимен курорт',
    'Бузлуджа',
    'Перперикон',
  ][i],
  slug: `item-${i + 1}`,
  type: ['attraction', 'attraction', 'attraction', 'attraction', 'attraction', 'attraction', 'activity', 'attraction', 'attraction'][i],
  description: 'Открийте красотата на България чрез незабравимо преживяване.',
  categories: [['Култура', 'Наследство', 'История', 'Архитектура', 'Морски', 'Вино', 'Ски', 'Паметник', 'Археология'][i]],
  location: {
    city: ['Рила', 'София', 'Велико Търново', 'Пловдив', 'Созопол', 'Мелник', 'Банско', 'Бузлуджа', 'Кърджали'][i],
    region: ['Кюстендил', 'София-град', 'Велико Търново', 'Пловдив', 'Бургас', 'Благоевград', 'Благоевград', 'Стара Загора', 'Кърджали'][i],
  },
  heroImage: {
    url: `https://picsum.photos/seed/dt-${i + 1}/800/600`,
    alt: `Image ${i + 1}`,
  },
  rating: [4.8, 4.5, 4.9, 4.7, 4.6, 4.3, 4.8, 4.2, 4.4][i],
  priceLevel: ['$$', '$', '$$$', '$$', '$$', '$', '$$$', '$', '$$'][i],
}))

const mockEvents: BlockSearchResult[] = Array.from({ length: 9 }, (_, i) => ({
  id: `event-${i + 1}`,
  title: [
    'Фестивал на розата',
    'Нощ на музеите',
    'Джаз фест Банско',
    'Винен фестивал Мелник',
    'Фолклорен събор Копривщица',
    'Фестивал на пясъчните фигури',
    'Спирит оф Бургас',
    'Opera Open Пловдив',
    'Сурва – Перник',
  ][i],
  slug: `event-${i + 1}`,
  type: 'event',
  description: [
    'Традиционен празник в Казанлък с парад и коронясване на Царица Роза.',
    'Безплатен вход до музеи и галерии в цялата страна.',
    'Международен джаз фестивал в сърцето на Пирин.',
    'Дегустации на уникални мелнишки вина.',
    'Най-големият фолклорен събор на Балканите.',
    'Впечатляващи скулптури от пясък на бургаския плаж.',
    'Музикален фестивал на открито в Бургас.',
    'Оперни спектакли под открито небе в Античния театър.',
    'Международен фестивал на маскарадните игри.',
  ][i],
  categories: [['Фестивал', 'Култура', 'Музика', 'Вино', 'Фолклор', 'Изкуство', 'Музика', 'Опера', 'Традиции'][i]],
  location: {
    city: ['Казанлък', 'София', 'Банско', 'Мелник', 'Копривщица', 'Бургас', 'Бургас', 'Пловдив', 'Перник'][i],
    region: ['Стара Загора', 'София-град', 'Благоевград', 'Благоевград', 'София', 'Бургас', 'Бургас', 'Пловдив', 'Перник'][i],
  },
  heroImage: {
    url: `https://picsum.photos/seed/ev-${i + 1}/800/600`,
    alt: `Event ${i + 1}`,
  },
  date: [
    '2026-06-07',
    '2026-05-17',
    '2026-08-10',
    '2026-09-14',
    '2026-08-09',
    '2026-07-01',
    '2026-07-18',
    '2026-06-25',
    '2026-01-17',
  ][i],
}))

const sectionProps = {
  heading: 'Популярни преживявания',
  description: 'Разгледайте най-интересните преживявания в България.',
  sectionLabel: 'Преживявания',
  viewAllLink: { type: 'custom' as const, url: '/experiences', label: 'Виж всички' },
}

// ─── Month filter wrapper for interactive stories ───

const MonthFilterSlot: React.FC<{ variant: SectionVariant }> = ({ variant }) => {
  const [month, setMonth] = React.useState<MonthFilterValue>('thisMonth')
  return (
    <MonthFilterTabs
      value={month}
      onChange={setMonth}
      labels={{ thisMonth: 'Този месец', nextMonth: 'Следващия месец' }}
      variant={variant === 'dark' ? 'dark' : 'light'}
    />
  )
}

// ─── Composed carousel with section wrapper ───

type CarouselStoryMode = 'carouselStandard' | 'carouselOverlay' | 'carouselHorizontal'

type DecorationImage = 'none' | 'watermark' | 'horizontalWatermark'

interface StoryArgs {
  mode: string
  sectionVariant: SectionVariant
  showMonthFilter: boolean
  decorationImage: DecorationImage
  decorationAlignment?: 'left' | 'right'
  backgroundShape?: 'full' | 'cutLeft' | 'cutRight'
  headerAlignment?: 'left' | 'center' | 'right'
  overlayCardStyle?: 'overlay' | 'standard'
  overlayLayout?: 'sideBySide' | 'stacked'
}

const CarouselWithSection: React.FC<StoryArgs> = ({ mode, sectionVariant, showMonthFilter, decorationImage = 'none', decorationAlignment, backgroundShape, headerAlignment, overlayCardStyle, overlayLayout }) => {
  const displayMode = mode as CarouselStoryMode
  const monthFilterSlot = showMonthFilter ? <MonthFilterSlot variant={sectionVariant} /> : null
  const items = showMonthFilter ? mockEvents : mockItems
  const props = { ...sectionProps, sectionVariant, headerAlignment, monthFilterSlot, items }

  return (
    <CarouselSection displayMode={displayMode} sectionVariant={sectionVariant} decorationImage={decorationImage} decorationAlignment={decorationAlignment} backgroundShape={backgroundShape}>
      {displayMode === 'carouselStandard' && <CarouselStandard {...props} />}
      {displayMode === 'carouselOverlay' && <CarouselOverlay {...props} overlayCardStyle={overlayCardStyle} overlayLayout={overlayLayout} />}
      {displayMode === 'carouselHorizontal' && <CarouselHorizontal {...props} />}
    </CarouselSection>
  )
}

const ExperienceListingShowcase: React.FC<StoryArgs> = (args) => {
  if (args.mode === 'grid') {
    return (
      <div className="container py-12">
        <ResultGrid results={mockItems} gridColumns={3} isLoading={false} itemsPerPage={9} />
      </div>
    )
  }
  return <CarouselWithSection {...args} />
}

const meta = {
  title: 'Blocks/ExperienceListing',
  component: ExperienceListingShowcase,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    mode: {
      control: 'select',
      options: ['grid', 'carouselStandard', 'carouselOverlay', 'carouselHorizontal'],
    },
    sectionVariant: {
      control: 'select',
      options: ['dark', 'darkAlt', 'teal', 'light'],
    },
    showMonthFilter: {
      control: 'boolean',
    },
    decorationImage: {
      control: 'select',
      options: ['none', 'watermark', 'horizontalWatermark'],
    },
    decorationAlignment: {
      control: 'select',
      options: ['left', 'right'],
    },
    backgroundShape: {
      control: 'select',
      options: ['full', 'cutLeft', 'cutRight'],
    },
    overlayCardStyle: {
      control: 'select',
      options: ['overlay', 'standard'],
    },
    overlayLayout: {
      control: 'select',
      options: ['sideBySide', 'stacked'],
    },
    headerAlignment: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof ExperienceListingShowcase>

export default meta
type Story = StoryObj<typeof meta>

// ─── Grid ───

export const Grid: Story = {
  args: { mode: 'grid', sectionVariant: 'light', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
  parameters: figmaDesign('40000843:2297'),
}

// ─── Carousel Standard ───

export const StandardLight: Story = {
  name: 'Standard / Light',
  args: { mode: 'carouselStandard', sectionVariant: 'light', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
  parameters: figmaDesign('904:16524'),
}

export const StandardDark: Story = {
  name: 'Standard / Dark',
  args: { mode: 'carouselStandard', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const StandardTeal: Story = {
  name: 'Standard / Teal',
  args: { mode: 'carouselStandard', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const StandardDarkWithMonthFilter: Story = {
  name: 'Standard / Dark + Month Filter',
  args: { mode: 'carouselStandard', sectionVariant: 'dark', showMonthFilter: true, decorationImage: 'watermark' as DecorationImage },
  parameters: figmaDesign('919:4217'),
}

// ─── Carousel Overlay ───

export const OverlayDark: Story = {
  name: 'Overlay / Dark',
  args: { mode: 'carouselOverlay', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
  parameters: figmaDesign('1340:5207'),
}

export const OverlayTeal: Story = {
  name: 'Overlay / Teal',
  args: { mode: 'carouselOverlay', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const OverlayLight: Story = {
  name: 'Overlay / Light',
  args: { mode: 'carouselOverlay', sectionVariant: 'light', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const OverlayDarkWithMonthFilter: Story = {
  name: 'Overlay / Dark + Month Filter',
  args: { mode: 'carouselOverlay', sectionVariant: 'dark', showMonthFilter: true, decorationImage: 'none' as DecorationImage },
}

// ─── Carousel Horizontal ───

export const HorizontalDark: Story = {
  name: 'Horizontal / Dark',
  args: { mode: 'carouselHorizontal', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
  parameters: figmaDesign('907:4239'),
}

export const HorizontalTeal: Story = {
  name: 'Horizontal / Teal',
  args: { mode: 'carouselHorizontal', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const HorizontalLight: Story = {
  name: 'Horizontal / Light',
  args: { mode: 'carouselHorizontal', sectionVariant: 'light', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const HorizontalTealWithMonthFilter: Story = {
  name: 'Horizontal / Teal + Month Filter',
  args: { mode: 'carouselHorizontal', sectionVariant: 'teal', showMonthFilter: true, decorationImage: 'horizontalWatermark' as DecorationImage },
}

// ─── Dark Alt Variant ───

export const StandardDarkAlt: Story = {
  name: 'Standard / Dark Alt',
  args: { mode: 'carouselStandard', sectionVariant: 'darkAlt', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const OverlayDarkAlt: Story = {
  name: 'Overlay / Dark Alt',
  args: { mode: 'carouselOverlay', sectionVariant: 'darkAlt', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

export const HorizontalDarkAlt: Story = {
  name: 'Horizontal / Dark Alt',
  args: { mode: 'carouselHorizontal', sectionVariant: 'darkAlt', showMonthFilter: false, decorationImage: 'none' as DecorationImage },
}

// ─── Overlay Variants ───

export const OverlayStandardCards: Story = {
  name: 'Overlay / Standard Cards',
  args: { mode: 'carouselOverlay', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'none' as DecorationImage, overlayCardStyle: 'standard' },
}

export const OverlayStackedLayout: Story = {
  name: 'Overlay / Stacked Layout',
  args: { mode: 'carouselOverlay', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'none' as DecorationImage, overlayLayout: 'stacked' },
}

export const OverlayStackedStandardCards: Story = {
  name: 'Overlay / Stacked + Standard Cards',
  args: { mode: 'carouselOverlay', sectionVariant: 'teal', showMonthFilter: true, decorationImage: 'none' as DecorationImage, overlayCardStyle: 'standard', overlayLayout: 'stacked' },
}

// ─── Background Shape ───

export const StandardCutRight: Story = {
  name: 'Standard / Cut Right',
  args: { mode: 'carouselStandard', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'watermark' as DecorationImage, backgroundShape: 'cutRight' },
}

export const StandardCutLeft: Story = {
  name: 'Standard / Cut Left',
  args: { mode: 'carouselStandard', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'horizontalWatermark' as DecorationImage, backgroundShape: 'cutLeft' },
}

export const OverlayCutRight: Story = {
  name: 'Overlay / Cut Right',
  args: { mode: 'carouselOverlay', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'watermark' as DecorationImage, backgroundShape: 'cutRight', decorationAlignment: 'right' },
}

export const OverlayCutLeft: Story = {
  name: 'Overlay / Cut Left + Standard Cards',
  args: { mode: 'carouselOverlay', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'horizontalWatermark' as DecorationImage, backgroundShape: 'cutLeft', overlayCardStyle: 'standard', overlayLayout: 'stacked' },
}

export const HorizontalCutRight: Story = {
  name: 'Horizontal / Cut Right',
  args: { mode: 'carouselHorizontal', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'watermark' as DecorationImage, backgroundShape: 'cutRight', decorationAlignment: 'right' },
}

export const HorizontalCutLeft: Story = {
  name: 'Horizontal / Cut Left',
  args: { mode: 'carouselHorizontal', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'horizontalWatermark' as DecorationImage, backgroundShape: 'cutLeft' },
}

// ─── Decoration Alignment ───

export const OverlayWatermarkRight: Story = {
  name: 'Overlay / Watermark Right',
  args: { mode: 'carouselOverlay', sectionVariant: 'dark', showMonthFilter: false, decorationImage: 'watermark' as DecorationImage, decorationAlignment: 'right' },
}

export const HorizontalWatermarkRight: Story = {
  name: 'Horizontal / Watermark Right',
  args: { mode: 'carouselHorizontal', sectionVariant: 'teal', showMonthFilter: false, decorationImage: 'horizontalWatermark' as DecorationImage, decorationAlignment: 'right' },
}
