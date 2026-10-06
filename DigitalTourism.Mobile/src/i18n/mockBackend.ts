/**
 * Mock Backend Loader for i18next
 *
 * Simulates a backend translation API with:
 * - Network delays (300-1000ms)
 * - ETag caching (304 Not Modified responses)
 * - MMKV cache persistence
 * - 7-day cache TTL
 * - Comprehensive error handling
 */

import type { BackendModule, ReadCallback } from 'i18next';
import { i18nStorage } from './languageDetector';
import { mockBackendData } from './mockBackendData';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MIN_DELAY = 300;
const MAX_DELAY = 1000;

/**
 * Simulates network delay (300-1000ms)
 */
function simulateDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Get cached translation from MMKV
 */
function getCachedTranslation(locale: string, namespace: string) {
  try {
    const cacheKey = `i18n_cache_${locale}_${namespace}`;
    const cached = i18nStorage.getString(cacheKey);

    if (!cached) return null;

    const parsed = JSON.parse(cached);

    // Validate cache structure
    if (!parsed.data || typeof parsed.data !== 'object') {
      console.warn(`[MockBackend] Invalid cache for ${locale}/${namespace}, clearing`);
      (i18nStorage as unknown as {delete: (k: string) => void}).delete(cacheKey);
      return null;
    }

    // Check cache age (7 days)
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(`[MockBackend] Error reading cache:`, error);
    return null;
  }
}

/**
 * Save translation to MMKV cache
 */
function setCachedTranslation(
  locale: string,
  namespace: string,
  data: any,
  etag: string
) {
  try {
    const cacheKey = `i18n_cache_${locale}_${namespace}`;
    const cacheData = {
      data,
      etag,
      timestamp: Date.now(),
    };
    i18nStorage.set(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error(`[MockBackend] Error caching translation:`, error);
  }
}

/**
 * Mock Backend Plugin for i18next
 */
export const mockBackend: BackendModule = {
  type: 'backend',

  init: () => {},

  read: async (language: string, namespace: string, callback: ReadCallback) => {
    try {
      // Simulate network delay
      await simulateDelay();

      // Check cache first
      const cached = getCachedTranslation(language, namespace);
      const currentETag = `v2-${language}-${namespace}`;

      // If cache exists with matching ETag, return 304 (use cached data)
      if (cached && cached.etag === currentETag) {
        callback(null, cached.data);
        return;
      }

      // Get translation data from mock backend
      const translationData = mockBackendData[language]?.[namespace];

      // Validate translation exists
      if (!translationData) {
        console.warn(`[MockBackend] No translation for ${language}/${namespace}`);
        callback(null, null); // i18next will use bundled fallback
        return;
      }

      // Validate translation structure (must be object with keys)
      if (typeof translationData !== 'object' || translationData === null) {
        console.error(
          `[MockBackend] Invalid translation structure for ${language}/${namespace}`
        );
        callback(null, null); // Fallback to bundled
        return;
      }

      // Deep clone to prevent mutations
      const validatedData = JSON.parse(JSON.stringify(translationData));

      // Cache the new data
      setCachedTranslation(language, namespace, validatedData, currentETag);

      // Return with success
      callback(null, validatedData);
    } catch (error) {
      // Catch any errors (JSON parse, network simulation, etc.)
      console.error(`[MockBackend] Error loading ${language}/${namespace}:`, error);
      callback(null, null); // Fallback to bundled version
    }
  },
};
