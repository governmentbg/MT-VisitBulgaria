import { createExperienceCollection } from './createExperienceCollection'
import { attractionFields } from './fields/attractionFields'
import { experienceCollectionLabels } from './constants'
import {
  createRevalidateExperienceHook,
  createRevalidateExperienceDeleteHook,
} from './hooks/revalidateExperience'

const collection = createExperienceCollection({
  slug: 'attractions',
  labels: experienceCollectionLabels.attractions,
  typeSpecificFields: attractionFields,
})

collection.hooks = {
  ...collection.hooks,
  afterChange: [createRevalidateExperienceHook('attractions')],
  afterDelete: [createRevalidateExperienceDeleteHook('attractions')],
}

export const Attractions = collection
