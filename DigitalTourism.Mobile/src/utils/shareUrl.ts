import Config from 'react-native-config';
import {i18n} from '../i18n';

const WEB_BASE_URL = Config.WEB_BASE_URL || 'https://visitbulgaria.com';

/**
 * Supported web locales that match the Next.js frontend routing.
 * See: DigitalTourism.Cloud.PayloadCms/src/i18n/localization.ts
 */
const SUPPORTED_LOCALES = ['en', 'bg', 'de', 'fr', 'ru'] as const;
const DEFAULT_LOCALE = 'en';

/** Map singular analytics type to the plural URL segment used by the web frontend. */
const ENTITY_TYPE_TO_PATH: Record<string, string> = {
  attraction: 'attractions',
  event: 'events',
  hotel: 'hotels',
  restaurant: 'restaurants',
  activity: 'activities',
};

function resolveLocale(): string {
  const current = (i18n.language || DEFAULT_LOCALE).slice(0, 2).toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(current)
    ? current
    : DEFAULT_LOCALE;
}

/**
 * Build a web URL for an entity detail page on the Next.js frontend.
 *
 * Format: `{WEB_BASE_URL}/{locale}/{type}/{slug}`
 * Falls back to the list page if no slug is available.
 */
export function buildShareUrl(
  entityType: string,
  slug: string | undefined,
): string {
  const locale = resolveLocale();
  const path = ENTITY_TYPE_TO_PATH[entityType] || `${entityType}s`;
  if (!slug) {
    return `${WEB_BASE_URL}/${locale}/${path}`;
  }
  return `${WEB_BASE_URL}/${locale}/${path}/${slug}`;
}
