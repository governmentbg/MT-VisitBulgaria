import React, {useEffect, useState} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
import type {Persister} from '@tanstack/query-persist-client-core';
import {queryClient, getQueryStorage} from '../services/queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider with persistence
 *
 * Wraps the app with React Query's QueryClientProvider and enables
 * query persistence using encrypted MMKV storage (key stored in Keychain).
 */
export function QueryProvider({children}: QueryProviderProps) {
  const [persister, setPersister] = useState<Persister | null>(null);

  useEffect(() => {
    // In dev builds, skip MMKV persistence — always fetch fresh data
    if (__DEV__) return;

    let cancelled = false;
    getQueryStorage().then(storage => {
      if (cancelled) return;
      setPersister(
        createAsyncStoragePersister({
          storage: {
            getItem: async (key: string) => {
              const value = storage.getString(key);
              return value ?? null;
            },
            setItem: async (key: string, value: string) => {
              storage.set(key, value);
            },
            removeItem: async (key: string) => {
              (storage as unknown as {delete: (k: string) => void}).delete(key);
            },
          },
          throttleTime: 1000,
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Dev mode or persister not yet initialized — use plain provider (no persistence)
  if (__DEV__ || !persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        dehydrateOptions: {
          shouldDehydrateQuery: query => {
            // Only persist successful queries
            return query.state.status === 'success';
          },
        },
      }}
      onSuccess={() => {}}>
      {children}
    </PersistQueryClientProvider>
  );
}
