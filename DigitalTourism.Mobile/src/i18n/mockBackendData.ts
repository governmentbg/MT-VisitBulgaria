/**
 * Mock Backend Translation Data
 *
 * Contains translations for ALL locales (en, bg, de, ru, fr) across all namespaces.
 * This simulates a backend translation service that can serve updated translations.
 */

// Import bundled translations for en, bg, de, ru, fr
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

/**
 * Mock Backend Data Structure
 * Organized by locale -> namespace -> translations
 */
export const mockBackendData: Record<string, Record<string, any>> = {
  // English
  en: {
    common: enCommon,
    navigation: enNavigation,
    events: enEvents,
    attractions: enAttractions,
    errors: enErrors,
  },
  // Bulgarian
  bg: {
    common: bgCommon,
    navigation: bgNavigation,
    events: bgEvents,
    attractions: bgAttractions,
    errors: bgErrors,
  },
  // German
  de: {
    common: deCommon,
    navigation: deNavigation,
    events: deEvents,
    attractions: deAttractions,
    errors: deErrors,
  },
  // Russian
  ru: {
    common: ruCommon,
    navigation: ruNavigation,
    events: ruEvents,
    attractions: ruAttractions,
    errors: ruErrors,
  },
  // French
  fr: {
    common: frCommon,
    navigation: frNavigation,
    events: frEvents,
    attractions: frAttractions,
    errors: frErrors,
  },
};
