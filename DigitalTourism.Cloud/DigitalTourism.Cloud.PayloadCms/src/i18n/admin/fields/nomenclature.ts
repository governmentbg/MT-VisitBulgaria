import type { LocalizedLabel } from '../types'

/**
 * Nomenclature field labels
 * Used for reference data collections (amenities, cuisine types, etc.)
 */
export const nomenclatureLabels: Record<string, LocalizedLabel> = {
  name: { en: 'Name', bg: 'Име' },
  value: { en: 'Value', bg: 'Стойност' },
  iconName: { en: 'Icon (Lucide)', bg: 'Икона (Lucide)' },
  svgContent: { en: 'Custom SVG Icon', bg: 'Персонализирана SVG икона' },
  sortOrder: { en: 'Sort Order', bg: 'Ред на сортиране' },
}

/**
 * Nomenclature field descriptions
 */
export const nomenclatureDescriptions: Record<string, LocalizedLabel> = {
  value: {
    en: 'URL-safe identifier (e.g., "wifi", "parking"). Cannot be changed after creation.',
    bg: 'URL-безопасен идентификатор (напр. "wifi", "parking"). Не може да се променя след създаване.',
  },
  svgContent: {
    en: 'Custom SVG markup. Used when Icon Name is not set.',
    bg: 'Персонализиран SVG код. Използва се, когато Име на икона не е зададено.',
  },
}
