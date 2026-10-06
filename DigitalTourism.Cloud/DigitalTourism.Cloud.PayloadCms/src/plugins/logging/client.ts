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

function resolveClientLevel(optionLevel?: LogLevel): LogLevel {
  const envLevel =
    typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) : undefined
  return envLevel || optionLevel || 'warn'
}

function shouldLog(level: LogLevel, threshold: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[threshold]
}

export function createClientLogger(namespace: string, options?: CreateLoggerOptions): Logger {
  const threshold = resolveClientLevel(options?.level)

  function log(level: LogLevel, msg: string, context?: Record<string, unknown>) {
    if (!shouldLog(level, threshold)) return
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
      return createClientLogger(`${namespace}:${childNs}`, options)
    },
  }
}
