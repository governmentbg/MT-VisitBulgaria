/**
 * Unit tests for schema mapping (Payload → Typesense)
 */

import { describe, it, expect } from 'vitest'
import {
  mapFieldConfig,
  mapCollectionConfig,
  validateSchema,
} from '@/plugins/typesense/schema-mapper'
import type { FieldConfig, CollectionConfig, TypesenseFieldSchema } from '@/plugins/typesense/types'

describe('mapFieldConfig', () => {
  // T010: String field mapping
  describe('string field mapping', () => {
    it('should map string type correctly', () => {
      const config: FieldConfig = { type: 'string' }
      const result = mapFieldConfig('title', config)

      expect(result.name).toBe('title')
      expect(result.type).toBe('string')
    })

    it('should map string[] type correctly', () => {
      const config: FieldConfig = { type: 'string[]' }
      const result = mapFieldConfig('tags', config)

      expect(result.name).toBe('tags')
      expect(result.type).toBe('string[]')
    })

    it('should include infix option for string types', () => {
      const config: FieldConfig = { type: 'string', infix: true }
      const result = mapFieldConfig('title', config)

      expect(result.infix).toBe(true)
    })
  })

  // T011: Numeric field mapping
  describe('numeric field mapping', () => {
    it('should map int32 type correctly', () => {
      const config: FieldConfig = { type: 'int32' }
      const result = mapFieldConfig('count', config)

      expect(result.name).toBe('count')
      expect(result.type).toBe('int32')
    })

    it('should map int64 type correctly', () => {
      const config: FieldConfig = { type: 'int64' }
      const result = mapFieldConfig('timestamp', config)

      expect(result.name).toBe('timestamp')
      expect(result.type).toBe('int64')
    })

    it('should map float type correctly', () => {
      const config: FieldConfig = { type: 'float' }
      const result = mapFieldConfig('rating', config)

      expect(result.name).toBe('rating')
      expect(result.type).toBe('float')
    })

    it('should include range_index for numeric types', () => {
      const config: FieldConfig = { type: 'float', rangeIndex: true }
      const result = mapFieldConfig('rating', config)

      expect(result.range_index).toBe(true)
    })

    it('should map int32[] array type', () => {
      const config: FieldConfig = { type: 'int32[]' }
      const result = mapFieldConfig('scores', config)

      expect(result.type).toBe('int32[]')
    })
  })

  // T012: Geopoint field mapping
  describe('geopoint field mapping', () => {
    it('should map geopoint type correctly', () => {
      const config: FieldConfig = { type: 'geopoint' }
      const result = mapFieldConfig('location', config)

      expect(result.name).toBe('location')
      expect(result.type).toBe('geopoint')
    })

    it('should map geopoint with source fields', () => {
      const config: FieldConfig = {
        type: 'geopoint',
        source: ['coordinates.latitude', 'coordinates.longitude'],
      }
      const result = mapFieldConfig('location', config)

      expect(result.name).toBe('location')
      expect(result.type).toBe('geopoint')
    })

    it('should map geopoint[] array type', () => {
      const config: FieldConfig = { type: 'geopoint[]' }
      const result = mapFieldConfig('locations', config)

      expect(result.type).toBe('geopoint[]')
    })
  })

  // T013: Bool and array field mapping
  describe('bool and array field mapping', () => {
    it('should map bool type correctly', () => {
      const config: FieldConfig = { type: 'bool' }
      const result = mapFieldConfig('isActive', config)

      expect(result.name).toBe('isActive')
      expect(result.type).toBe('bool')
    })

    it('should map bool[] array type', () => {
      const config: FieldConfig = { type: 'bool[]' }
      const result = mapFieldConfig('flags', config)

      expect(result.type).toBe('bool[]')
    })

    it('should map float[] array type', () => {
      const config: FieldConfig = { type: 'float[]' }
      const result = mapFieldConfig('scores', config)

      expect(result.type).toBe('float[]')
    })
  })

  // T014: Facet, sort, rangeIndex options
  describe('field options', () => {
    it('should include facet option', () => {
      const config: FieldConfig = { type: 'string', facet: true }
      const result = mapFieldConfig('category', config)

      expect(result.facet).toBe(true)
    })

    it('should include sort option', () => {
      const config: FieldConfig = { type: 'float', sort: true }
      const result = mapFieldConfig('rating', config)

      expect(result.sort).toBe(true)
    })

    it('should include optional flag', () => {
      const config: FieldConfig = { type: 'string', optional: true }
      const result = mapFieldConfig('description', config)

      expect(result.optional).toBe(true)
    })

    it('should include locale option', () => {
      const config: FieldConfig = { type: 'string', locale: 'en' }
      const result = mapFieldConfig('title', config)

      expect(result.locale).toBe('en')
    })

    it('should not include undefined options', () => {
      const config: FieldConfig = { type: 'string' }
      const result = mapFieldConfig('title', config)

      expect(result.facet).toBeUndefined()
      expect(result.sort).toBeUndefined()
      expect(result.optional).toBeUndefined()
      expect(result.infix).toBeUndefined()
      expect(result.range_index).toBeUndefined()
    })

    it('should combine multiple options', () => {
      const config: FieldConfig = {
        type: 'float',
        facet: true,
        sort: true,
        optional: true,
        rangeIndex: true,
      }
      const result = mapFieldConfig('rating', config)

      expect(result.facet).toBe(true)
      expect(result.sort).toBe(true)
      expect(result.optional).toBe(true)
      expect(result.range_index).toBe(true)
    })
  })
})

describe('mapCollectionConfig', () => {
  it('should generate schema with collection name', () => {
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
      },
    }
    const result = mapCollectionConfig('experiences', config, 'en')

    expect(result.name).toBe('experiences_en')
  })

  it('should include all mapped fields', () => {
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
        rating: { type: 'float', facet: true },
        location: { type: 'geopoint' },
      },
    }
    const result = mapCollectionConfig('experiences', config, 'en')

    expect(result.fields).toHaveLength(4) // 3 fields + 'id'
    expect(result.fields.find((f) => f.name === 'title')).toBeDefined()
    expect(result.fields.find((f) => f.name === 'rating')).toBeDefined()
    expect(result.fields.find((f) => f.name === 'location')).toBeDefined()
  })

  it('should always include id field', () => {
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
      },
    }
    const result = mapCollectionConfig('experiences', config, 'en')

    const idField = result.fields.find((f) => f.name === 'id')
    expect(idField).toBeDefined()
    expect(idField?.type).toBe('string')
  })

  it('should include default_sorting_field', () => {
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
        rating: { type: 'float' },
      },
      defaultSortingField: 'rating',
    }
    const result = mapCollectionConfig('experiences', config, 'en')

    expect(result.default_sorting_field).toBe('rating')
  })

  it('should include token_separators', () => {
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
      },
      tokenSeparators: ['-', '_'],
    }
    const result = mapCollectionConfig('experiences', config, 'en')

    expect(result.token_separators).toEqual(['-', '_'])
  })

  it('should include symbols_to_index', () => {
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
      },
      symbolsToIndex: ['+', '#'],
    }
    const result = mapCollectionConfig('experiences', config, 'en')

    expect(result.symbols_to_index).toEqual(['+', '#'])
  })

  it('should apply locale to string fields when provided', () => {
    const config: CollectionConfig = {
      locales: ['bg'],
      fields: {
        title: { type: 'string' },
        count: { type: 'int32' },
      },
    }
    const result = mapCollectionConfig('experiences', config, 'bg')

    const titleField = result.fields.find((f) => f.name === 'title')
    const countField = result.fields.find((f) => f.name === 'count')

    expect(titleField?.locale).toBe('bg')
    expect(countField?.locale).toBeUndefined()
  })

  it('should not override field-specific locale', () => {
    const config: CollectionConfig = {
      locales: ['bg'],
      fields: {
        title: { type: 'string', locale: 'en' }, // Override with English
      },
    }
    const result = mapCollectionConfig('experiences', config, 'bg')

    const titleField = result.fields.find((f) => f.name === 'title')
    expect(titleField?.locale).toBe('en')
  })

  it('should exclude fields in exclude list', () => {
    const config: CollectionConfig = {
      locales: ['en'],
      fields: {
        title: { type: 'string' },
        image: { type: 'string' },
      },
      exclude: ['image'],
    }
    const result = mapCollectionConfig('experiences', config, 'en')

    expect(result.fields.find((f) => f.name === 'image')).toBeUndefined()
    expect(result.fields.find((f) => f.name === 'title')).toBeDefined()
  })
})

describe('validateSchema', () => {
  it('should return valid for correct schema', () => {
    const schema = {
      name: 'test_en',
      fields: [
        { name: 'id', type: 'string' as const },
        { name: 'title', type: 'string' as const },
      ],
    }
    const result = validateSchema(schema)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should detect missing id field', () => {
    const schema = {
      name: 'test_en',
      fields: [{ name: 'title', type: 'string' as const }],
    }
    const result = validateSchema(schema)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain("Schema must include 'id' field")
  })

  it('should detect empty fields array', () => {
    const schema = {
      name: 'test_en',
      fields: [] as TypesenseFieldSchema[],
    }
    const result = validateSchema(schema)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Schema must have at least one field')
  })

  it('should detect invalid default_sorting_field', () => {
    const schema = {
      name: 'test_en',
      fields: [
        { name: 'id', type: 'string' as const },
        { name: 'title', type: 'string' as const },
      ],
      default_sorting_field: 'nonexistent',
    }
    const result = validateSchema(schema)

    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('default_sorting_field'))).toBe(true)
  })
})
