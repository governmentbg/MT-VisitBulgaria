import { createExperienceCollection } from './createExperienceCollection'
import { eventFields } from './fields/eventFields'
import { experienceCollectionLabels } from './constants'
import {
  createRevalidateExperienceHook,
  createRevalidateExperienceDeleteHook,
} from './hooks/revalidateExperience'

const collection = createExperienceCollection({
  slug: 'events',
  labels: experienceCollectionLabels.events,
  typeSpecificFields: eventFields,
})

collection.hooks = {
  ...collection.hooks,
  afterChange: [createRevalidateExperienceHook('events')],
  afterDelete: [createRevalidateExperienceDeleteHook('events')],
}

export const Events = collection
