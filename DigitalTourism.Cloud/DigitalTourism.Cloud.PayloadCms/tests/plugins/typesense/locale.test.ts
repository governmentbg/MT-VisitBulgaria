/**
 * Tests for locale management (T032-T034)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getCollectionName,
  extractLocalizedValues,
  getCollectionSchema,
} from '../../../src/plugins/typesense/locale'
import type { CollectionConfig } from '../../../src/plugins/typesense/types'

// T032: Test for locale collection naming
describe('getCollectionName', () => {
  it('should append locale suffix to collection name', () => {
    expect(getCollectionName('experiences', 'en')).toBe('experiences_en')
    expect(getCollectionName('experiences', 'bg')).toBe('experiences_bg')
  })

  it('should handle different collection names', () => {
    expect(getCollectionName('destinations', 'en')).toBe('destinations_en')
    expect(getCollectionName('hotels', 'de')).toBe('hotels_de')
  })

  it('should handle empty locale gracefully', () => {
    expect(getCollectionName('experiences', '')).toBe('experiences_')
  })

  it('should preserve collection name case', () => {
    expect(getCollectionName('MyCollection', 'EN')).toBe('MyCollection_EN')
  })
})

// T033: Test for extracting localized field values
describe('extractLocalizedValues', () => {
  it('should extract values for specific locale from localized fields', () => {
    const doc = {
      id: '123',
      title: { en: 'English Title', bg: 'Bulgarian Title' },
      description: { en: 'English Desc', bg: 'Bulgarian Desc' },
      rating: 4.5, // Non-localized field
    }

    const result = extractLocalizedValues(doc, 'en', ['title', 'description'])
    expect(result).toEqual({
      id: '123',
      title: 'English Title',
      description: 'English Desc',
      rating: 4.5,
    })
  })

  it('should extract Bulgarian locale values', () => {
    const doc = {
      id: '456',
      title: { en: 'English', bg: 'Bulgarian' },
      name: 'Non-localized',
    }

    const result = extractLocalizedValues(doc, 'bg', ['title'])
    expect(result).toEqual({
      id: '456',
      title: 'Bulgarian',
      name: 'Non-localized',
    })
  })

  it('should handle missing locale in field', () => {
    const doc = {
      id: '789',
      title: { en: 'English Only' },
    }

    const result = extractLocalizedValues(doc, 'bg', ['title'])
    expect(result).toEqual({
      id: '789',
      title: undefined,
    })
  })

  it('should handle non-localized document (no locale object)', () => {
    const doc = {
      id: '101',
      title: 'Plain Title',
      rating: 5,
    }

    const result = extractLocalizedValues(doc, 'en', ['title'])
    expect(result).toEqual({
      id: '101',
      title: 'Plain Title',
      rating: 5,
    })
  })

  it('should handle null and undefined values', () => {
    const doc = {
      id: '102',
      title: null,
      description: undefined,
    }

    const result = extractLocalizedValues(doc, 'en', ['title', 'description'])
    expect(result).toEqual({
      id: '102',
      title: null,
      description: undefined,
    })
  })

  it('should handle nested localized fields', () => {
    const doc = {
      id: '103',
      content: {
        title: { en: 'Nested English', bg: 'Nested Bulgarian' },
      },
    }

    const result = extractLocalizedValues(doc, 'en', ['content.title'])
    expect(result.content).toEqual({
      title: 'Nested English',
    })
  })

  it('should preserve array values', () => {
    const doc = {
      id: '104',
      tags: ['tag1', 'tag2'],
      categories: { en: ['cat1', 'cat2'], bg: ['bg-cat1'] },
    }

    const result = extractLocalizedValues(doc, 'en', ['categories'])
    expect(result).toEqual({
      id: '104',
      tags: ['tag1', 'tag2'],
      categories: ['cat1', 'cat2'],
    })
  })
})

// T034: Test for collection creation per locale (schema generation)
describe('getCollectionSchema', () => {
  const baseConfig: CollectionConfig = {
    locales: ['en', 'bg'],
    fields: {
      title: { type: 'string', facet: false },
      rating: { type: 'float', facet: true },
      type: { type: 'string', facet: true },
    },
  }

  it('should generate schema with locale-suffixed name', () => {
    const schema = getCollectionSchema('experiences', baseConfig, 'en')
    expect(schema.name).toBe('experiences_en')
  })

  it('should apply locale to string fields', () => {
    const schema = getCollectionSchema('experiences', baseConfig, 'en')

    const titleField = schema.fields.find((f) => f.name === 'title')
    expect(titleField?.locale).toBe('en')

    const typeField = schema.fields.find((f) => f.name === 'type')
    expect(typeField?.locale).toBe('en')
  })

  it('should not apply locale to non-string fields', () => {
    const schema = getCollectionSchema('experiences', baseConfig, 'en')

    const ratingField = schema.fields.find((f) => f.name === 'rating')
    expect(ratingField?.locale).toBeUndefined()
  })

  it('should generate different schemas for different locales', () => {
    const enSchema = getCollectionSchema('experiences', baseConfig, 'en')
    const bgSchema = getCollectionSchema('experiences', baseConfig, 'bg')

    expect(enSchema.name).toBe('experiences_en')
    expect(bgSchema.name).toBe('experiences_bg')

    const enTitle = enSchema.fields.find((f) => f.name === 'title')
    const bgTitle = bgSchema.fields.find((f) => f.name === 'title')

    expect(enTitle?.locale).toBe('en')
    expect(bgTitle?.locale).toBe('bg')
  })

  it('should include all field properties in schema', () => {
    const schema = getCollectionSchema('experiences', baseConfig, 'en')

    const ratingField = schema.fields.find((f) => f.name === 'rating')
    expect(ratingField?.name).toBe('rating')
    expect(ratingField?.type).toBe('float')
    expect(ratingField?.facet).toBe(true)
  })

  it('should include default sorting field when specified', () => {
    const configWithSort: CollectionConfig = {
      ...baseConfig,
      defaultSortingField: 'rating',
    }

    const schema = getCollectionSchema('experiences', configWithSort, 'en')
    expect(schema.default_sorting_field).toBe('rating')
  })

  it('should include token separators when specified', () => {
    const configWithTokens: CollectionConfig = {
      ...baseConfig,
      tokenSeparators: ['-', '_'],
    }

    const schema = getCollectionSchema('experiences', configWithTokens, 'en')
    expect(schema.token_separators).toEqual(['-', '_'])
  })

  it('should include symbols to index when specified', () => {
    const configWithSymbols: CollectionConfig = {
      ...baseConfig,
      symbolsToIndex: ['+', '#'],
    }

    const schema = getCollectionSchema('experiences', configWithSymbols, 'en')
    expect(schema.symbols_to_index).toEqual(['+', '#'])
  })

  it('should handle geopoint fields correctly', () => {
    const configWithGeo: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
        location: {
          type: 'geopoint',
          source: ['coordinates.lat', 'coordinates.lng'],
        },
      },
    }

    const schema = getCollectionSchema('places', configWithGeo, 'en')

    const locationField = schema.fields.find((f) => f.name === 'location')
    expect(locationField?.type).toBe('geopoint')
    expect(locationField?.locale).toBeUndefined() // geopoint shouldn't have locale
  })

  it('should exclude specified fields from schema', () => {
    const configWithExclude: CollectionConfig = {
      ...baseConfig,
      exclude: ['rating'],
    }

    const schema = getCollectionSchema('experiences', configWithExclude, 'en')

    const ratingField = schema.fields.find((f) => f.name === 'rating')
    expect(ratingField).toBeUndefined()
  })
})

// Additional locale utility tests
describe('locale utilities', () => {
  it('should handle all supported locales', () => {
    const supportedLocales = ['en', 'bg', 'de', 'fr', 'es', 'it']

    supportedLocales.forEach((locale) => {
      const name = getCollectionName('test', locale)
      expect(name).toBe(`test_${locale}`)
    })
  })
})
