/**
 * TypeScript Type Augmentation for i18next
 *
 * Provides type safety and autocomplete for translation keys.
 * Import English translations as the source of truth for types.
 */

import 'react-i18next';

import common from './locales/en/common.json';
import navigation from './locales/en/navigation.json';
import events from './locales/en/events.json';
import attractions from './locales/en/attractions.json';
import errors from './locales/en/errors.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      navigation: typeof navigation;
      events: typeof events;
      attractions: typeof attractions;
      errors: typeof errors;
    };
  }
}
