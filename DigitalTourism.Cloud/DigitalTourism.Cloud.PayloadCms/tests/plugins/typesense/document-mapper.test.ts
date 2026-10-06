/**
 * Unit tests for document transformation (Payload → Typesense)
 */

import { describe, it, expect } from 'vitest'
import {
  getNestedValue,
  extractRichText,
  mapDocumentField,
  mapDocument,
  validateDocument,
} from '@/plugins/typesense/document-mapper'
import type { CollectionConfig } from '@/plugins/typesense/types'

// T020: Basic field extraction
describe('getNestedValue', () => {
  it('should extract top-level field', () => {
    const doc = { title: 'Test Title' }
    expect(getNestedValue(doc, 'title')).toBe('Test Title')
  })

  it('should extract nested field with dot notation', () => {
    const doc = { location: { city: 'Sofia' } }
    expect(getNestedValue(doc, 'location.city')).toBe('Sofia')
  })

  it('should extract deeply nested field', () => {
    const doc = { location: { coordinates: { latitude: 42.6977 } } }
    expect(getNestedValue(doc, 'location.coordinates.latitude')).toBe(42.6977)
  })

  it('should return undefined for non-existent field', () => {
    const doc = { title: 'Test' }
    expect(getNestedValue(doc, 'description')).toBeUndefined()
  })

  it('should return undefined for non-existent nested field', () => {
    const doc = { location: { city: 'Sofia' } }
    expect(getNestedValue(doc, 'location.country')).toBeUndefined()
  })

  it('should handle null values', () => {
    const doc = { title: null }
    expect(getNestedValue(doc, 'title')).toBeNull()
  })

  it('should extract from arrays', () => {
    const doc = { tags: ['tag1', 'tag2'] }
    expect(getNestedValue(doc, 'tags')).toEqual(['tag1', 'tag2'])
  })
})

// T021: Nested field extraction (already covered in T020)

// T022: Geopoint value merging
describe('mapDocumentField - geopoint', () => {
  it('should merge lat/lng into geopoint array', () => {
    const doc = {
      location: {
        coordinates: { latitude: 42.6977, longitude: 23.3219 },
      },
    }
    const config = {
      type: 'geopoint' as const,
      source: [
        'location.coordinates.latitude',
        'location.coordinates.longitude',
      ] as [string, string],
    }
    const result = mapDocumentField(doc, 'location', config)

    expect(result).toEqual([42.6977, 23.3219])
  })

  it('should return null for incomplete geopoint', () => {
    const doc = {
      location: {
        coordinates: { latitude: 42.6977 },
      },
    }
    const config = {
      type: 'geopoint' as const,
      source: [
        'location.coordinates.latitude',
        'location.coordinates.longitude',
      ] as [string, string],
    }
    const result = mapDocumentField(doc, 'location', config)

    expect(result).toBeNull()
  })
})

// T023: Date to timestamp conversion
describe('mapDocumentField - dates', () => {
  it('should convert Date object to timestamp', () => {
    const date = new Date('2024-01-15T10:30:00.000Z')
    const doc = { publishedAt: date }
    const config = { type: 'int64' as const }

    const result = mapDocumentField(doc, 'publishedAt', config)

    expect(result).toBe(date.getTime())
  })

  it('should convert ISO date string to timestamp', () => {
    const doc = { publishedAt: '2024-01-15T10:30:00.000Z' }
    const config = { type: 'int64' as const }

    const result = mapDocumentField(doc, 'publishedAt', config)

    expect(result).toBe(new Date('2024-01-15T10:30:00.000Z').getTime())
  })
})

// T024: RichText extraction
describe('extractRichText', () => {
  it('should extract text from Lexical format', () => {
    const richText = {
      root: {
        children: [
          {
            children: [{ text: 'Hello ' }, { text: 'World', bold: true }],
          },
          {
            children: [{ text: 'Second paragraph' }],
          },
        ],
      },
    }

    const result = extractRichText(richText)
    expect(result).toContain('Hello')
    expect(result).toContain('World')
    expect(result).toContain('Second paragraph')
  })

  it('should return empty string for null/undefined', () => {
    expect(extractRichText(null)).toBe('')
    expect(extractRichText(undefined)).toBe('')
  })

  it('should handle plain string', () => {
    expect(extractRichText('Plain text')).toBe('Plain text')
  })

  it('should handle empty root', () => {
    const richText = { root: { children: [] } }
    expect(extractRichText(richText)).toBe('')
  })
})

// T025: Custom transform functions
describe('mapDocumentField - transform', () => {
  it('should apply custom transform function', () => {
    const doc = { price: 100 }
    const config = {
      type: 'string' as const,
      transform: (value: unknown) => `$${value}`,
    }

    const result = mapDocumentField(doc, 'price', config)
    expect(result).toBe('$100')
  })

  it('should pass document to transform function', () => {
    const doc = { firstName: 'John', lastName: 'Doe' }
    const config = {
      type: 'string' as const,
      transform: (_value: unknown, doc: unknown) => {
        const d = doc as { firstName: string; lastName: string }
        return `${d.firstName} ${d.lastName}`
      },
    }

    const result = mapDocumentField(doc, 'fullName', config)
    expect(result).toBe('John Doe')
  })
})

// mapDocument tests
describe('mapDocument', () => {
  const collectionConfig: CollectionConfig = {
    locales: ['en'],
    fields: {
      title: { type: 'string' },
      rating: { type: 'float' },
      isActive: { type: 'bool' },
      location: {
        type: 'geopoint',
        source: ['coords.lat', 'coords.lng'],
      },
    },
  }

  it('should map document with all fields', () => {
    const doc = {
      id: '123',
      title: 'Test Hotel',
      rating: 4.5,
      isActive: true,
      coords: { lat: 42.6977, lng: 23.3219 },
    }

    const result = mapDocument(doc, collectionConfig, 'en')

    expect(result.id).toBe('123')
    expect(result.title).toBe('Test Hotel')
    expect(result.rating).toBe(4.5)
    expect(result.isActive).toBe(true)
    expect(result.location).toEqual([42.6977, 23.3219])
  })

  it('should include id field from document', () => {
    const doc = { id: 'doc-456', title: 'Test' }
    const config: CollectionConfig = {
      locales: ['en'],
      fields: { title: { type: 'string' } },
    }

    const result = mapDocument(doc, config, 'en')
    expect(result.id).toBe('doc-456')
  })

  it('should handle missing optional fields', () => {
    const doc = { id: '123', title: 'Test' }
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
        description: { type: 'string', optional: true },
      },
    }

    const result = mapDocument(doc, config, 'en')
    expect(result.title).toBe('Test')
    expect(result.description).toBeUndefined()
  })

  it('should skip excluded fields', () => {
    const doc = { id: '123', title: 'Test', image: 'url' }
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
        image: { type: 'string' },
      },
      exclude: ['image'],
    }

    const result = mapDocument(doc, config, 'en')
    expect(result.title).toBe('Test')
    expect(result.image).toBeUndefined()
  })
})

// validateDocument tests
describe('validateDocument', () => {
  it('should return valid for document with id', () => {
    const doc = { id: '123', title: 'Test' }
    const result = validateDocument(doc)

    expect(result.valid).toBe(true)
  })

  it('should return invalid for document without id', () => {
    const doc = { title: 'Test' }
    const result = validateDocument(doc)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Document must have an id field')
  })

  it('should return invalid for non-string id', () => {
    const doc = { id: 123, title: 'Test' }
    const result = validateDocument(doc)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Document id must be a string')
  })
})
