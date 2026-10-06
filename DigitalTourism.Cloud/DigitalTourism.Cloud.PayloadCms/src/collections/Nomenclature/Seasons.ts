import { createNomenclatureCollection } from './createNomenclatureCollection'
import { nomenclatureGroupLabel, nomenclatureLabels } from './labels'

export const Seasons = createNomenclatureCollection({
  slug: 'seasons',
  labels: nomenclatureLabels.seasons,
  adminGroup: nomenclatureGroupLabel,
})
