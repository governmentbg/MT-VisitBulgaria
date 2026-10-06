import { createNomenclatureCollection } from './createNomenclatureCollection'
import { nomenclatureGroupLabel, nomenclatureLabels } from './labels'

export const DifficultyLevels = createNomenclatureCollection({
  slug: 'difficulty-levels',
  labels: nomenclatureLabels.difficultyLevels,
  adminGroup: nomenclatureGroupLabel,
})
