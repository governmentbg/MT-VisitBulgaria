export { Amenities } from './Amenities'
export { CuisineTypes } from './CuisineTypes'
export { DietaryOptions } from './DietaryOptions'
export { Seasons } from './Seasons'
export { DifficultyLevels } from './DifficultyLevels'
export { nomenclatureGroupLabel, nomenclatureLabels } from './labels'

/**
 * Shared shape for all populated nomenclature items (Amenity, Season, CuisineType, etc.).
 * Use this when you only need the common fields and don't care which specific type it is.
 */
export interface PopulatedNomenclature {
  id: number
  name: string
  value: string
  iconName?: string | null
  svgContent?: string | null
}

/** Extract the name from a populated nomenclature relationship (handles the `number | T` union). */
export function nomenclatureName(item: number | PopulatedNomenclature): string {
  return typeof item === 'object' ? item.name : String(item)
}

/** Extract names from a populated hasMany nomenclature relationship. */
export function nomenclatureNames(items: (number | PopulatedNomenclature)[] | null | undefined): string[] {
  if (!items) return []
  return items.map(nomenclatureName)
}
