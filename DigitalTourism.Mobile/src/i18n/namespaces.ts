/**
 * i18n Namespace Constants
 *
 * Defines all translation namespaces used in the application.
 * Each namespace corresponds to a separate JSON file.
 */

export const NAMESPACES = {
  COMMON: 'common',
  NAVIGATION: 'navigation',
  EVENTS: 'events',
  ATTRACTIONS: 'attractions',
  ERRORS: 'errors',
  ONBOARDING: 'onboarding',
  MAP: 'map',
  PROFILE: 'profile',
  HOTELS: 'hotels',
  RESTAURANTS: 'restaurants',
  ACTIVITIES: 'activities',
  AUDIO: 'audio',
  FAVOURITES: 'favourites',
  ROUTES: 'routes',
} as const;

export const DEFAULT_NAMESPACE = NAMESPACES.COMMON;

export const ALL_NAMESPACES = Object.values(NAMESPACES);
