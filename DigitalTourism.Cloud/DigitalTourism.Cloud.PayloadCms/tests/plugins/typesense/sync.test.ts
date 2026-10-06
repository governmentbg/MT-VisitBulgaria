/**
 * Tests for bulk sync operations (T049-T051)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchAllDocuments,
  batchImport,
  bulkSync,
} from '../../../src/plugins/typesense/sync'
import * as client from '../../../src/plugins/typesense/client'
import * as locale from '../../../src/plugins/typesense/locale'
import * as hooks from '../../../src/plugins/typesense/hooks'
import type { CollectionConfig } from '../../../src/plugins/typesense/types'

// Mock the client module
vi.mock('../../../src/plugins/typesense/client', () => ({
  getClient: vi.fn(),
}))

// Mock locale module for ensureCollection
vi.mock('../../../src/plugins/typesense/locale', () => ({
  getCollectionName: vi.fn((slug, loc) => `${slug}_${loc}`),
  ensureCollection: vi.fn().mockResolvedValue({ created: false, name: 'test' }),
  deleteCollection: vi.fn().mockResolvedValue(undefined),
}))

// Mock populateRelationships from hooks
vi.mock('../../../src/plugins/typesense/hooks', () => ({
  populateRelationships: vi.fn(async (_payload, doc) => doc),
}))

// Mock Typesense client
const mockImport = vi.fn()
const mockDocuments = vi.fn(() => ({
  import: mockImport,
}))
const mockDelete = vi.fn()
const mockCollection = vi.fn(() => ({
  documents: mockDocuments,
  delete: mockDelete,
}))
const mockClient = {
  collections: mockCollection,
}

const testConfig: CollectionConfig = {
  locales: ['en', 'bg'],
  fields: {
    title: { type: 'string', facet: false },
    rating: { type: 'float', facet: true },
  },
}

const testConfigWithDrafts: CollectionConfig = {
  ...testConfig,
  drafts: true,
}

// Mock Payload instance
const mockPayload = {
  find: vi.fn(),
  findByID: vi.fn(),
}

describe('fetchAllDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // T049: Test for bulk sync pagination
  it('should fetch documents with pagination', async () => {
    // First page returns 100 docs, second page returns 50
    mockPayload.find
      .mockResolvedValueOnce({
        docs: Array(100).fill({ id: 'doc', title: { en: 'Test' } }),
        hasNextPage: true,
        nextPage: 2,
      })
      .mockResolvedValueOnce({
        docs: Array(50).fill({ id: 'doc', title: { en: 'Test' } }),
        hasNextPage: false,
        nextPage: null,
      })

    const docs = await fetchAllDocuments(mockPayload as any, 'experiences', 100)

    expect(mockPayload.find).toHaveBeenCalledTimes(2)
    expect(mockPayload.find).toHaveBeenNthCalledWith(1, {
      collection: 'experiences',
      limit: 100,
      page: 1,
      depth: 0,
    })
    expect(mockPayload.find).toHaveBeenNthCalledWith(2, {
      collection: 'experiences',
      limit: 100,
      page: 2,
      depth: 0,
    })
    expect(docs).toHaveLength(150)
  })

  it('should handle single page of results', async () => {
    mockPayload.find.mockResolvedValueOnce({
      docs: [{ id: '1' }, { id: '2' }],
      hasNextPage: false,
      nextPage: null,
    })

    const docs = await fetchAllDocuments(mockPayload as any, 'experiences', 100)

    expect(mockPayload.find).toHaveBeenCalledTimes(1)
    expect(docs).toHaveLength(2)
  })

  it('should handle empty collection', async () => {
    mockPayload.find.mockResolvedValueOnce({
      docs: [],
      hasNextPage: false,
      nextPage: null,
    })

    const docs = await fetchAllDocuments(mockPayload as any, 'experiences', 100)

    expect(docs).toHaveLength(0)
  })

  it('should use custom batch size', async () => {
    mockPayload.find.mockResolvedValueOnce({
      docs: [],
      hasNextPage: false,
      nextPage: null,
    })

    await fetchAllDocuments(mockPayload as any, 'experiences', 500)

    expect(mockPayload.find).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 500 })
    )
  })

  it('should pass through fetch options (depth, where, locale)', async () => {
    mockPayload.find.mockResolvedValueOnce({
      docs: [],
      hasNextPage: false,
      nextPage: null,
    })

    await fetchAllDocuments(mockPayload as any, 'experiences', 100, {
      depth: 0,
      where: { _status: { equals: 'published' } },
      locale: 'en',
    })

    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'experiences',
      limit: 100,
      page: 1,
      depth: 0,
      where: { _status: { equals: 'published' } },
      locale: 'en',
    })
  })

  it('should use default depth 0 when no options provided', async () => {
    mockPayload.find.mockResolvedValueOnce({
      docs: [],
      hasNextPage: false,
      nextPage: null,
    })

    await fetchAllDocuments(mockPayload as any, 'experiences', 100)

    expect(mockPayload.find).toHaveBeenCalledWith(
      expect.objectContaining({ depth: 0 })
    )
  })
})

describe('batchImport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  it('should import documents using Typesense batch API', async () => {
    const docs = [
      { id: '1', title: 'Test 1' },
      { id: '2', title: 'Test 2' },
    ]

    mockImport.mockResolvedValueOnce([
      { success: true },
      { success: true },
    ])

    const result = await batchImport('experiences_en', docs)

    expect(mockCollection).toHaveBeenCalledWith('experiences_en')
    expect(mockImport).toHaveBeenCalledWith(docs, { action: 'upsert' })
    expect(result.success).toBe(true)
    expect(result.imported).toBe(2)
    expect(result.failed).toBe(0)
  })

  it('should handle import failures', async () => {
    const docs = [{ id: '1', title: 'Test' }]

    mockImport.mockResolvedValueOnce([
      { success: false, error: 'Invalid field' },
    ])

    const result = await batchImport('experiences_en', docs)

    expect(result.success).toBe(false)
    expect(result.imported).toBe(0)
    expect(result.failed).toBe(1)
    expect(result.errors).toHaveLength(1)
  })

  it('should handle partial failures', async () => {
    const docs = [
      { id: '1', title: 'Test 1' },
      { id: '2', title: 'Test 2' },
      { id: '3', title: 'Test 3' },
    ]

    mockImport.mockResolvedValueOnce([
      { success: true },
      { success: false, error: 'Error' },
      { success: true },
    ])

    const result = await batchImport('experiences_en', docs)

    expect(result.success).toBe(false)
    expect(result.imported).toBe(2)
    expect(result.failed).toBe(1)
  })
})

describe('bulkSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
    vi.mocked(locale.ensureCollection).mockResolvedValue({
      created: false,
      name: 'test',
    })
  })

  // T050: Test for progress callback reporting
  it('should call progress callback during sync', async () => {
    const progressCallback = vi.fn()

    mockPayload.find.mockResolvedValue({
      docs: [
        { id: '1', title: 'Test' },
        { id: '2', title: 'Test 2' },
      ],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }, { success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfig, {
      onProgress: progressCallback,
    })

    expect(progressCallback).toHaveBeenCalled()
    // Should report progress for each locale
    expect(progressCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: expect.any(String),
        total: expect.any(Number),
        processed: expect.any(Number),
      })
    )
  })

  it('should sync to all configured locales', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfig)

    // Should import to both en and bg collections
    expect(mockCollection).toHaveBeenCalledWith('experiences_en')
    expect(mockCollection).toHaveBeenCalledWith('experiences_bg')
  })

  it('should fetch per-locale with locale parameter', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfig)

    // Should have fetched twice (once per locale)
    expect(mockPayload.find).toHaveBeenCalledTimes(2)
    expect(mockPayload.find).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'en' })
    )
    expect(mockPayload.find).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'bg' })
    )
  })

  it('should filter by _status for draft-enabled collections', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test', _status: 'published' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfigWithDrafts)

    // Should include _status filter in the query
    expect(mockPayload.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { _status: { equals: 'published' } },
      })
    )
  })

  it('should NOT filter by _status for non-draft collections', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfig)

    // Should NOT include where filter
    expect(mockPayload.find).toHaveBeenCalledWith(
      expect.not.objectContaining({
        where: expect.anything(),
      })
    )
  })

  it('should call populateRelationships for each document', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfig)

    // populateRelationships should be called for each doc in each locale
    expect(hooks.populateRelationships).toHaveBeenCalledTimes(2)
  })

  it('should return sync results', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    const result = await bulkSync(mockPayload as any, 'experiences', testConfig)

    expect(result.success).toBe(true)
    expect(result.totalDocuments).toBe(1)
    expect(result.localeResults).toHaveLength(2)
  })

  // T051: Test for recreate option (drop and recreate)
  it('should recreate collection when recreate option is true', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfig, {
      recreate: true,
    })

    // Should delete collections first
    expect(locale.deleteCollection).toHaveBeenCalledWith('experiences', 'en')
    expect(locale.deleteCollection).toHaveBeenCalledWith('experiences', 'bg')

    // Then recreate them
    expect(locale.ensureCollection).toHaveBeenCalled()
  })

  it('should not recreate collection by default', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    mockImport.mockResolvedValue([{ success: true }])

    await bulkSync(mockPayload as any, 'experiences', testConfig)

    // Should not delete collections
    expect(locale.deleteCollection).not.toHaveBeenCalled()
  })

  it('should handle empty collection gracefully', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [],
      hasNextPage: false,
      nextPage: null,
    })

    const result = await bulkSync(mockPayload as any, 'experiences', testConfig)

    expect(result.success).toBe(true)
    expect(result.totalDocuments).toBe(0)
  })
})

describe('bulk sync error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
    vi.mocked(locale.ensureCollection).mockResolvedValue({
      created: false,
      name: 'test',
    })
  })

  it('should handle Payload fetch errors for a locale', async () => {
    // First locale fails, second succeeds
    mockPayload.find
      .mockRejectedValueOnce(new Error('Database error'))
      .mockResolvedValueOnce({
        docs: [{ id: '1', title: 'Test' }],
        hasNextPage: false,
        nextPage: null,
      })

    mockImport.mockResolvedValue([{ success: true }])

    const result = await bulkSync(mockPayload as any, 'experiences', testConfig)

    expect(result.success).toBe(false)
    // Should still have results for the successful locale
    expect(result.localeResults.some((r) => r.success)).toBe(true)
  })

  it('should continue with other locales on import error', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [{ id: '1', title: 'Test' }],
      hasNextPage: false,
      nextPage: null,
    })

    // First locale fails, second succeeds
    mockImport
      .mockRejectedValueOnce(new Error('Import failed'))
      .mockResolvedValueOnce([{ success: true }])

    const result = await bulkSync(mockPayload as any, 'experiences', testConfig)

    // Should still have results for successful locale
    expect(result.localeResults.some((r) => r.success)).toBe(true)
  })
})
