import {QueryClient} from '@tanstack/react-query';
import {createMMKV} from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';
import {CACHE_TIMES} from '../constants';
import {generateSecureKey} from '../utils/secureRandom';

const KEYCHAIN_SERVICE = 'com.visitbulgaria.mmkv-query';
const KEYCHAIN_USERNAME = 'query-cache-key';

type MMKVStorage = ReturnType<typeof createMMKV>;

/**
 * Retrieve or create an encryption key for the query cache, stored in Keychain.
 */
async function getOrCreateQueryCacheKey(): Promise<string> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    if (credentials) {
      return credentials.password;
    }
  } catch (error) {
    console.warn(
      '[QueryClient] Failed to read keychain, generating new key:',
      error,
    );
  }

  const key = generateSecureKey();
  await Keychain.setGenericPassword(KEYCHAIN_USERNAME, key, {
    service: KEYCHAIN_SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
  return key;
}

/**
 * Async factory for the encrypted MMKV query storage.
 * Caches the result after first call.
 */
let cachedStorage: MMKVStorage | null = null;

export async function getQueryStorage(): Promise<MMKVStorage> {
  if (cachedStorage) {
    return cachedStorage;
  }

  const encryptionKey = await getOrCreateQueryCacheKey();
  cachedStorage = createMMKV({
    id: 'query-storage',
    encryptionKey,
  });
  return cachedStorage;
}

/**
 * Configured QueryClient with defaults optimized for the app
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.MEDIUM, // 5 minutes
      gcTime: CACHE_TIMES.LONG, // 10 minutes (formerly cacheTime)
      networkMode: 'online', // Online-first strategy
      retry: 2, // Retry failed queries twice
      refetchOnWindowFocus: false, // Don't refetch on app focus
    },
    mutations: {
      networkMode: 'always',
      retry: 1, // Retry failed mutations once
    },
  },
});
