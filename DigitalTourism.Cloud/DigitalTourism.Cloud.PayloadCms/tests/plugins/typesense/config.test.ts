/**
 * Unit tests for configuration validation
 */

import { describe, it, expect } from 'vitest'
import { validateConfig, ConfigValidationError, getDefaultSettings } from '@/plugins/typesense/config'
import type { TypesenseFieldType, TypesensePluginConfig } from '@/plugins/typesense/types'

const validConfig: TypesensePluginConfig = {
  connection: {
    apiKey: 'test-api-key',
    nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
  },
  collections: {
    experiences: {
      locales: ['en', 'bg'],
      fields: {
        title: { type: 'string' },
        rating: { type: 'float', facet: true },
      },
    },
  },
}

describe('validateConfig', () => {
  it('should accept valid configuration', () => {
    expect(() => validateConfig(validConfig)).not.toThrow()
  })

  it('should reject null configuration', () => {
    expect(() => validateConfig(null as unknown as TypesensePluginConfig)).toThrow(
      ConfigValidationError
    )
  })

  describe('connection validation', () => {
    it('should require API key', () => {
      const config = {
        ...validConfig,
        connection: { ...validConfig.connection, apiKey: '' },
      }
      expect(() => validateConfig(config)).toThrow('API key must be a non-empty string')
    })

    it('should require at least one node', () => {
      const config = {
        ...validConfig,
        connection: { ...validConfig.connection, nodes: [] },
      }
      expect(() => validateConfig(config)).toThrow('At least one node must be configured')
    })

    it('should validate node host', () => {
      const config = {
        ...validConfig,
        connection: {
          ...validConfig.connection,
          nodes: [{ host: '', port: 8108, protocol: 'http' as const }],
        },
      }
      expect(() => validateConfig(config)).toThrow('Host must be a non-empty string')
    })

    it('should validate node port range', () => {
      const config = {
        ...validConfig,
        connection: {
          ...validConfig.connection,
          nodes: [{ host: 'localhost', port: 99999, protocol: 'http' as const }],
        },
      }
      expect(() => validateConfig(config)).toThrow('Port must be a valid port number')
    })

    it('should validate node protocol', () => {
      const config = {
        ...validConfig,
        connection: {
          ...validConfig.connection,
          nodes: [{ host: 'localhost', port: 8108, protocol: 'ftp' as 'http' }],
        },
      }
      expect(() => validateConfig(config)).toThrow("Protocol must be 'http' or 'https'")
    })
  })

  describe('collection validation', () => {
    it('should require at least one collection', () => {
      const config = {
        ...validConfig,
        collections: {},
      }
      expect(() => validateConfig(config)).toThrow('At least one collection must be configured')
    })

    it('should require locales for each collection', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            ...validConfig.collections.experiences,
            locales: [],
          },
        },
      }
      expect(() => validateConfig(config)).toThrow('At least one locale must be configured')
    })

    it('should require fields for each collection', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            ...validConfig.collections.experiences,
            fields: {},
          },
        },
      }
      expect(() => validateConfig(config)).toThrow('At least one field must be configured')
    })

    it('should validate defaultSortingField exists', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            ...validConfig.collections.experiences,
            defaultSortingField: 'nonexistent',
          },
        },
      }
      expect(() => validateConfig(config)).toThrow(
        "Default sorting field 'nonexistent' is not defined in fields"
      )
    })

    it('should validate defaultSortingField is numeric', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            ...validConfig.collections.experiences,
            defaultSortingField: 'title',
          },
        },
      }
      expect(() => validateConfig(config)).toThrow(
        'Default sorting field must be int32, int64, or float'
      )
    })
  })

  describe('field validation', () => {
    it('should validate field type', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            locales: ['en'],
            fields: {
              title: { type: 'invalid' as 'string' },
            },
          },
        },
      }
      expect(() => validateConfig(config)).toThrow("Invalid field type 'invalid'")
    })

    it('should reject field names with spaces', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            locales: ['en'],
            fields: {
              'field name': { type: 'string' as const },
            },
          },
        },
      }
      expect(() => validateConfig(config)).toThrow('Field name must not contain spaces')
    })

    it('should validate geopoint source has exactly 2 paths', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            locales: ['en'],
            fields: {
              location: { type: 'geopoint' as const, source: ['lat'] as unknown as [string, string] },
            },
          },
        },
      }
      expect(() => validateConfig(config)).toThrow(
        'Geopoint source must be an array of exactly 2 field paths'
      )
    })

    it('should only allow rangeIndex on numeric types', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            locales: ['en'],
            fields: {
              title: { type: 'string' as const, rangeIndex: true },
            },
          },
        },
      }
      expect(() => validateConfig(config)).toThrow(
        'rangeIndex can only be used with numeric types'
      )
    })

    it('should only allow infix on string types', () => {
      const config = {
        ...validConfig,
        collections: {
          experiences: {
            locales: ['en'],
            fields: {
              rating: { type: 'float' as const, infix: true },
            },
          },
        },
      }
      expect(() => validateConfig(config)).toThrow('infix can only be used with string types')
    })
  })
})

describe('getDefaultSettings', () => {
  it('should return defaults when no settings provided', () => {
    const settings = getDefaultSettings()
    expect(settings.logLevel).toBe('warn')
    expect(settings.retryOnError).toBe(true)
    expect(settings.maxRetries).toBe(3)
    expect(settings.batchSize).toBe(1000)
  })

  it('should merge provided settings with defaults', () => {
    const settings = getDefaultSettings({ logLevel: 'debug', batchSize: 500 })
    expect(settings.logLevel).toBe('debug')
    expect(settings.retryOnError).toBe(true)
    expect(settings.maxRetries).toBe(3)
    expect(settings.batchSize).toBe(500)
  })
})
