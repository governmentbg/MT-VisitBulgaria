import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { InfoOverlay } from './InfoOverlay'
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
import type { MainMenu } from '@/payload-types'

type Tab = NonNullable<MainMenu['tabs']>[number]

const mockTab: Tab = {
  label: 'Полезна информация',
  enableDropdown: true,
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

const meta: Meta<typeof InfoOverlay> = {
  title: 'Header/InfoOverlay',
  component: InfoOverlay,
  parameters: { layout: 'fullscreen', ...figmaDesign('1335:9797') },
  args: {
    tab: mockTab,
    onClose: () => {},
    iconMap: mockIconMap,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { tab: mockTab, onClose: () => {} },
  render: (_args) => (
    <div className="flex flex-col gap-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold">InfoOverlay</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Mega menu overlay with 3 columns of icon + text items for practical information.
        </p>
      </div>
      <div className="p-6">
        <InfoOverlay tab={mockTab} onClose={() => {}} iconMap={mockIconMap} />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    tab: mockTab,
    onClose: () => {},
    iconMap: mockIconMap,
  },
}
