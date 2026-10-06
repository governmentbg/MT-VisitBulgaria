/**
 * Cache timing constants for React Query staleTime and refetchInterval
 * 
 * These constants define how long data is considered fresh before refetching.
 * Use these instead of inline calculations like `10 * 60 * 1000`.
 */
export const CACHE_TIMES = {
  /**
   * Short cache time (2 minutes)
   * Use for: Volatile data, user-generated content, search results
   */
  SHORT: 2 * 60 * 1000,
  
  /**
   * Medium cache time (5 minutes)
   * Use for: Moderate changes, event lists, filtered data
   */
  MEDIUM: 5 * 60 * 1000,
  
  /**
   * Long cache time (10 minutes)
   * Use for: Stable data, attractions, categories
   */
  LONG: 10 * 60 * 1000,
  
  /**
   * Very long cache time (30 minutes)
   * Use for: Static data, configuration
   */
  VERY_LONG: 30 * 60 * 1000,
  
  /**
   * Persistent cache time (24 hours)
   * Use for: Rarely changing data, app configuration
   */
  PERSISTENT: 24 * 60 * 60 * 1000,
} as const;

export type CacheTime = typeof CACHE_TIMES[keyof typeof CACHE_TIMES];
