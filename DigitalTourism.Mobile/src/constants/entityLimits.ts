/**
 * Entity field limits and constraints
 * 
 * Max/min lengths for data model fields to ensure consistent validation.
 */
export const ENTITY_LIMITS = {
  // Common fields
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 255,
  MIN_DESCRIPTION_LENGTH: 0,
  MAX_DESCRIPTION_LENGTH: 5000,
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
  
  // Collections
  MAX_FAVORITES: 50,
  MAX_LISTS: 20,
  MAX_ITEMS_PER_LIST: 1000,
  MAX_TAGS_PER_ITEM: 10,
  MAX_CATEGORIES: 20,
  
  // Ratings & Reviews
  MIN_RATING: 0,
  MAX_RATING: 5,
  RATING_PRECISION: 0.5,         // Allow 4.5 ratings
  MIN_REVIEW_LENGTH: 10,
  MAX_REVIEW_LENGTH: 2000,
  
  // Location
  MIN_LATITUDE: -90,
  MAX_LATITUDE: 90,
  MIN_LONGITUDE: -180,
  MAX_LONGITUDE: 180,
  
  // Time-based
  MIN_VISIT_DURATION: 5,         // minutes
  MAX_VISIT_DURATION: 480,       // 8 hours
  MIN_EVENT_DURATION: 30,        // minutes
  MAX_EVENT_DURATION: 10080,     // 7 days
} as const;

export type EntityLimit = typeof ENTITY_LIMITS[keyof typeof ENTITY_LIMITS];
