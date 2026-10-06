/**
 * Tests for document sync hooks (T040-T042)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  syncDocumentToTypesense,
  deleteDocumentFromTypesense,
  createAfterChangeHook,
  createAfterDeleteHook,
  populateRelationships,
} from '../../../src/plugins/typesense/hooks'
import * as client from '../../../src/plugins/typesense/client'
import type { CollectionConfig } from '../../../src/plugins/typesense/types'

// Mock the client module
vi.mock('../../../src/plugins/typesense/client', () => ({
  getClient: vi.fn(),
}))

// Mock Typesense client
const mockUpsert = vi.fn()
const mockDelete = vi.fn()
const mockDocuments = vi.fn(() => ({
  upsert: mockUpsert,
  delete: mockDelete,
}))
const mockCollection = vi.fn(() => ({
  documents: mockDocuments,
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
  populate: {
    heroImage: { collection: 'media', depth: 0 },
  },
}

// Mock Payload findByID and find for the afterChange hook
const mockFindByID = vi.fn()
const mockFind = vi.fn()
const mockPayload = {
  findByID: mockFindByID,
  find: mockFind,
}

function createMockReq(locale?: string) {
  return {
    locale: locale || 'en',
    payload: mockPayload,
  }
}

/** Flush microtask queue so fire-and-forget hooks complete before assertions */
function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe('syncDocumentToTypesense', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  // T040: Test for afterChange hook triggering sync
  it('should sync document to all locale collections', async () => {
    const doc = {
      id: '123',
      title: { en: 'English Title', bg: 'Bulgarian Title' },
      rating: 4.5,
    }

    mockUpsert.mockResolvedValue({})

    await syncDocumentToTypesense('experiences', testConfig, doc)

    // Should sync to both en and bg collections
    expect(mockCollection).toHaveBeenCalledWith('experiences_en')
    expect(mockCollection).toHaveBeenCalledWith('experiences_bg')
    expect(mockUpsert).toHaveBeenCalledTimes(2)
  })

  it('should transform document before syncing', async () => {
    const doc = {
      id: '456',
      title: { en: 'Test', bg: 'Тест' },
      rating: 3.5,
    }

    mockUpsert.mockResolvedValue({})

    await syncDocumentToTypesense('experiences', testConfig, doc)

    // Verify documents are transformed correctly
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '456',
        rating: 3.5,
      })
    )
  })

  it('should return success result when sync succeeds', async () => {
    const doc = { id: '789', title: { en: 'Test' }, rating: 5 }
    mockUpsert.mockResolvedValue({})

    const result = await syncDocumentToTypesense('experiences', testConfig, doc)

    expect(result.success).toBe(true)
    expect(result.documentId).toBe('789')
    expect(result.locales).toEqual(['en', 'bg'])
  })

  it('should handle partial failures gracefully', async () => {
    const doc = { id: '101', title: { en: 'Test' }, rating: 4 }

    // First call succeeds, second fails
    mockUpsert.mockResolvedValueOnce({})
    mockUpsert.mockRejectedValueOnce(new Error('Connection failed'))

    const result = await syncDocumentToTypesense('experiences', testConfig, doc)

    // Should report partial success
    expect(result.success).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('bg')
  })
})

describe('deleteDocumentFromTypesense', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  // T041: Test for afterDelete hook removing document
  it('should delete document from all locale collections', async () => {
    mockDelete.mockResolvedValue({})

    await deleteDocumentFromTypesense('experiences', testConfig, '123')

    expect(mockCollection).toHaveBeenCalledWith('experiences_en')
    expect(mockCollection).toHaveBeenCalledWith('experiences_bg')
    expect(mockDocuments).toHaveBeenCalledWith('123')
    expect(mockDelete).toHaveBeenCalledTimes(2)
  })

  it('should return success result when delete succeeds', async () => {
    mockDelete.mockResolvedValue({})

    const result = await deleteDocumentFromTypesense(
      'experiences',
      testConfig,
      '456'
    )

    expect(result.success).toBe(true)
    expect(result.documentId).toBe('456')
  })

  it('should handle document not found gracefully', async () => {
    mockDelete.mockRejectedValue(new Error('Document not found'))

    const result = await deleteDocumentFromTypesense(
      'experiences',
      testConfig,
      '789'
    )

    // Not found is still considered "success" for delete
    expect(result.success).toBe(true)
  })
})

describe('populateRelationships', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return doc unchanged when no populate config', async () => {
    const doc = { id: '1', title: 'Test' }
    const result = await populateRelationships(mockPayload as any, doc, testConfig, 'en')
    expect(result).toBe(doc)
  })

  it('should populate relationships that are raw IDs', async () => {
    const doc = { id: '1', heroImage: 42 }
    const populatedMedia = { id: 42, url: '/image.jpg', alt: 'Test' }
    mockFindByID.mockResolvedValueOnce(populatedMedia)

    const result = await populateRelationships(
      mockPayload as any,
      doc,
      testConfigWithDrafts,
      'en'
    )

    expect(mockFindByID).toHaveBeenCalledWith({
      collection: 'media',
      id: 42,
      depth: 0,
      locale: 'en',
      overrideAccess: true,
    })
    expect(result.heroImage).toBe(populatedMedia)
  })

  it('should skip already-populated relationships (objects)', async () => {
    const heroImage = { id: 42, url: '/image.jpg', alt: 'Test' }
    const doc = { id: '1', heroImage }

    const result = await populateRelationships(
      mockPayload as any,
      doc,
      testConfigWithDrafts,
      'en'
    )

    // Should not fetch since heroImage is already an object
    expect(mockFindByID).not.toHaveBeenCalled()
    expect(result.heroImage).toBe(heroImage)
  })

  it('should handle fetch errors gracefully', async () => {
    const doc = { id: '1', heroImage: 999 }
    mockFindByID.mockRejectedValueOnce(new Error('Not found'))

    const result = await populateRelationships(
      mockPayload as any,
      doc,
      testConfigWithDrafts,
      'en'
    )

    // Should keep the raw ID
    expect(result.heroImage).toBe(999)
  })
})

describe('createAfterChangeHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
    mockUpsert.mockResolvedValue({})
  })

  it('should create a hook function', () => {
    const hook = createAfterChangeHook('experiences', testConfig)
    expect(typeof hook).toBe('function')
  })

  it('should sync all locales when doc has no _status (non-draft collection)', async () => {
    const hook = createAfterChangeHook('experiences', testConfig)

    // findByID only needed for non-current locales (bg); current locale (en) uses doc from hook
    mockFindByID.mockResolvedValue({ id: '123', title: 'Test', rating: 4 })

    await hook({
      doc: { id: '123', title: 'Test', rating: 4 },
      req: createMockReq(),
      operation: 'create' as const,
      previousDoc: undefined,
    } as any)

    // Wait for fire-and-forget sync to complete
    await flushPromises()

    // Current locale (en) uses doc from hook; only bg fetched via findByID
    expect(mockFindByID).toHaveBeenCalledTimes(1)
    expect(mockFindByID).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'bg', overrideAccess: true })
    )
    expect(mockUpsert).toHaveBeenCalledTimes(2)
  })

  it('should sync all locales when _status is published', async () => {
    const hook = createAfterChangeHook('experiences', testConfigWithDrafts)

    mockFindByID.mockResolvedValue({
      id: '123',
      title: 'Test',
      rating: 4,
      _status: 'published',
      heroImage: { id: 1, url: '/img.jpg' },
    })

    await hook({
      doc: { id: '123', _status: 'published', heroImage: 1 },
      req: createMockReq(),
      operation: 'update' as const,
      previousDoc: undefined,
    } as any)

    // Wait for fire-and-forget sync to complete
    await flushPromises()

    // en: doc from hook (heroImage:1 → populateRelationships calls findByID for media)
    // bg: findByID for locale doc (heroImage already populated in mock → populate skips)
    expect(mockFindByID).toHaveBeenCalledTimes(2)
    expect(mockUpsert).toHaveBeenCalledTimes(2)
  })

  it('should delete from all locales on unpublish (previously published)', async () => {
    const hook = createAfterChangeHook('experiences', testConfigWithDrafts)

    await hook({
      doc: { id: '123', _status: 'draft', heroImage: 1 },
      req: createMockReq(),
      operation: 'update' as const,
      previousDoc: { id: '123', _status: 'published', heroImage: 1 },
    } as any)

    // Wait for fire-and-forget delete to complete
    await flushPromises()

    // Should delete from all locales
    expect(mockFindByID).not.toHaveBeenCalled()
    expect(mockFind).not.toHaveBeenCalled()
    expect(mockUpsert).not.toHaveBeenCalled()
    expect(mockDelete).toHaveBeenCalledTimes(2) // one per locale
  })

  it('should skip sync entirely when saving a draft that was never published', async () => {
    const hook = createAfterChangeHook('experiences', testConfigWithDrafts)

    await hook({
      doc: { id: '123', _status: 'draft', heroImage: 1 },
      req: createMockReq(),
      operation: 'create' as const,
      previousDoc: undefined, // never published
    } as any)

    await flushPromises()

    // Nothing to index or remove — complete no-op
    expect(mockFindByID).not.toHaveBeenCalled()
    expect(mockUpsert).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it('should keep index when saving a draft of a still-published document (isDraftSave)', async () => {
    const hook = createAfterChangeHook('experiences', testConfigWithDrafts)

    // Simulate editorial-workflow setting isDraftSave in req.context
    const req = createMockReq()
    ;(req as any).context = { isDraftSave: true }

    await hook({
      doc: { id: '123', _status: 'draft', heroImage: 1 },
      req,
      operation: 'update' as const,
      previousDoc: undefined,
    } as any)

    // isDraftSave is true → keep index, don't delete or sync
    expect(mockFindByID).not.toHaveBeenCalled()
    expect(mockFind).not.toHaveBeenCalled()
    expect(mockUpsert).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
  })

  it('should return the document unchanged', async () => {
    const hook = createAfterChangeHook('experiences', testConfig)
    const doc = { id: '123', title: 'Test', rating: 4 }

    mockFindByID.mockResolvedValue(doc)

    const result = await hook({
      doc,
      req: createMockReq(),
      operation: 'create',
      previousDoc: undefined,
    } as any)

    expect(result).toBe(doc)
  })

  // T042: Test for error handling (non-blocking)
  it('should not throw on sync error (non-blocking)', async () => {
    mockFindByID.mockRejectedValue(new Error('Typesense unavailable'))

    const hook = createAfterChangeHook('experiences', testConfig)
    const doc = { id: '123', title: 'Test', rating: 4 }

    // Should not throw
    const result = await hook({
      doc,
      req: createMockReq(),
      operation: 'create',
      previousDoc: undefined,
    } as any)

    // Document should still be returned
    expect(result).toBe(doc)
  })

  it('should handle per-locale errors without blocking other locales', async () => {
    const hook = createAfterChangeHook('experiences', testConfig)

    // bg locale findByID fails (en uses doc from hook, so no findByID call for it)
    mockFindByID.mockRejectedValueOnce(new Error('Network error'))

    await hook({
      doc: { id: '123', title: 'Test', rating: 4 },
      req: createMockReq(),
      operation: 'create',
      previousDoc: undefined,
    } as any)

    // Wait for fire-and-forget sync to complete
    await flushPromises()

    // en succeeds (doc from hook), bg fails (findByID error) → 1 upsert
    expect(mockUpsert).toHaveBeenCalledTimes(1)
  })
})

describe('createAfterDeleteHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
    mockDelete.mockResolvedValue({})
  })

  it('should create a hook function', () => {
    const hook = createAfterDeleteHook('experiences', testConfig)
    expect(typeof hook).toBe('function')
  })

  it('should delete document when hook is called', async () => {
    const hook = createAfterDeleteHook('experiences', testConfig)

    await hook({
      doc: { id: '123' },
      req: {},
      id: '123',
    } as any)

    // Wait for fire-and-forget delete to complete
    await flushPromises()

    expect(mockDelete).toHaveBeenCalled()
  })

  it('should not throw on delete error (non-blocking)', async () => {
    mockDelete.mockRejectedValue(new Error('Typesense unavailable'))

    const hook = createAfterDeleteHook('experiences', testConfig)

    // Should not throw
    const result = await hook({
      doc: { id: '123' },
      req: {},
      id: '123',
    } as any)

    expect(result).toBeDefined()
  })
})

describe('error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  it('should catch and log all errors without rethrowing', async () => {
    mockUpsert.mockRejectedValue(new Error('Network error'))

    const result = await syncDocumentToTypesense('experiences', testConfig, {
      id: '123',
      title: { en: 'Test' },
      rating: 4,
    })

    // Should return error result, not throw
    expect(result.success).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should handle invalid document gracefully', async () => {
    const result = await syncDocumentToTypesense('experiences', testConfig, null)

    expect(result.success).toBe(false)
    expect(result.errors).toContain('Invalid document: missing id')
  })

  it('should handle missing id field', async () => {
    const result = await syncDocumentToTypesense('experiences', testConfig, {
      title: { en: 'No ID' },
    })

    expect(result.success).toBe(false)
    expect(result.errors).toContain('Invalid document: missing id')
  })
})
