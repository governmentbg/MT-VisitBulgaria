import type { CollectionLabels, LocalizedLabel } from '@/i18n/admin/types'

/**
 * Admin group label for all nomenclature collections
 */
export const nomenclatureGroupLabel: LocalizedLabel = {
  en: 'Taxonomy',
  bg: 'Таксономия',
}

/**
 * Collection labels for nomenclature collections
 */
export const nomenclatureLabels: Record<string, CollectionLabels> = {
  amenities: {
    singular: { en: 'Amenity', bg: 'Удобство' },
    plural: { en: 'Amenities', bg: 'Удобства' },
  },
  cuisineTypes: {
    singular: { en: 'Cuisine Type', bg: 'Вид кухня' },
    plural: { en: 'Cuisine Types', bg: 'Видове кухня' },
  },
  dietaryOptions: {
    singular: { en: 'Dietary Option', bg: 'Диетична опция' },
    plural: { en: 'Dietary Options', bg: 'Диетични опции' },
  },
  seasons: {
    singular: { en: 'Season', bg: 'Сезон' },
    plural: { en: 'Seasons', bg: 'Сезони' },
  },
  difficultyLevels: {
    singular: { en: 'Difficulty Level', bg: 'Ниво на трудност' },
    plural: { en: 'Difficulty Levels', bg: 'Нива на трудност' },
  },
}
