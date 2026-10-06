import { createNomenclatureCollection } from './createNomenclatureCollection'
import { nomenclatureGroupLabel, nomenclatureLabels } from './labels'

export const Amenities = createNomenclatureCollection({
  slug: 'amenities',
  labels: nomenclatureLabels.amenities,
  adminGroup: nomenclatureGroupLabel,
})
