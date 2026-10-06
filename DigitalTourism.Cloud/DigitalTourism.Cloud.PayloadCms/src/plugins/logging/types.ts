export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'

export interface Logger {
  trace: (msg: string, context?: Record<string, unknown>) => void
  debug: (msg: string, context?: Record<string, unknown>) => void
  info: (msg: string, context?: Record<string, unknown>) => void
  warn: (msg: string, context?: Record<string, unknown>) => void
  error: (msg: string, context?: Record<string, unknown>) => void
  fatal: (msg: string, context?: Record<string, unknown>) => void
  child: (bindings: Record<string, unknown>) => Logger
}

export interface CreateLoggerOptions {
  level?: LogLevel
}
