import { createExperienceCollection } from './createExperienceCollection'
import { restaurantFields } from './fields/restaurantFields'
import { experienceCollectionLabels } from './constants'
import {
  createRevalidateExperienceHook,
  createRevalidateExperienceDeleteHook,
} from './hooks/revalidateExperience'

const collection = createExperienceCollection({
  slug: 'restaurants',
  labels: experienceCollectionLabels.restaurants,
  typeSpecificFields: restaurantFields,
})

collection.hooks = {
  ...collection.hooks,
  afterChange: [createRevalidateExperienceHook('restaurants')],
  afterDelete: [createRevalidateExperienceDeleteHook('restaurants')],
}

export const Restaurants = collection
