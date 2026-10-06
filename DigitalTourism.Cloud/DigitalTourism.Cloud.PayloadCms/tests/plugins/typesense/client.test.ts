/**
 * Unit tests for Typesense client wrapper
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initializeClient,
  getClient,
  isClientReady,
  resetClient,
} from '@/plugins/typesense/client'
import type { TypesenseConnection } from '@/plugins/typesense/types'

// Mock typesense module
vi.mock('typesense', () => ({
  default: {
    Client: vi.fn().mockImplementation((config) => ({
      config,
      health: {
        retrieve: vi.fn().mockResolvedValue({ ok: true }),
      },
      collections: vi.fn().mockReturnValue({
        retrieve: vi.fn(),
        delete: vi.fn(),
        create: vi.fn(),
      }),
    })),
  },
}))

const validConnection: TypesenseConnection = {
  apiKey: 'test-api-key',
  nodes: [{ host: 'localhost', port: 8108, protocol: 'http' }],
  connectionTimeoutSeconds: 10,
  numRetries: 5,
}

describe('Typesense Client', () => {
  beforeEach(() => {
    resetClient()
  })

  describe('initializeClient', () => {
    it('should store configuration without creating client', () => {
      initializeClient(validConnection)
      expect(isClientReady()).toBe(true)
    })
  })

  describe('getClient', () => {
    it('should throw if client not configured', () => {
      expect(() => getClient()).toThrow('Typesense client not configured')
    })

    it('should return client instance after initialization', () => {
      initializeClient(validConnection)
      const client = getClient()
      expect(client).toBeDefined()
    })

    it('should return same instance on subsequent calls (singleton)', () => {
      initializeClient(validConnection)
      const client1 = getClient()
      const client2 = getClient()
      expect(client1).toBe(client2)
    })
  })

  describe('isClientReady', () => {
    it('should return false before initialization', () => {
      expect(isClientReady()).toBe(false)
    })

    it('should return true after initialization', () => {
      initializeClient(validConnection)
      expect(isClientReady()).toBe(true)
    })

    it('should return false after reset', () => {
      initializeClient(validConnection)
      resetClient()
      expect(isClientReady()).toBe(false)
    })
  })

  describe('resetClient', () => {
    it('should clear client configuration', () => {
      initializeClient(validConnection)
      getClient() // Force client creation
      resetClient()
      expect(isClientReady()).toBe(false)
    })

    it('should allow reinitialization after reset', () => {
      initializeClient(validConnection)
      resetClient()
      initializeClient(validConnection)
      expect(isClientReady()).toBe(true)
    })
  })
})
