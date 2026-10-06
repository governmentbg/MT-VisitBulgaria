import { createExperienceCollection } from './createExperienceCollection'
import { activityFields } from './fields/activityFields'
import { experienceCollectionLabels } from './constants'
import {
  createRevalidateExperienceHook,
  createRevalidateExperienceDeleteHook,
} from './hooks/revalidateExperience'

const collection = createExperienceCollection({
  slug: 'activities',
  labels: experienceCollectionLabels.activities,
  typeSpecificFields: activityFields,
})

collection.hooks = {
  ...collection.hooks,
  afterChange: [createRevalidateExperienceHook('activities')],
  afterDelete: [createRevalidateExperienceDeleteHook('activities')],
}

export const Activities = collection
