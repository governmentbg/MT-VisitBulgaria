import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { DestinationsOverlay } from './DestinationsOverlay'
import type { MainMenu } from '@/payload-types'

type Tab = NonNullable<MainMenu['tabs']>[number]

// ── Full destinations data (6 categories, 3-column grid) ──
const mockTab = {
  label: 'Дестинации',
  enableDropdown: true,
  link: { type: 'custom' as const, url: '/destinations' },
  navItems: [
    {

      listLinks: {
        tag: 'Региони',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'София' }, image: 'https://picsum.photos/seed/bulgaria-sofia/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Пловдив' }, image: 'https://picsum.photos/seed/bulgaria-plovdiv/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Варна' }, image: 'https://picsum.photos/seed/bulgaria-varna/320/214' },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Градове',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'Велико Търново' }, image: 'https://picsum.photos/seed/bulgaria-bansko/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Несебър' }, image: 'https://picsum.photos/seed/bulgaria-nessebar/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Банско' }, image: 'https://picsum.photos/seed/bulgaria-rila/320/214' },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Плажове и крайбрежие',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'Слънчев бряг' }, image: 'https://picsum.photos/seed/bulgaria-beach/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Златни пясъци' }, image: 'https://picsum.photos/seed/bulgaria-pirin/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Созопол' }, image: 'https://picsum.photos/seed/bulgaria-mountain/320/214' },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Планини и ски',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'Банско ски' }, image: 'https://picsum.photos/seed/bulgaria-monastery/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Пампорово' }, image: 'https://picsum.photos/seed/bulgaria-vineyard/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Боровец' }, image: 'https://picsum.photos/seed/bulgaria-rose/320/214' },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Природни паркове',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'Рила' }, image: 'https://picsum.photos/seed/bulgaria-rila/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Пирин' }, image: 'https://picsum.photos/seed/bulgaria-pirin/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Витоша' }, image: 'https://picsum.photos/seed/bulgaria-mountain/320/214' },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Видове туризъм',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'Културен туризъм' }, image: 'https://picsum.photos/seed/bulgaria-sofia/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Плажен туризъм' }, image: 'https://picsum.photos/seed/bulgaria-beach/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Приключенски туризъм' }, image: 'https://picsum.photos/seed/bulgaria-mountain/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Планински и ски туризъм' }, image: 'https://picsum.photos/seed/bulgaria-bansko/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Еко и природа' }, image: 'https://picsum.photos/seed/bulgaria-rila/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Религиозен и поклоннически туризъм' }, image: 'https://picsum.photos/seed/bulgaria-monastery/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Спа и уелнес' }, image: 'https://picsum.photos/seed/bulgaria-vineyard/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Винено-кулинарен туризъм' }, image: 'https://picsum.photos/seed/bulgaria-rose/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Обекти на ЮНЕСКО' }, image: 'https://picsum.photos/seed/bulgaria-nessebar/320/214' },
        ],
      },
    },
  ],
} as unknown as Tab

// ── Activities data (2 categories, 4 items each → 2-column grid) ──
const activitiesTab = {
  label: 'Активности',
  enableDropdown: true,
  link: { type: 'custom' as const, url: '/activities' },
  navItems: [
    {

      listLinks: {
        tag: 'На открито',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'Каякинг и рафтинг' }, image: 'https://picsum.photos/seed/activity-kayak/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Планинско колоездене' }, image: 'https://picsum.photos/seed/activity-mtb/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Скално катерене' }, image: 'https://picsum.photos/seed/activity-climb/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Парапланеризъм' }, image: 'https://picsum.photos/seed/activity-paraglide/320/214' },
        ],
      },
    },
    {

      listLinks: {
        tag: 'Култура и забавления',
        links: [
          { link: { type: 'custom' as const, url: '#', label: 'Винени дегустации' }, image: 'https://picsum.photos/seed/activity-wine/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Готварски курсове' }, image: 'https://picsum.photos/seed/activity-cooking/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Арт работилници' }, image: 'https://picsum.photos/seed/activity-art/320/214' },
          { link: { type: 'custom' as const, url: '#', label: 'Фолклорни вечери' }, image: 'https://picsum.photos/seed/activity-folklore/320/214' },
        ],
      },
    },
  ],
} as unknown as Tab

const meta: Meta<typeof DestinationsOverlay> = {
  title: 'Header/DestinationsOverlay',
  component: DestinationsOverlay,
  parameters: { layout: 'fullscreen', ...figmaDesign('1335:9725') },
  args: { tab: mockTab, onClose: () => {} },
}

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { tab: mockTab, onClose: () => {} },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold">DestinationsOverlay – 6 categories (3-col grid)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sidebar shows categories (2nd level). Click a category to see its items as image cards
          (3rd level). Whole card is hoverable with scale effect.
        </p>
      </div>
      <div className="p-6">
        <DestinationsOverlay {...args} />
      </div>
    </div>
  ),
}

export const TwoColumnGrid: Story = {
  args: { tab: activitiesTab, onClose: () => {} },
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold">DestinationsOverlay – 2 categories (2-col grid)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fewer categories and 4 items per category – cards fill a 2-column grid layout.
        </p>
      </div>
      <div className="p-6">
        <DestinationsOverlay {...args} />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { tab: mockTab, onClose: () => {} },
}
