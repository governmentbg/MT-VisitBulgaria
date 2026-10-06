import type { Logger, LogLevel, CreateLoggerOptions } from './types'

const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 0,
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
  silent: 100,
}

export function createEdgeLogger(namespace: string, options?: CreateLoggerOptions): Logger {
  const threshold = (process.env.LOG_LEVEL as LogLevel) || options?.level || 'info'

  function log(level: LogLevel, msg: string, context?: Record<string, unknown>) {
    if (LOG_LEVELS[level] < LOG_LEVELS[threshold]) return
    const prefix = `[${namespace}]`
    const consoleFn =
      level === 'fatal' ? 'error' : level === 'trace' ? 'debug' : (level as 'debug' | 'info' | 'warn' | 'error')
    if (context) {
      console[consoleFn](prefix, msg, context)
    } else {
      console[consoleFn](prefix, msg)
    }
  }

  return {
    trace: (msg, ctx) => log('trace', msg, ctx),
    debug: (msg, ctx) => log('debug', msg, ctx),
    info: (msg, ctx) => log('info', msg, ctx),
    warn: (msg, ctx) => log('warn', msg, ctx),
    error: (msg, ctx) => log('error', msg, ctx),
    fatal: (msg, ctx) => log('fatal', msg, ctx),
    child: (bindings) => {
      const childNs = Object.entries(bindings)
        .map(([k, v]) => `${k}=${v}`)
        .join(',')
      return createEdgeLogger(`${namespace}:${childNs}`, options)
    },
  }
}
