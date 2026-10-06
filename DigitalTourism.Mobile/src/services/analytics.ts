import Config from 'react-native-config';
import {createMMKV} from 'react-native-mmkv';

const GA4_MEASUREMENT_ID = Config.GA4_MEASUREMENT_ID || '';
const GA4_API_SECRET = Config.GA4_API_SECRET || '';
const GA4_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

// Persistent client ID — survives app restarts, unique per install
const analyticsStorage = createMMKV({id: 'analytics-storage'});

function getClientId(): string {
  let id = analyticsStorage.getString('client_id');
  if (!id) {
    id = `${Date.now()}.${Math.random().toString(36).substring(2, 9)}`;
    analyticsStorage.set('client_id', id);
  }
  return id;
}

async function sendEvent(name: string, params?: Record<string, string | number | boolean | undefined>) {
  if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) return;

  try {
    await fetch(
      `${GA4_ENDPOINT}?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          client_id: getClientId(),
          events: [{name, params: {...params, engagement_time_msec: '1'}}],
        }),
      },
    );
  } catch {
    // Silently fail — analytics should never crash the app
  }
}

/**
 * Analytics service — tracks user interactions via GA4 Measurement Protocol.
 */
export const analytics = {
  /** Track a screen view */
  trackScreenView(screenName: string) {
    sendEvent('page_view', {page_title: screenName});
  },

  /** Track an experience detail view */
  trackExperienceView(id: string, type: string, city?: string) {
    sendEvent('item_view', {item_id: id, item_type: type, city_name: city});
  },

  /** Track a search query */
  trackSearch(query: string, resultsCount: number) {
    sendEvent('search', {search_term: query, results_count: resultsCount});
  },

  /** Track a generic event */
  trackEvent(name: string, params?: Record<string, string | number | boolean | undefined>) {
    sendEvent(name, params);
  },
};
