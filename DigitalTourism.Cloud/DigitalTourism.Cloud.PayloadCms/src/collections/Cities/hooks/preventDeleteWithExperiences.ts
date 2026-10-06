import type { CollectionBeforeDeleteHook } from 'payload'
import { EXPERIENCE_SLUGS } from '@/collections/Experiences/constants'

/**
 * Prevent deletion of cities that have experiences in any experience collection
 */
export const preventDeleteWithExperiences: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const { payload } = req

  // Check all experience collections for references to this city
  for (const slug of EXPERIENCE_SLUGS) {
    const result = await payload.find({
      collection: slug,
      where: {
        city: {
          equals: id,
        },
      },
      limit: 0,
    })

    if (result.totalDocs > 0) {
      throw new Error(
        `Cannot delete city because it has ${result.totalDocs} experience(s) in ${slug}. Please delete or reassign the experiences first.`,
      )
    }
  }
}
