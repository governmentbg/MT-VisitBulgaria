declare const EdgeRuntime: string | undefined

export type { Logger, LogLevel, CreateLoggerOptions } from './types'

import { createServerLogger } from './server'
import { createClientLogger } from './client'
import { createEdgeLogger } from './edge'
export { createServerLogger, createClientLogger, createEdgeLogger }

// Runtime-detected factory: picks the right logger based on environment
export function createLogger(
  namespace: string,
  options?: import('./types').CreateLoggerOptions,
): import('./types').Logger {
  if (typeof window !== 'undefined') {
    return createClientLogger(namespace, options)
  }

  if (typeof EdgeRuntime !== 'undefined' || process.env.NEXT_RUNTIME === 'edge') {
    return createEdgeLogger(namespace, options)
  }

  return createServerLogger(namespace, options)
}
