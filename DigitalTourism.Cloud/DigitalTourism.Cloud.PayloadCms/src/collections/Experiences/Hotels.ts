import { createExperienceCollection } from './createExperienceCollection'
import { hotelFields } from './fields/hotelFields'
import { experienceCollectionLabels } from './constants'
import {
  createRevalidateExperienceHook,
  createRevalidateExperienceDeleteHook,
} from './hooks/revalidateExperience'

const collection = createExperienceCollection({
  slug: 'hotels',
  labels: experienceCollectionLabels.hotels,
  typeSpecificFields: hotelFields,
})

collection.hooks = {
  ...collection.hooks,
  afterChange: [createRevalidateExperienceHook('hotels')],
  afterDelete: [createRevalidateExperienceDeleteHook('hotels')],
}

export const Hotels = collection
