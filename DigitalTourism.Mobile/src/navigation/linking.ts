import {Linking} from 'react-native';
import type {LinkingOptions} from '@react-navigation/native';
import type {RootStackParamList} from './types';

/**
 * React Navigation deep linking config — Universal Links (iOS) and
 * App Links (Android) only.
 *
 * Paths match the Next.js frontend routing in the Payload CMS:
 *   /{locale}/{type}/{slug}
 *
 * Detail screens take a `{id: string}` param. Because the C# API service
 * auto-detects numeric ids vs. slugs (see `createEntityApi.getById`), we
 * pass the URL slug straight into the `id` slot without any screen changes.
 *
 * IMPORTANT — OAuth redirect isolation:
 * We override `getInitialURL` and `subscribe` to *explicitly ignore any URL
 * that isn't HTTPS*. The custom `visitbulgaria-dev://callback?...` scheme
 * used by Keycloak/react-native-app-auth must pass through to the OAuth
 * library untouched. Without this filter, React Navigation's linking module
 * would observe the OAuth redirect URL (even though it doesn't match any
 * prefix) and could interfere with the cold-start OAuth callback delivery.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'https://visitbulgaria.com',
    'https://visitbulgaria.site',
  ],
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (!url || !url.startsWith('https://')) {
      return null;
    }
    return url;
  },
  subscribe(listener) {
    const subscription = Linking.addEventListener('url', ({url}) => {
      if (url?.startsWith('https://')) {
        listener(url);
      }
    });
    return () => subscription.remove();
  },
  config: {
    screens: {
      AttractionDetail: {path: ':locale/attractions/:id'},
      EventDetail:      {path: ':locale/events/:id'},
      HotelDetail:      {path: ':locale/hotels/:id'},
      RestaurantDetail: {path: ':locale/restaurants/:id'},
      ActivityDetail:   {path: ':locale/activities/:id'},
    },
  },
};
