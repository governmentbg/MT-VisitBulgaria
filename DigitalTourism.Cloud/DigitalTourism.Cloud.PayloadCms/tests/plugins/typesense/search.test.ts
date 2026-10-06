/**
 * Tests for search API (T057-T060)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  search,
  searchNearby,
  multiSearch,
} from '../../../src/plugins/typesense/search'
import * as client from '../../../src/plugins/typesense/client'
import * as locale from '../../../src/plugins/typesense/locale'
import type { SearchParams, GeoSearchParams } from '../../../src/plugins/typesense/types'

// Mock the client module
vi.mock('../../../src/plugins/typesense/client', () => ({
  getClient: vi.fn(),
}))

// Mock locale module
vi.mock('../../../src/plugins/typesense/locale', () => ({
  getCollectionName: vi.fn((slug, loc) => `${slug}_${loc}`),
}))

// Mock Typesense client
const mockSearch = vi.fn()
const mockDocuments = vi.fn(() => ({
  search: mockSearch,
}))
const mockCollection = vi.fn(() => ({
  documents: mockDocuments,
}))
const mockMultiSearch = vi.fn()
const mockClient = {
  collections: mockCollection,
  multiSearch: {
    perform: mockMultiSearch,
  },
}

// Sample Typesense response
const mockTypesenseResponse = {
  found: 2,
  hits: [
    {
      document: { id: '1', title: 'Hotel Sunrise', rating: 4.5 },
      text_match: 100,
      highlights: [{ field: 'title', snippet: '<mark>Hotel</mark> Sunrise' }],
    },
    {
      document: { id: '2', title: 'Hotel Vista', rating: 4.2 },
      text_match: 95,
      highlights: [{ field: 'title', snippet: '<mark>Hotel</mark> Vista' }],
    },
  ],
  facet_counts: [
    {
      field_name: 'type',
      counts: [
        { value: 'hotel', count: 10 },
        { value: 'restaurant', count: 5 },
      ],
    },
  ],
  search_time_ms: 5,
  page: 1,
  out_of: 2,
}

describe('search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  // T057: Test for basic search with typed results
  it('should perform basic search with typed results', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const params: SearchParams = {
      q: 'hotel',
      queryBy: ['title', 'description'],
    }

    const result = await search<{ id: string; title: string; rating: number }>(
      'experiences',
      'en',
      params
    )

    expect(mockCollection).toHaveBeenCalledWith('experiences_en')
    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        q: 'hotel',
        query_by: 'title,description',
      })
    )

    expect(result.found).toBe(2)
    expect(result.hits).toHaveLength(2)
    expect(result.hits[0].document.title).toBe('Hotel Sunrise')
    expect(result.hits[0].document.rating).toBe(4.5)
  })

  it('should include search score in results', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const result = await search('experiences', 'en', {
      q: 'hotel',
      queryBy: ['title'],
    })

    expect(result.hits[0].score).toBe(100)
  })

  it('should include highlights in results', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const result = await search('experiences', 'en', {
      q: 'hotel',
      queryBy: ['title'],
      highlightFields: ['title'],
    })

    expect(result.hits[0].highlights).toBeDefined()
    expect(result.hits[0].highlights?.title[0]).toContain('<mark>Hotel</mark>')
  })

  // T058: Test for faceted search with filter expressions
  it('should support faceted search', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const params: SearchParams = {
      q: 'hotel',
      queryBy: ['title'],
      facetBy: ['type'],
    }

    const result = await search('experiences', 'en', params)

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        facet_by: 'type',
      })
    )

    expect(result.facetCounts).toBeDefined()
    expect(result.facetCounts?.type).toHaveLength(2)
    expect(result.facetCounts?.type[0].value).toBe('hotel')
    expect(result.facetCounts?.type[0].count).toBe(10)
  })

  it('should support filter expressions', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const params: SearchParams = {
      q: 'hotel',
      queryBy: ['title'],
      filterBy: 'rating:>4.0 && type:hotel',
    }

    await search('experiences', 'en', params)

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_by: 'rating:>4.0 && type:hotel',
      })
    )
  })

  it('should support sorting', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const params: SearchParams = {
      q: 'hotel',
      queryBy: ['title'],
      sortBy: 'rating:desc',
    }

    await search('experiences', 'en', params)

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        sort_by: 'rating:desc',
      })
    )
  })

  it('should support pagination', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const params: SearchParams = {
      q: 'hotel',
      queryBy: ['title'],
      page: 2,
      perPage: 20,
    }

    const result = await search('experiences', 'en', params)

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        per_page: 20,
      })
    )

    expect(result.page).toBe(1) // from response
  })

  it('should include search time in response', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const result = await search('experiences', 'en', {
      q: 'hotel',
      queryBy: ['title'],
    })

    expect(result.searchTimeMs).toBe(5)
  })
})

// T059: Test for geo-search (searchNearby)
describe('searchNearby', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  it('should search with geo-distance filter', async () => {
    const geoResponse = {
      ...mockTypesenseResponse,
      hits: [
        {
          document: { id: '1', title: 'Near Hotel', location: [42.6977, 23.3219] },
          text_match: 100,
          geo_distance_meters: { location: 1500 },
        },
      ],
    }
    mockSearch.mockResolvedValueOnce(geoResponse)

    const params: GeoSearchParams = {
      q: '*',
      queryBy: ['title'],
      geoField: 'location',
      point: { lat: 42.6977, lng: 23.3219 },
      radiusKm: 10,
    }

    const result = await searchNearby('experiences', 'en', params)

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_by: expect.stringContaining('location:(42.6977, 23.3219, 10 km)'),
      })
    )

    expect(result.hits[0].geoDistanceKm).toBeCloseTo(1.5, 1)
  })

  it('should sort by distance when specified', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const params: GeoSearchParams = {
      q: '*',
      queryBy: ['title'],
      geoField: 'location',
      point: { lat: 42.6977, lng: 23.3219 },
      radiusKm: 10,
      sortByDistance: true,
    }

    await searchNearby('experiences', 'en', params)

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        sort_by: expect.stringContaining('location(42.6977, 23.3219):asc'),
      })
    )
  })

  it('should combine geo filter with existing filters', async () => {
    mockSearch.mockResolvedValueOnce(mockTypesenseResponse)

    const params: GeoSearchParams = {
      q: 'hotel',
      queryBy: ['title'],
      geoField: 'location',
      point: { lat: 42.6977, lng: 23.3219 },
      radiusKm: 5,
      filterBy: 'rating:>4.0',
    }

    await searchNearby('experiences', 'en', params)

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_by: expect.stringMatching(/rating:>4\.0.*location.*|location.*rating:>4\.0/),
      })
    )
  })
})

// T060: Test for multi-search across collections
describe('multiSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  it('should perform multi-search across collections', async () => {
    mockMultiSearch.mockResolvedValueOnce({
      results: [
        { ...mockTypesenseResponse, found: 5 },
        { ...mockTypesenseResponse, found: 3 },
      ],
    })

    const result = await multiSearch([
      { collection: 'experiences', locale: 'en', params: { q: 'hotel', queryBy: ['title'] } },
      { collection: 'destinations', locale: 'en', params: { q: 'hotel', queryBy: ['name'] } },
    ])

    expect(mockMultiSearch).toHaveBeenCalledWith({
      searches: [
        expect.objectContaining({
          collection: 'experiences_en',
          q: 'hotel',
          query_by: 'title',
        }),
        expect.objectContaining({
          collection: 'destinations_en',
          q: 'hotel',
          query_by: 'name',
        }),
      ],
    })

    expect(result).toHaveLength(2)
    expect(result[0].found).toBe(5)
    expect(result[1].found).toBe(3)
  })

  it('should search same collection across multiple locales', async () => {
    mockMultiSearch.mockResolvedValueOnce({
      results: [
        { ...mockTypesenseResponse, found: 10 },
        { ...mockTypesenseResponse, found: 8 },
      ],
    })

    const result = await multiSearch([
      { collection: 'experiences', locale: 'en', params: { q: 'hotel', queryBy: ['title'] } },
      { collection: 'experiences', locale: 'bg', params: { q: 'хотел', queryBy: ['title'] } },
    ])

    expect(mockMultiSearch).toHaveBeenCalledWith({
      searches: expect.arrayContaining([
        expect.objectContaining({ collection: 'experiences_en' }),
        expect.objectContaining({ collection: 'experiences_bg' }),
      ]),
    })

    expect(result).toHaveLength(2)
  })
})

describe('search error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(client.getClient).mockReturnValue(mockClient as any)
  })

  it('should throw on search error', async () => {
    mockSearch.mockRejectedValueOnce(new Error('Collection not found'))

    await expect(
      search('experiences', 'en', { q: 'test', queryBy: ['title'] })
    ).rejects.toThrow('Collection not found')
  })

  it('should handle empty results', async () => {
    mockSearch.mockResolvedValueOnce({
      found: 0,
      hits: [],
      search_time_ms: 1,
      page: 1,
      out_of: 0,
    })

    const result = await search('experiences', 'en', {
      q: 'nonexistent',
      queryBy: ['title'],
    })

    expect(result.found).toBe(0)
    expect(result.hits).toHaveLength(0)
  })
})
