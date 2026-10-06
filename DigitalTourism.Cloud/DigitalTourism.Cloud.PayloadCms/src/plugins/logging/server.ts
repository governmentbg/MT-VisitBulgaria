import pino from 'pino'
import type { Logger as PinoLogger } from 'pino'
import PinoPretty from 'pino-pretty'
// Side-effect import: ensures webpack/NFT traces this package into standalone output.
// Without this, the string 'pino-opentelemetry-transport' in pino.transport() targets
// is invisible to static analysis and the module is missing at runtime.
import 'pino-opentelemetry-transport'
import type { Logger, LogLevel, CreateLoggerOptions } from './types'

const isDev = process.env.NODE_ENV !== 'production'
const otelEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT

function resolveLevel(optionLevel?: LogLevel): string {
  return process.env.LOG_LEVEL || optionLevel || 'info'
}

let rootLogger: PinoLogger | null = null

function getRootLogger(level: string): PinoLogger {
  if (!rootLogger) {
    if (isDev) {
      // Use pino-pretty as a synchronous destination stream (not a worker transport)
      // to avoid "worker has exited" errors in Next.js dev mode
      rootLogger = pino(
        { level },
        PinoPretty({
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:HH:MM:ss',
        }),
      )
    } else if (otelEndpoint) {
      // Production with OTEL: send logs to both stdout (kubectl logs) and
      // OpenTelemetry collector (via OTEL Collector -> Loki).
      // The pino-opentelemetry-transport reads OTEL_EXPORTER_OTLP_ENDPOINT and
      // OTEL_EXPORTER_OTLP_PROTOCOL from environment variables automatically.
      // The @opentelemetry/instrumentation-pino (via auto-instrumentations-node)
      // injects trace context (traceId, spanId) into log records, enabling
      // log-to-trace correlation in Grafana (Loki -> Tempo).
      const transport = pino.transport({
        targets: [
          {
            target: 'pino/file',
            options: { destination: 1 }, // stdout - visible via kubectl logs
          },
          {
            target: 'pino-opentelemetry-transport',
            options: {
              logRecordProcessorOptions: [
                {
                  recordProcessorType: 'batch',
                  exporterOptions: { protocol: 'grpc' },
                },
              ],
            },
          },
        ],
      })
      rootLogger = pino({ level }, transport)
    } else {
      // Production without OTEL endpoint configured: stdout only
      rootLogger = pino({ level })
    }
  }
  return rootLogger
}

function wrapPinoLogger(pinoLogger: PinoLogger): Logger {
  return {
    trace: (msg, ctx) => (ctx ? pinoLogger.trace(ctx, msg) : pinoLogger.trace(msg)),
    debug: (msg, ctx) => (ctx ? pinoLogger.debug(ctx, msg) : pinoLogger.debug(msg)),
    info: (msg, ctx) => (ctx ? pinoLogger.info(ctx, msg) : pinoLogger.info(msg)),
    warn: (msg, ctx) => (ctx ? pinoLogger.warn(ctx, msg) : pinoLogger.warn(msg)),
    error: (msg, ctx) => (ctx ? pinoLogger.error(ctx, msg) : pinoLogger.error(msg)),
    fatal: (msg, ctx) => (ctx ? pinoLogger.fatal(ctx, msg) : pinoLogger.fatal(msg)),
    child: (bindings) => wrapPinoLogger(pinoLogger.child(bindings)),
  }
}

export function createServerLogger(namespace: string, options?: CreateLoggerOptions): Logger {
  const level = resolveLevel(options?.level)
  const root = getRootLogger(level)
  const child = root.child({ module: namespace })
  return wrapPinoLogger(child)
}
