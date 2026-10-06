import { createNomenclatureCollection } from './createNomenclatureCollection'
import { nomenclatureGroupLabel, nomenclatureLabels } from './labels'

export const CuisineTypes = createNomenclatureCollection({
  slug: 'cuisine-types',
  labels: nomenclatureLabels.cuisineTypes,
  adminGroup: nomenclatureGroupLabel,
})
