import { typesensePlugin } from './typesense'
import type { CollectionConfig, FieldConfig } from './typesense/types'
import { extractRichText } from './typesense/document-mapper'
import { LOCALE_CODES } from '@/i18n/localization'

// =============================================================================
// Shared field definitions for all experience collections
// =============================================================================

const sharedExperienceFields: Record<string, FieldConfig> = {
  slug: { type: 'string', facet: false },
  title: { type: 'string', facet: false, sort: true },
  description: { type: 'string', facet: false },
  descriptionShort: {
    type: 'string',
    facet: false,
    optional: true,
    transform: (_, doc) => {
      const desc = (doc as Record<string, unknown>)?.description
      const text = extractRichText(desc)
      if (!text || text.length <= 200) return text || ''
      const truncated = text.slice(0, 200)
      const lastSpace = truncated.lastIndexOf(' ')
      return (lastSpace > 160 ? truncated.slice(0, lastSpace) : truncated) + '…'
    },
  },
  // Discriminator field — value injected via staticFields per collection
  type: { type: 'string', facet: true },
  // City relationship - extract ID and name for faceted search
  'city.id': {
    type: 'string',
    facet: true,
    transform: (_, doc) => {
      const city = (doc as Record<string, unknown>)?.city as Record<string, unknown> | undefined
      return city?.id ? String(city.id) : ''
    },
  },
  'city.name': {
    type: 'string',
    facet: true,
    transform: (_, doc) => {
      const city = (doc as Record<string, unknown>)?.city as Record<string, unknown> | undefined
      return city?.name || ''
    },
  },
  // Municipality name via city relationship
  'municipality.name': {
    type: 'string',
    facet: true,
    optional: true,
    transform: (_, doc) => {
      const city = (doc as Record<string, unknown>)?.city as Record<string, unknown> | undefined
      const municipality = city?.municipality as Record<string, unknown> | undefined
      return municipality?.name || ''
    },
  },
  // Region name via city -> municipality -> region relationship
  'region.name': {
    type: 'string',
    facet: true,
    optional: true,
    transform: (_, doc) => {
      const city = (doc as Record<string, unknown>)?.city as Record<string, unknown> | undefined
      const municipality = city?.municipality as Record<string, unknown> | undefined
      const region = municipality?.region as Record<string, unknown> | undefined
      return region?.name || ''
    },
  },
  // Category titles - extract from relationship array
  'categories.title': {
    type: 'string[]',
    facet: true,
    optional: true,
    transform: (_, doc) => {
      const categories = (doc as Record<string, unknown>)?.categories as
        | Array<Record<string, unknown>>
        | undefined
      if (!Array.isArray(categories)) return []
      return categories
        .map((cat) => (typeof cat === 'object' ? cat?.title : null))
        .filter((t): t is string => typeof t === 'string')
    },
  },
  // Tag titles - extract from relationship array
  'tags.title': {
    type: 'string[]',
    facet: true,
    optional: true,
    transform: (_, doc) => {
      const tags = (doc as Record<string, unknown>)?.tags as
        | Array<Record<string, unknown>>
        | undefined
      if (!Array.isArray(tags)) return []
      return tags
        .map((tag) => (typeof tag === 'object' ? tag?.title : null))
        .filter((t): t is string => typeof t === 'string')
    },
  },
  'location.address': { type: 'string' },
  location: {
    type: 'geopoint',
    source: ['location.coordinates.latitude', 'location.coordinates.longitude'],
  },
  publishedAt: { type: 'int64', optional: true },
  'heroImage.url': {
    type: 'string',
    optional: true,
    transform: (_, doc) => {
      const heroImage = (doc as Record<string, unknown>)?.heroImage as Record<string, unknown> | undefined
      return heroImage?.sizes
        ? ((heroImage.sizes as Record<string, unknown>)?.thumbnail as Record<string, unknown>)?.url
        : heroImage?.url
    },
  },
  'heroImage.alt': {
    type: 'string',
    optional: true,
    transform: (_, doc) => {
      const heroImage = (doc as Record<string, unknown>)?.heroImage as Record<string, unknown> | undefined
      return heroImage?.alt
    },
  },
}

const sharedPopulate: CollectionConfig['populate'] = {
  heroImage: { collection: 'media', depth: 0 },
  city: { collection: 'cities', depth: 2 },
  categories: { collection: 'categories', depth: 0 },
  tags: { collection: 'tags', depth: 0 },
}

const sharedExclude = ['gallery', 'relatedExperiences']

// =============================================================================
// Helpers for extracting nomenclature relationship values
// =============================================================================

/** Extract `value` slugs from a populated hasMany nomenclature relationship */
function extractNomenclatureValues(fieldName: string): FieldConfig {
  return {
    type: 'string[]',
    facet: true,
    optional: true,
    transform: (_, doc) => {
      const items = (doc as Record<string, unknown>)?.[fieldName] as
        | Array<Record<string, unknown>>
        | undefined
      if (!Array.isArray(items)) return []
      return items
        .map((item) => (typeof item === 'object' && item ? item.value : item))
        .filter((v): v is string => typeof v === 'string')
    },
  }
}

/** Extract `value` slug from a populated single nomenclature relationship */
function extractNomenclatureValue(fieldName: string): FieldConfig {
  return {
    type: 'string',
    facet: true,
    optional: true,
    transform: (_, doc) => {
      const item = (doc as Record<string, unknown>)?.[fieldName] as Record<string, unknown> | undefined
      if (typeof item === 'object' && item) return item.value || ''
      return typeof item === 'string' ? item : ''
    },
  }
}

// =============================================================================
// Shared base config for all experience collections
// =============================================================================

function createExperienceConfig(
  type: string,
  extraFields: Record<string, FieldConfig> = {},
  extraPopulate: CollectionConfig['populate'] = {},
): CollectionConfig {
  return {
    locales: [...LOCALE_CODES],
    drafts: true,
    targetCollection: 'experiences',
    staticFields: { type },
    populate: {
      ...sharedPopulate,
      ...extraPopulate,
    },
    fields: {
      ...sharedExperienceFields,
      ...extraFields,
    },
    exclude: sharedExclude,
  }
}

// =============================================================================
// Plugin configuration
// =============================================================================

export const typesense = typesensePlugin({
  connection: {
    apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
    nodes: [
      {
        host: process.env.TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.TYPESENSE_PORT || '8108', 10),
        protocol: 'http',
      },
    ],
  },
  collections: {
    // ── Experience collections (all write to unified 'experiences' index) ──
    hotels: createExperienceConfig('hotel', {
      starRating: { type: 'int32', facet: true, optional: true },
      amenities: extractNomenclatureValues('amenities'),
      rooms: { type: 'int32', optional: true, sort: true },
      checkInTime: { type: 'string', optional: true },
      checkOutTime: { type: 'string', optional: true },
      bookingUrl: { type: 'string', optional: true },
    }, {
      amenities: { collection: 'amenities', depth: 0 },
    }),

    restaurants: createExperienceConfig('restaurant', {
      cuisineType: extractNomenclatureValues('cuisineType'),
      dietaryOptions: extractNomenclatureValues('dietaryOptions'),
      menuUrl: { type: 'string', optional: true },
      reservationUrl: { type: 'string', optional: true },
    }, {
      cuisineType: { collection: 'cuisine-types', depth: 0 },
      dietaryOptions: { collection: 'dietary-options', depth: 0 },
    }),

    activities: createExperienceConfig('activity', {
      difficultyLevel: extractNomenclatureValue('difficultyLevel'),
      seasonality: extractNomenclatureValues('seasonality'),
      duration: { type: 'string', optional: true },
      minimumAge: { type: 'int32', optional: true, facet: true },
      equipmentProvided: { type: 'bool', optional: true, facet: true },
      'groupSize.min': { type: 'int32', optional: true },
      'groupSize.max': { type: 'int32', optional: true },
    }, {
      difficultyLevel: { collection: 'difficulty-levels', depth: 0 },
      seasonality: { collection: 'seasons', depth: 0 },
    }),

    attractions: createExperienceConfig('attraction', {
      visitDuration: { type: 'int32', optional: true, sort: true },
      attractionHours: { type: 'string', optional: true },
    }),

    events: createExperienceConfig('event', {
      'period.startDate': { type: 'int64', optional: true, sort: true },
      'period.endDate': { type: 'int64', optional: true, sort: true },
      allDay: { type: 'bool', optional: true, facet: true },
      organizer: { type: 'string', optional: true, facet: true },
      registrationUrl: { type: 'string', optional: true },
    }),

    // ── Geography collections ──
    cities: {
      locales: [...LOCALE_CODES],
      populate: {
        municipality: { collection: 'municipalities', depth: 0 },
        heroImage: { collection: 'media', depth: 0 },
      },
      fields: {
        name: { type: 'string', facet: false, sort: true },
        ekatteCode: { type: 'string', facet: false, optional: true },
        population: { type: 'int32', facet: true, optional: true, sort: true },
        isCapital: { type: 'bool', facet: true, optional: true },
        'municipality.name': {
          type: 'string',
          facet: true,
          optional: true,
          transform: (_, doc) => {
            const municipality = (doc as Record<string, unknown>)?.municipality as Record<string, unknown> | undefined
            return municipality?.name || ''
          },
        },
        'heroImage.url': {
          type: 'string',
          optional: true,
          transform: (_, doc) => {
            const heroImage = (doc as Record<string, unknown>)?.heroImage as Record<string, unknown> | undefined
            return heroImage?.sizes
              ? ((heroImage.sizes as Record<string, unknown>)?.thumbnail as Record<string, unknown>)?.url
              : heroImage?.url
          },
        },
        coordinates: {
          type: 'geopoint',
          source: ['coordinates.latitude', 'coordinates.longitude'],
          optional: true,
        },
      },
    },
    municipalities: {
      locales: [...LOCALE_CODES],
      populate: {
        region: { collection: 'regions', depth: 0 },
      },
      fields: {
        name: { type: 'string', facet: false, sort: true },
        code: { type: 'string', facet: false, optional: true },
        ekatteCode: { type: 'string', facet: false, optional: true },
        'region.name': {
          type: 'string',
          facet: true,
          optional: true,
          transform: (_, doc) => {
            const region = (doc as Record<string, unknown>)?.region as Record<string, unknown> | undefined
            return region?.name || ''
          },
        },
      },
    },
    regions: {
      locales: [...LOCALE_CODES],
      fields: {
        name: { type: 'string', facet: false, sort: true },
        code: { type: 'string', facet: false, optional: true },
        ekatteCode: { type: 'string', facet: false, optional: true },
      },
    },
  },
})
