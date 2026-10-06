/**
 * i18next Configuration
 *
 * Configures i18next with:
 * - 5 supported languages: en, bg, de, ru, fr
 * - Language detection via device locale
 * - Mock backend for translation loading
 * - Bundled translations for en, bg, de, ru, fr
 * - MMKV caching for persistence
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languageDetector } from './languageDetector';
import { mockBackend } from './mockBackend';
import { NAMESPACES, DEFAULT_NAMESPACE, ALL_NAMESPACES } from './namespaces';

// Import bundled translations (en, bg, de, ru, fr)
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enEvents from './locales/en/events.json';
import enAttractions from './locales/en/attractions.json';
import enErrors from './locales/en/errors.json';

import bgCommon from './locales/bg/common.json';
import bgNavigation from './locales/bg/navigation.json';
import bgEvents from './locales/bg/events.json';
import bgAttractions from './locales/bg/attractions.json';
import bgErrors from './locales/bg/errors.json';

import deCommon from './locales/de/common.json';
import deNavigation from './locales/de/navigation.json';
import deEvents from './locales/de/events.json';
import deAttractions from './locales/de/attractions.json';
import deErrors from './locales/de/errors.json';

import ruCommon from './locales/ru/common.json';
import ruNavigation from './locales/ru/navigation.json';
import ruEvents from './locales/ru/events.json';
import ruAttractions from './locales/ru/attractions.json';
import ruErrors from './locales/ru/errors.json';

import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frEvents from './locales/fr/events.json';
import frAttractions from './locales/fr/attractions.json';
import frErrors from './locales/fr/errors.json';

import enOnboarding from './locales/en/onboarding.json';
import bgOnboarding from './locales/bg/onboarding.json';
import deOnboarding from './locales/de/onboarding.json';
import ruOnboarding from './locales/ru/onboarding.json';
import frOnboarding from './locales/fr/onboarding.json';

import enMap from './locales/en/map.json';
import bgMap from './locales/bg/map.json';
import deMap from './locales/de/map.json';
import ruMap from './locales/ru/map.json';
import frMap from './locales/fr/map.json';

import enProfile from './locales/en/profile.json';
import bgProfile from './locales/bg/profile.json';
import deProfile from './locales/de/profile.json';
import ruProfile from './locales/ru/profile.json';
import frProfile from './locales/fr/profile.json';

import enHotels from './locales/en/hotels.json';
import bgHotels from './locales/bg/hotels.json';
import deHotels from './locales/de/hotels.json';
import ruHotels from './locales/ru/hotels.json';
import frHotels from './locales/fr/hotels.json';

import enRestaurants from './locales/en/restaurants.json';
import bgRestaurants from './locales/bg/restaurants.json';
import deRestaurants from './locales/de/restaurants.json';
import ruRestaurants from './locales/ru/restaurants.json';
import frRestaurants from './locales/fr/restaurants.json';

import enActivities from './locales/en/activities.json';
import bgActivities from './locales/bg/activities.json';
import deActivities from './locales/de/activities.json';
import ruActivities from './locales/ru/activities.json';
import frActivities from './locales/fr/activities.json';

import enFavourites from './locales/en/favourites.json';
import bgFavourites from './locales/bg/favourites.json';
import deFavourites from './locales/de/favourites.json';
import ruFavourites from './locales/ru/favourites.json';
import frFavourites from './locales/fr/favourites.json';

import enRoutes from './locales/en/routes.json';
import bgRoutes from './locales/bg/routes.json';
import deRoutes from './locales/de/routes.json';
import ruRoutes from './locales/ru/routes.json';
import frRoutes from './locales/fr/routes.json';

// Import types for type safety
import './types';

// Bundled resources (en, bg, de, ru, fr)
const resources = {
  en: {
    [NAMESPACES.COMMON]: enCommon,
    [NAMESPACES.NAVIGATION]: enNavigation,
    [NAMESPACES.EVENTS]: enEvents,
    [NAMESPACES.ATTRACTIONS]: enAttractions,
    [NAMESPACES.ERRORS]: enErrors,
    [NAMESPACES.ONBOARDING]: enOnboarding,
    [NAMESPACES.MAP]: enMap,
    [NAMESPACES.PROFILE]: enProfile,
    [NAMESPACES.HOTELS]: enHotels,
    [NAMESPACES.RESTAURANTS]: enRestaurants,
    [NAMESPACES.ACTIVITIES]: enActivities,
    [NAMESPACES.FAVOURITES]: enFavourites,
    [NAMESPACES.ROUTES]: enRoutes,
  },
  bg: {
    [NAMESPACES.COMMON]: bgCommon,
    [NAMESPACES.NAVIGATION]: bgNavigation,
    [NAMESPACES.EVENTS]: bgEvents,
    [NAMESPACES.ATTRACTIONS]: bgAttractions,
    [NAMESPACES.ERRORS]: bgErrors,
    [NAMESPACES.ONBOARDING]: bgOnboarding,
    [NAMESPACES.MAP]: bgMap,
    [NAMESPACES.PROFILE]: bgProfile,
    [NAMESPACES.HOTELS]: bgHotels,
    [NAMESPACES.RESTAURANTS]: bgRestaurants,
    [NAMESPACES.ACTIVITIES]: bgActivities,
    [NAMESPACES.FAVOURITES]: bgFavourites,
    [NAMESPACES.ROUTES]: bgRoutes,
  },
  de: {
    [NAMESPACES.COMMON]: deCommon,
    [NAMESPACES.NAVIGATION]: deNavigation,
    [NAMESPACES.EVENTS]: deEvents,
    [NAMESPACES.ATTRACTIONS]: deAttractions,
    [NAMESPACES.ERRORS]: deErrors,
    [NAMESPACES.ONBOARDING]: deOnboarding,
    [NAMESPACES.MAP]: deMap,
    [NAMESPACES.PROFILE]: deProfile,
    [NAMESPACES.HOTELS]: deHotels,
    [NAMESPACES.RESTAURANTS]: deRestaurants,
    [NAMESPACES.ACTIVITIES]: deActivities,
    [NAMESPACES.FAVOURITES]: deFavourites,
    [NAMESPACES.ROUTES]: deRoutes,
  },
  ru: {
    [NAMESPACES.COMMON]: ruCommon,
    [NAMESPACES.NAVIGATION]: ruNavigation,
    [NAMESPACES.EVENTS]: ruEvents,
    [NAMESPACES.ATTRACTIONS]: ruAttractions,
    [NAMESPACES.ERRORS]: ruErrors,
    [NAMESPACES.ONBOARDING]: ruOnboarding,
    [NAMESPACES.MAP]: ruMap,
    [NAMESPACES.PROFILE]: ruProfile,
    [NAMESPACES.HOTELS]: ruHotels,
    [NAMESPACES.RESTAURANTS]: ruRestaurants,
    [NAMESPACES.ACTIVITIES]: ruActivities,
    [NAMESPACES.FAVOURITES]: ruFavourites,
    [NAMESPACES.ROUTES]: ruRoutes,
  },
  fr: {
    [NAMESPACES.COMMON]: frCommon,
    [NAMESPACES.NAVIGATION]: frNavigation,
    [NAMESPACES.EVENTS]: frEvents,
    [NAMESPACES.ATTRACTIONS]: frAttractions,
    [NAMESPACES.ERRORS]: frErrors,
    [NAMESPACES.ONBOARDING]: frOnboarding,
    [NAMESPACES.MAP]: frMap,
    [NAMESPACES.PROFILE]: frProfile,
    [NAMESPACES.HOTELS]: frHotels,
    [NAMESPACES.RESTAURANTS]: frRestaurants,
    [NAMESPACES.ACTIVITIES]: frActivities,
    [NAMESPACES.FAVOURITES]: frFavourites,
    [NAMESPACES.ROUTES]: frRoutes,
  },
};

// Initialize i18next
i18n
  .use(mockBackend) // Mock backend loader (serves all locales)
  .use(languageDetector) // Device locale detection + MMKV persistence
  .use(initReactI18next) // React bindings
  .init({
    // Fallback configuration
    fallbackLng: 'en',
    defaultNS: DEFAULT_NAMESPACE,
    ns: ALL_NAMESPACES,

    // Supported languages
    supportedLngs: ['en', 'bg', 'de', 'ru', 'fr'],

    // Bundled resources
    resources,
    
    // Backend configuration
    backend: {
      loadPath: '/i18n/{{lng}}/{{ns}}.json', // Mock endpoint (not used, but required)
    },
    
    // Allow mixing bundled and backend translations
    partialBundledLanguages: true,
    
    // React-specific options
    react: {
      useSuspense: false, // RN compatibility
    },
    
    // Interpolation
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    
    // Error handling
    saveMissing: false, // Don't save missing keys
    returnEmptyString: false, // Show key if translation missing
    returnNull: false, // Show key, not null
    
    // Missing key handler
    missingKeyHandler: (lngs, ns, key) => {
      if (__DEV__) {
        console.warn(`[i18n] Missing translation: ${ns}:${key} for languages: ${lngs.join(', ')}`);
      }
    },
    
    // Debug in development
    debug: __DEV__,
  });

export default i18n;
