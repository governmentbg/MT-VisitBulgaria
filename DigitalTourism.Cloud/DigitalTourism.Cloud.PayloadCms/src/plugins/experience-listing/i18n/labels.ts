import type { LocalizedLabel, LocalizedSelectOption } from '@/i18n/admin/types'

// ─── Block labels ───

export const blockLabels = {
  singular: { en: 'Experience Listing', bg: 'Листинг на преживявания' } satisfies LocalizedLabel,
  plural: { en: 'Experience Listings', bg: 'Листинги на преживявания' } satisfies LocalizedLabel,
}

// ─── Field labels ───

export const fieldLabels = {
  displayMode: { en: 'Display Mode', bg: 'Режим на показване' },
  heading: { en: 'Heading', bg: 'Заглавие' },
  description: { en: 'Description', bg: 'Описание' },
  sectionLabel: { en: 'Section Label', bg: 'Етикет на секция' },
  viewAllLink: { en: 'View All Link', bg: 'Линк "Виж всички"' },
  defaultType: { en: 'Default Experience Types', bg: 'Типове по подразбиране' },
  defaultCategories: { en: 'Default Categories', bg: 'Категории по подразбиране' },
  defaultTags: { en: 'Default Tags', bg: 'Етикети по подразбиране' },
  defaultRegion: { en: 'Default Regions', bg: 'Региони по подразбиране' },
  defaultMunicipality: { en: 'Default Municipalities', bg: 'Общини по подразбиране' },
  defaultCity: { en: 'Default Cities', bg: 'Градове по подразбиране' },
  itemsPerPage: { en: 'Items Per Page', bg: 'Елементи на страница' },
  gridColumns: { en: 'Grid Columns', bg: 'Колони' },
  defaultSort: { en: 'Default Sort', bg: 'Сортиране по подразбиране' },
  paginationMode: { en: 'Pagination Mode', bg: 'Режим на страници' },
  showAdvancedSearch: {
    en: 'Show "Advanced Search" Link',
    bg: 'Покажи линк "Разширено търсене"',
  },
  showSearchInput: { en: 'Show Search Input', bg: 'Покажи поле за търсене' },
  sectionVariant: { en: 'Section Style', bg: 'Стил на секцията' },
  showMonthFilter: { en: 'Show Month Filter', bg: 'Покажи филтър по месец' },
  decorationImage: { en: 'Decoration', bg: 'Декорация' },
  headerAlignment: { en: 'Alignment', bg: 'Подравняване' },
  decorationAlignment: { en: 'Decoration Alignment', bg: 'Подравняване на декорация' },
  backgroundShape: { en: 'Background Shape', bg: 'Форма на фона' },
  isFocused: { en: 'Focus Center Card', bg: 'Фокус върху централната карта' },
  overlayCardStyle: { en: 'Card Style', bg: 'Стил на картата' },
  overlayLayout: { en: 'Layout', bg: 'Оформление' },
} satisfies Record<string, LocalizedLabel>

// ─── Select options ───

export const sortOptions: LocalizedSelectOption[] = [
  { label: { en: 'Relevance', bg: 'Релевантност' }, value: 'relevance' },
  { label: { en: 'Title A-Z', bg: 'Заглавие А-Я' }, value: 'title_asc' },
  { label: { en: 'Title Z-A', bg: 'Заглавие Я-А' }, value: 'title_desc' },
  { label: { en: 'Newest First', bg: 'Най-нови' }, value: 'newest' },
]

export const paginationOptions: LocalizedSelectOption[] = [
  { label: { en: 'Numbers', bg: 'Номера' }, value: 'pagination' },
  { label: { en: 'Load More', bg: 'Зареди още' }, value: 'loadMore' },
]

export const displayModeOptions: LocalizedSelectOption[] = [
  { label: { en: 'Grid', bg: 'Мрежа' }, value: 'grid' },
  { label: { en: 'Carousel – Standard', bg: 'Карусел – Стандартен' }, value: 'carouselStandard' },
  { label: { en: 'Carousel – Overlay', bg: 'Карусел – С наслагване' }, value: 'carouselOverlay' },
  { label: { en: 'Carousel – Horizontal', bg: 'Карусел – Хоризонтален' }, value: 'carouselHorizontal' },
]

export const sectionVariantOptions: LocalizedSelectOption[] = [
  { label: { en: 'Dark (Green)', bg: 'Тъмен (Зелен)' }, value: 'dark' },
  { label: { en: 'Dark Alt', bg: 'Тъмен алт.' }, value: 'darkAlt' },
  { label: { en: 'Teal', bg: 'Тюркоазен' }, value: 'teal' },
  { label: { en: 'Light', bg: 'Светъл' }, value: 'light' },
]

export const headerAlignmentOptions: LocalizedSelectOption[] = [
  { label: { en: 'Left', bg: 'Ляво' }, value: 'left' },
  { label: { en: 'Center', bg: 'Център' }, value: 'center' },
  { label: { en: 'Right', bg: 'Дясно' }, value: 'right' },
]

export const overlayCardStyleOptions: LocalizedSelectOption[] = [
  { label: { en: 'Overlay', bg: 'С наслагване' }, value: 'overlay' },
  { label: { en: 'Standard', bg: 'Стандартна' }, value: 'standard' },
]

export const overlayLayoutOptions: LocalizedSelectOption[] = [
  { label: { en: 'Side by Side', bg: 'Една до друга' }, value: 'sideBySide' },
  { label: { en: 'Stacked', bg: 'Подредени' }, value: 'stacked' },
]

export const backgroundShapeOptions: LocalizedSelectOption[] = [
  { label: { en: 'Full Width', bg: 'Пълна ширина' }, value: 'full' },
  { label: { en: 'Cut Left', bg: 'Отрязан ляво' }, value: 'cutLeft' },
  { label: { en: 'Cut Right', bg: 'Отрязан дясно' }, value: 'cutRight' },
]

export const decorationAlignmentOptions: LocalizedSelectOption[] = [
  { label: { en: 'Left', bg: 'Ляво' }, value: 'left' },
  { label: { en: 'Right', bg: 'Дясно' }, value: 'right' },
]

export const decorationImageOptions: LocalizedSelectOption[] = [
  { label: { en: 'None', bg: 'Без' }, value: 'none' },
  { label: { en: 'Watermark', bg: 'Воден знак' }, value: 'watermark' },
  { label: { en: 'Horizontal Watermark', bg: 'Хоризонтален воден знак' }, value: 'horizontalWatermark' },
]

// Collapsible group labels
export const groupLabels = {
  sectionHeader: { en: 'Section Header', bg: 'Заглавна секция' },
  carouselStyle: { en: 'Carousel Style', bg: 'Стил на карусела' },
  defaultFilters: { en: 'Default Filters', bg: 'Филтри по подразбиране' },
  displaySettings: { en: 'Display Settings', bg: 'Настройки за показване' },
  featureToggles: { en: 'Feature Toggles', bg: 'Функции' },
  overlaySettings: { en: 'Overlay Settings', bg: 'Настройки за наслагване' },
  contentPreview: { en: 'Content & Preview', bg: 'Съдържание и преглед' },
}
