/**
 * Input validation and UI timing constants
 * 
 * Use these for form validation, debouncing, and animation durations
 * to ensure consistent behavior across screens.
 */
export const VALIDATION = {
  // String lengths
  MIN_SEARCH_CHARS: 3,
  MIN_LIST_NAME_LENGTH: 1,
  MAX_LIST_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 0,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  // Numeric ranges
  MIN_RATING: 0,
  MAX_RATING: 5,
  RATING_STEP: 0.5,
  
  // Debounce timings (milliseconds)
  DEBOUNCE_SEARCH: 500,       // Search input
  DEBOUNCE_INPUT: 300,        // General input
  DEBOUNCE_FILTER: 400,       // Filter changes
  
  // Animation durations (milliseconds)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
  
  // UI timing
  TOAST_DURATION: 3000,       // Toast notification
  MODAL_ANIMATION: 250,       // Modal open/close
  SNACKBAR_DURATION: 4000,
  
  // Collection limits
  MAX_FAVORITES: 50,
  MAX_LISTS: 20,
  MAX_ITEMS_PER_LIST: 1000,
  MAX_TAGS_PER_ITEM: 10,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
} as const;

export type ValidationRule = typeof VALIDATION[keyof typeof VALIDATION];
