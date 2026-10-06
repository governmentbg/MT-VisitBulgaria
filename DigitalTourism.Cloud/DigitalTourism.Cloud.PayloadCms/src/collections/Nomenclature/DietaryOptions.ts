import { createNomenclatureCollection } from './createNomenclatureCollection'
import { nomenclatureGroupLabel, nomenclatureLabels } from './labels'

export const DietaryOptions = createNomenclatureCollection({
  slug: 'dietary-options',
  labels: nomenclatureLabels.dietaryOptions,
  adminGroup: nomenclatureGroupLabel,
})
