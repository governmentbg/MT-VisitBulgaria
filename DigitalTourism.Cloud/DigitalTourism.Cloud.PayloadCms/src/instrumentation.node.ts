/**
 * OpenTelemetry instrumentation for Node.js runtime.
 * Configures tracing and metrics with support for:
 * - OTLP export to Aspire Dashboard (local development)
 * - Prometheus metrics endpoint (Kubernetes production)
 *
 * Log export is handled separately by pino-opentelemetry-transport
 * (see plugins/logging/server.ts) which bridges pino output to OTLP.
 */
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import * as grpc from '@grpc/grpc-js'
import * as tls from 'tls'

console.log('[OpenTelemetry] instrumentation.node.ts loaded')
console.log(`[OpenTelemetry] OTEL_EXPORTER_OTLP_ENDPOINT=${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`)
console.log(`[OpenTelemetry] OTEL_SERVICE_NAME=${process.env.OTEL_SERVICE_NAME}`)

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
const prometheusEnabled = process.env.OTEL_METRICS_PROMETHEUS_ENABLED === 'true'
const prometheusPort = parseInt(process.env.OTEL_METRICS_PROMETHEUS_PORT || '9464', 10)

// Function to get server certificate for self-signed cert acceptance
const getServerCertificate = (host: string, port: number): Promise<Buffer | null> => {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host,
        port,
        rejectUnauthorized: false, // Allow self-signed for fetching cert
      },
      () => {
        const cert = socket.getPeerCertificate(true)
        socket.end()

        if (cert && cert.raw) {
          // Convert DER to PEM format
          const pem =
            '-----BEGIN CERTIFICATE-----\n' +
            cert.raw.toString('base64').match(/.{1,64}/g)?.join('\n') +
            '\n-----END CERTIFICATE-----\n'
          console.log('[OpenTelemetry] Retrieved server certificate for TLS')
          resolve(Buffer.from(pem))
        } else {
          console.warn('[OpenTelemetry] Could not retrieve server certificate')
          resolve(null)
        }
      }
    )

    socket.on('error', (err) => {
      console.error('[OpenTelemetry] Error fetching certificate:', err.message)
      resolve(null)
    })

    // Timeout after 5 seconds
    setTimeout(() => {
      socket.destroy()
      resolve(null)
    }, 5000)
  })
}

// Initialize OpenTelemetry (async IIFE for certificate fetching)
;(async () => {
  // Skip instrumentation if no telemetry endpoints are configured
  if (!otlpEndpoint && !prometheusEnabled) {
    console.log('[OpenTelemetry] No telemetry endpoints configured, instrumentation disabled')
    return
  }

  const serviceName = process.env.OTEL_SERVICE_NAME || 'payload-cms'
  const serviceVersion = process.env.npm_package_version || '1.0.0'

  console.log(`[OpenTelemetry] Initializing: service=${serviceName}, otlp=${!!otlpEndpoint}, prometheus=${prometheusEnabled}`)

  // Create resource with service identification
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
  })

  // Parse endpoint and determine if TLS is needed
  const isSecure = otlpEndpoint?.startsWith('https://')
  // Extract host:port from URL (remove protocol)
  const grpcEndpoint = otlpEndpoint?.replace(/^https?:\/\//, '') || ''
  const [host, portStr] = grpcEndpoint.split(':')
  const port = parseInt(portStr || '4317', 10)

  console.log(`[OpenTelemetry] gRPC endpoint: ${grpcEndpoint}, secure: ${isSecure}`)

  // Get server certificate for HTTPS endpoints (self-signed support)
  const rootCert = isSecure ? await getServerCertificate(host, port) : null

  // Configure gRPC credentials
  const credentials = isSecure
    ? grpc.credentials.createSsl(
        rootCert, // Root certificate (server's self-signed cert)
        null, // Private key (not needed for client)
        null, // Certificate chain (not needed for client)
        {
          checkServerIdentity: () => undefined, // Skip hostname verification
        }
      )
    : grpc.credentials.createInsecure()

  // Configure trace exporter (OTLP gRPC)
  const traceExporter = otlpEndpoint
    ? new OTLPTraceExporter({ url: grpcEndpoint, credentials })
    : undefined

  // Configure metric reader based on environment
  let metricReader
  if (prometheusEnabled) {
    // Kubernetes: Use Prometheus exporter that exposes /metrics endpoint
    const prometheusExporter = new PrometheusExporter({ port: prometheusPort })
    metricReader = prometheusExporter
    console.log(`[OpenTelemetry] Prometheus metrics exposed on port ${prometheusPort}/metrics`)
  } else if (otlpEndpoint) {
    // Development: Push metrics to OTLP endpoint (Aspire Dashboard)
    metricReader = new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: grpcEndpoint, credentials }),
      exportIntervalMillis: 10000, // Export metrics every 10 seconds
    })
  }

  // Log export is handled by pino-opentelemetry-transport (configured in plugins/logging/server.ts)
  // which runs as a pino worker transport and sends logs via OTLP gRPC to the collector.
  // The @opentelemetry/instrumentation-pino (via auto-instrumentations-node below) injects
  // trace context (traceId, spanId) into pino log records, enabling log-to-trace correlation.

  // Create and start the OpenTelemetry SDK
  const sdk = new NodeSDK({
    resource,
    traceExporter,
    metricReader,
    instrumentations: [
      getNodeAutoInstrumentations({
        // Disable file system instrumentation to reduce noise
        '@opentelemetry/instrumentation-fs': { enabled: false },
        // Configure HTTP instrumentation
        '@opentelemetry/instrumentation-http': {
          ignoreIncomingRequestHook: (request) => {
            const url = request.url || ''
            // Skip health check and metrics endpoints from traces
            return (
              url.includes('/health') ||
              url.includes('/alive') ||
              url.includes('/metrics') ||
              url.includes('/_next/static')
            )
          },
        },
        // Enable PostgreSQL instrumentation for database queries
        '@opentelemetry/instrumentation-pg': { enabled: true },
        // Enable Redis instrumentation for cache operations
        '@opentelemetry/instrumentation-ioredis': { enabled: true },
        '@opentelemetry/instrumentation-redis': { enabled: true },
      }),
    ],
  })

  sdk.start()

  // Graceful shutdown on process termination
  const shutdown = () => {
    sdk
      .shutdown()
      .then(() => console.log('[OpenTelemetry] SDK shut down successfully'))
      .catch((error) => console.error('[OpenTelemetry] Error shutting down SDK:', error))
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)

  console.log(`[OpenTelemetry] Initialized successfully for service: ${serviceName}`)
  console.log(`[OpenTelemetry] OTLP gRPC endpoint: ${grpcEndpoint} (secure: ${isSecure})`)
})()
