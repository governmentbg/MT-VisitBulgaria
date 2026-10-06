import React from 'react'
import Link from 'next/link'
import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { DesktopNav } from './index'
import { type NavTheme, navThemeConfig } from '../types'
import type { MainMenu } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import {
  BuildingRegular,
  FoodRegular,
  VehicleBusRegular,
  AirplaneRegular,
  DocumentTextRegular,
  ShieldCheckmarkRegular,
  CurrencyDollarEuroRegular,
  GavelRegular,
  WeatherSunnyRegular,
  CompassNorthwestRegular,
  QuestionCircleRegular,
  CallRegular,
} from '@/components/ui/icons'

type Tab = NonNullable<MainMenu['tabs']>[number]

// ── Icon map for info-style overlays ──
const mockIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Настаняване: BuildingRegular,
  Ресторанти: FoodRegular,
  Транспорт: VehicleBusRegular,
  'Полети и летища': AirplaneRegular,
  'Визи и граничен контрол': DocumentTextRegular,
  'Застраховки и безопасност': ShieldCheckmarkRegular,
  'Валутна информация': CurrencyDollarEuroRegular,
  'Закони и регулации': GavelRegular,
  'Време и сезони': WeatherSunnyRegular,
  Маршрути: CompassNorthwestRegular,
  Въпроси: QuestionCircleRegular,
  'Спешни контакти': CallRegular,
}

// ── Destinations tab (dropdownType: 'directions' → triggers DestinationsOverlay) ──
// 6 categories, 9 items in the first → 3-column grid
const destinationsTab = {
  label: 'Дестинации',
  enableDropdown: true,
  dropdownType: 'directions' as const,
  link: { type: 'custom' as const, url: '/destinations' },
  navItems: [
    {

      listLinks: {
        tag: 'Региони',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Софийски регион' },
            image: 'https://picsum.photos/seed/bulgaria-sofia/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Варненски Черноморски регион' },
            image: 'https://picsum.photos/seed/bulgaria-varna/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Тракийски регион' },
            image: 'https://picsum.photos/seed/bulgaria-plovdiv/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Рила-Пирински регион' },
            image: 'https://picsum.photos/seed/bulgaria-rila/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Старопланински регион' },
            image: 'https://picsum.photos/seed/bulgaria-mountain/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Дунавски регион' },
            image: 'https://picsum.photos/seed/bulgaria-danube/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Бургаски Черноморски регион' },
            image: 'https://picsum.photos/seed/bulgaria-beach/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Долината на розите' },
            image: 'https://picsum.photos/seed/bulgaria-rose/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Родопски регион' },
            image: 'https://picsum.photos/seed/bulgaria-rhodope/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Градове',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'София' },
            image: 'https://picsum.photos/seed/bulgaria-sofia/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Пловдив' },
            image: 'https://picsum.photos/seed/bulgaria-plovdiv/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Варна' },
            image: 'https://picsum.photos/seed/bulgaria-varna/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Плажове и крайбрежие',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Слънчев бряг' },
            image: 'https://picsum.photos/seed/bulgaria-beach/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Златни пясъци' },
            image: 'https://picsum.photos/seed/bulgaria-pirin/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Созопол' },
            image: 'https://picsum.photos/seed/bulgaria-nessebar/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Планини и ски',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Банско' },
            image: 'https://picsum.photos/seed/bulgaria-bansko/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Пампорово' },
            image: 'https://picsum.photos/seed/bulgaria-vineyard/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Боровец' },
            image: 'https://picsum.photos/seed/bulgaria-monastery/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'По интерес',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Културен туризъм' },
            image: 'https://picsum.photos/seed/bulgaria-culture/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Приключенски туризъм' },
            image: 'https://picsum.photos/seed/bulgaria-adventure/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Спа и уелнес' },
            image: 'https://picsum.photos/seed/bulgaria-spa/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Видове туризъм',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Плажен туризъм' },
            image: 'https://picsum.photos/seed/bulgaria-beach/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Планински туризъм' },
            image: 'https://picsum.photos/seed/bulgaria-mountain/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Еко и природа' },
            image: 'https://picsum.photos/seed/bulgaria-rila/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Винено-кулинарен туризъм' },
            image: 'https://picsum.photos/seed/bulgaria-vineyard/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Обекти на ЮНЕСКО' },
            image: 'https://picsum.photos/seed/bulgaria-nessebar/320/214',
          },
        ],
      },
    },
  ],
} as unknown as Tab

// ── Activities tab – 2 categories, 4 items each → 2-column grid ──
const activitiesTab = {
  label: 'Активности',
  enableDropdown: true,
  dropdownType: 'directions' as const,
  link: { type: 'custom' as const, url: '/activities' },
  navItems: [
    {

      listLinks: {
        tag: 'На открито',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Каякинг и рафтинг' },
            image: 'https://picsum.photos/seed/activity-kayak/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Планинско колоездене' },
            image: 'https://picsum.photos/seed/activity-mtb/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Скално катерене' },
            image: 'https://picsum.photos/seed/activity-climb/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Парапланеризъм' },
            image: 'https://picsum.photos/seed/activity-paraglide/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Култура и забавления',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Винени дегустации' },
            image: 'https://picsum.photos/seed/activity-wine/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Готварски курсове' },
            image: 'https://picsum.photos/seed/activity-cooking/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Арт работилници' },
            image: 'https://picsum.photos/seed/activity-art/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Фолклорни вечери' },
            image: 'https://picsum.photos/seed/activity-folklore/320/214',
          },
        ],
      },
    },
  ],
} as unknown as Tab

// ── Plan Your Trip tab – 3 categories, varied item counts ──
const planTripTab = {
  label: 'Планирай пътуване',
  enableDropdown: true,
  dropdownType: 'directions' as const,
  link: { type: 'custom' as const, url: '/plan' },
  navItems: [
    {

      listLinks: {
        tag: 'Настаняване',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Хотели и курорти' },
            image: 'https://picsum.photos/seed/plan-hotel/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Къщи за гости' },
            image: 'https://picsum.photos/seed/plan-guesthouse/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Къмпинг и глемпинг' },
            image: 'https://picsum.photos/seed/plan-camping/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Апартаменти под наем' },
            image: 'https://picsum.photos/seed/plan-apartment/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Бутикови хотели' },
            image: 'https://picsum.photos/seed/plan-boutique/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Еко селища' },
            image: 'https://picsum.photos/seed/plan-eco/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Транспорт',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Летища и полети' },
            image: 'https://picsum.photos/seed/plan-airport/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Влакове и автобуси' },
            image: 'https://picsum.photos/seed/plan-train/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Рент-а-кар' },
            image: 'https://picsum.photos/seed/plan-car/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Трансфери' },
            image: 'https://picsum.photos/seed/plan-transfer/320/214',
          },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Пакети и оферти',
        links: [
          {
            link: { type: 'custom' as const, url: '#', label: 'Уикенд пакети' },
            image: 'https://picsum.photos/seed/plan-weekend/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Семейни ваканции' },
            image: 'https://picsum.photos/seed/plan-family/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Романтични пакети' },
            image: 'https://picsum.photos/seed/plan-romantic/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Ол инклузив' },
            image: 'https://picsum.photos/seed/plan-allinclusive/320/214',
          },
          {
            link: { type: 'custom' as const, url: '#', label: 'Last minute оферти' },
            image: 'https://picsum.photos/seed/plan-lastminute/320/214',
          },
        ],
      },
    },
  ],
} as unknown as Tab

// ── Info tab (dropdownType: 'info' → triggers InfoOverlay) ──
const infoTab: Tab = {
  label: 'Опознай',
  enableDropdown: true,
  dropdownType: 'info',
  navItems: [
    {

      listLinks: {
        tag: 'Основни',
        links: [
          { link: { type: 'custom', url: '#', label: 'Настаняване' } },
          { link: { type: 'custom', url: '#', label: 'Ресторанти' } },
          { link: { type: 'custom', url: '#', label: 'Транспорт' } },
          { link: { type: 'custom', url: '#', label: 'Полети и летища' } },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Полезна информация',
        links: [
          { link: { type: 'custom', url: '#', label: 'Визи и граничен контрол' } },
          { link: { type: 'custom', url: '#', label: 'Застраховки и безопасност' } },
          { link: { type: 'custom', url: '#', label: 'Валутна информация' } },
          { link: { type: 'custom', url: '#', label: 'Закони и регулации' } },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Полезна информация',
        links: [
          { link: { type: 'custom', url: '#', label: 'Време и сезони' } },
          { link: { type: 'custom', url: '#', label: 'Маршрути' } },
          { link: { type: 'custom', url: '#', label: 'Въпроси' } },
          { link: { type: 'custom', url: '#', label: 'Спешни контакти' } },
        ],
      },
    },
  ],
}

// Nav tabs matching the Figma design
const mockTabs = [
  destinationsTab,
  activitiesTab,
  planTripTab,
  { ...infoTab, label: 'Опознай' },
  { label: 'Събития', enableDirectLink: true, link: { type: 'custom', url: '#' } },
] as unknown as Tab[]

/** Simulates the real header from Component.client.tsx */
const PageHeader: React.FC<{ children: React.ReactNode; theme?: NavTheme }> = ({
  children,
  theme = 'solid',
}) => {
  const config = navThemeConfig[theme]
  return (
    <header
      className={`relative z-50 transition-colors ${config.headerClass}`}
    >
      <div
        className={`container flex items-center justify-between p-5 transition-colors ${config.headerClass}`}
      >
        <Link href="/" className="flex-shrink-0" prefetch={false}>
          <Logo variant={config.logoVariant} loading="eager" priority="high" />
        </Link>
        {children}
      </div>
    </header>
  )
}

/** Fake hero section to simulate page content behind the overlay */
const HeroSection: React.FC<{ dark?: boolean; full?: boolean }> = ({ dark, full }) => (
  <div
    className={`relative ${full ? 'h-screen' : 'h-[600px]'} ${dark ? '' : 'bg-gradient-to-b from-grey-100 to-grey-50'}`}
    style={
      dark
        ? {
            background:
              'url(https://picsum.photos/seed/bulgaria-hero/1920/1080) center/cover',
          }
        : undefined
    }
  >
    {dark && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/10" />}
    <div className={`relative container px-6 ${full ? 'pt-40' : 'pt-16'}`}>
      <nav className={`font-sans text-body-sm mb-4 ${dark ? 'text-white/70' : 'text-grey-500'}`}>
        Начало &gt; Дестинации &gt; Родопи
      </nav>
      <h1 className={`font-heading text-[64px] font-bold leading-[1.1] ${dark ? 'text-white' : 'text-grey-900'}`}>
        Открий България
      </h1>
      <p className={`mt-4 max-w-2xl text-body-lg ${dark ? 'text-white/80' : 'text-grey-600'}`}>
        Планини, море и хилядолетна история — всичко на едно място.
      </p>
    </div>
  </div>
)

const meta: Meta<typeof DesktopNav> = {
  title: 'Header/MegaMenu',
  component: DesktopNav,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'desktop' },
    ...figmaDesign('1335:9676'),
  },
  args: { tabHeaders: mockTabs, fullTabs: mockTabs, iconMap: mockIconMap, onDropdownOpen: () => {} },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: figmaDesign('1335:9676'),
  render: (args) => (
    <>
      <PageHeader>
        <DesktopNav {...args} />
      </PageHeader>
      <HeroSection />
    </>
  ),
}

export const TransparentLight: Story = {
  parameters: {
    ...figmaDesign('40000740:8128'),
    backgrounds: { default: 'dark' },
  },
  args: { tabHeaders: mockTabs, fullTabs: mockTabs, theme: 'transparent-light', iconMap: mockIconMap, onDropdownOpen: () => {} },
  render: (args) => (
    <div className="relative">
      <HeroSection dark full />
      <div className="absolute inset-x-0 top-0 z-50">
        <PageHeader theme="transparent-light">
          <DesktopNav {...args} />
        </PageHeader>
      </div>
    </div>
  ),
}

export const TransparentDark: Story = {
  parameters: figmaDesign('40000740:8128'),
  args: { tabHeaders: mockTabs, fullTabs: mockTabs, theme: 'transparent-dark', iconMap: mockIconMap, onDropdownOpen: () => {} },
  render: (args) => (
    <div className="relative">
      <HeroSection full />
      <div className="absolute inset-x-0 top-0 z-50">
        <PageHeader theme="transparent-dark">
          <DesktopNav {...args} />
        </PageHeader>
      </div>
    </div>
  ),
}

