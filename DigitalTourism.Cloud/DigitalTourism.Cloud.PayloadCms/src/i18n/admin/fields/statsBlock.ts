import type { LocalizedLabel } from '../types'

export const statsBlockLabels: Record<string, LocalizedLabel> = {
  singular: { en: 'Stats', bg: 'Статистики' },
  plural: { en: 'Stats', bg: 'Статистики' },
  displayMode: { en: 'Display Mode', bg: 'Режим на показване' },
  modePanel: { en: 'Panel (Image + Card)', bg: 'Панел (Изображение + Карта)' },
  modeGrid: { en: 'Grid', bg: 'Решетка' },
  modeCounters: { en: 'Animated Counters', bg: 'Анимирани броячи' },
  modeInline: { en: 'Inline Strip', bg: 'Хоризонтална лента' },
  heading: { en: 'Heading', bg: 'Заглавие' },
  image: { en: 'Background Image', bg: 'Фоново изображение' },
  cardColor: { en: 'Card / Background Color', bg: 'Цвят на картата / фон' },
  columns: { en: 'Columns', bg: 'Колони' },
  items: { en: 'Statistics', bg: 'Статистики' },
  value: { en: 'Value', bg: 'Стойност' },
  label: { en: 'Label', bg: 'Етикет' },
  icon: { en: 'Icon', bg: 'Икона' },
}

export const statsBlockDescriptions: Record<string, LocalizedLabel> = {
  image: {
    en: 'Large image displayed beside the stats card (Panel mode only)',
    bg: 'Голямо изображение, показано до картата със статистики (само за панелен режим)',
  },
  value: {
    en: 'The statistic number, e.g. "60,000+" or "8.3 млн"',
    bg: 'Числова стойност, напр. "60 000+" или "8.3 млн"',
  },
  label: {
    en: 'Short description, e.g. "места за настаняване"',
    bg: 'Кратко описание, напр. "места за настаняване"',
  },
  icon: {
    en: 'Optional icon (used primarily in Counters mode)',
    bg: 'Икона по избор (използва се основно в режим Броячи)',
  },
}
