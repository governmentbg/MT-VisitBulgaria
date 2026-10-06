/**
 * Query Key Factory Pattern
 * 
 * Centralized query keys for cache management and invalidation.
 * Using hierarchical structure for efficient cache operations.
 */
export const queryKeys = {
  // Attractions query keys
  attractions: {
    all: ['attractions'] as const,
    lists: () => [...queryKeys.attractions.all, 'list'] as const,
    list: (filters?: {locale?: string; limit?: number; page?: number; categoryId?: string; search?: string}) =>
      [...queryKeys.attractions.lists(), filters] as const,
    details: () => [...queryKeys.attractions.all, 'detail'] as const,
    detail: (id: string, locale?: string) => 
      [...queryKeys.attractions.details(), id, {locale}] as const,
  },

  // Events query keys
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters?: {locale?: string; limit?: number; page?: number; status?: string; search?: string}) =>
      [...queryKeys.events.lists(), filters] as const,
    active: (locale?: string) => [...queryKeys.events.all, 'active', {locale}] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string, locale?: string) => 
      [...queryKeys.events.details(), id, {locale}] as const,
  },

  // Hotels query keys
  hotels: {
    all: ['hotels'] as const,
    lists: () => [...queryKeys.hotels.all, 'list'] as const,
    list: (filters?: {locale?: string; limit?: number; page?: number; search?: string}) =>
      [...queryKeys.hotels.lists(), filters] as const,
    details: () => [...queryKeys.hotels.all, 'detail'] as const,
    detail: (id: string, locale?: string) =>
      [...queryKeys.hotels.details(), id, {locale}] as const,
  },

  // Restaurants query keys
  restaurants: {
    all: ['restaurants'] as const,
    lists: () => [...queryKeys.restaurants.all, 'list'] as const,
    list: (filters?: {locale?: string; limit?: number; page?: number; search?: string}) =>
      [...queryKeys.restaurants.lists(), filters] as const,
    details: () => [...queryKeys.restaurants.all, 'detail'] as const,
    detail: (id: string, locale?: string) =>
      [...queryKeys.restaurants.details(), id, {locale}] as const,
  },

  // Activities query keys
  activities: {
    all: ['activities'] as const,
    lists: () => [...queryKeys.activities.all, 'list'] as const,
    list: (filters?: {locale?: string; limit?: number; page?: number; search?: string}) =>
      [...queryKeys.activities.lists(), filters] as const,
    details: () => [...queryKeys.activities.all, 'detail'] as const,
    detail: (id: string, locale?: string) =>
      [...queryKeys.activities.details(), id, {locale}] as const,
  },

  // Routes (Trips) query keys
  routes: {
    all: ['routes'] as const,
    lists: () => [...queryKeys.routes.all, 'list'] as const,
    details: () => [...queryKeys.routes.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.routes.details(), id] as const,
  },

  // Favourites query keys
  favourites: {
    all: ['favourites'] as const,
    list: () => [...queryKeys.favourites.all, 'list'] as const,
  },

  // Cities query keys
  cities: {
    all: ['cities'] as const,
    list: (locale?: string) => [...queryKeys.cities.all, 'list', {locale}] as const,
  },

  // Categories query keys
  categories: {
    all: ['categories'] as const,
  },

  // Map query keys
  map: {
    search: () => ['map-search'] as const,
  },
} as const;
