import type { CollectionBeforeDeleteHook } from 'payload'

/**
 * Prevent deletion of municipalities that have cities
 */
export const preventDeleteWithCities: CollectionBeforeDeleteHook = async ({ req, id }) => {
  const { payload } = req

  // Check if there are any cities in this municipality
  const cities = await payload.find({
    collection: 'cities',
    where: {
      municipality: {
        equals: id,
      },
    },
    limit: 1,
  })

  if (cities.docs.length > 0) {
    throw new Error(
      `Cannot delete municipality because it has ${cities.totalDocs} city/cities. Please delete or reassign the cities first.`,
    )
  }
}
