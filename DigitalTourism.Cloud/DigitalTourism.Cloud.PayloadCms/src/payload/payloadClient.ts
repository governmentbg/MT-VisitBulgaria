import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'

let cached = (global as any)._payload

if (!cached) {
  cached = (global as any)._payload = { client: null, promise: null }
}

export const getPayloadClient = async (): Promise<Payload> => {
  if (cached.client) return cached.client
  if (!cached.promise) {
    cached.promise = getPayload({ config })
  }
  cached.client = await cached.promise
  return cached.client
}

/** Clear the cached client so the next call creates a fresh one (useful after HMR) */
export const resetPayloadClient = () => {
  cached.client = null
  cached.promise = null
}
