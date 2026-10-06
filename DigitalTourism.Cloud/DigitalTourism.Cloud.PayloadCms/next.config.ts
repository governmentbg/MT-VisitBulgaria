import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import redirects from './redirects.js'
import { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

console.log('NEXT_PUBLIC_SERVER_URL:', NEXT_PUBLIC_SERVER_URL)
console.log('REDIS_URL:', process.env.REDIS_URL)

const nextConfig: NextConfig = {
  output: process.env.NEXT_PRIVATE_STANDALONE ? 'standalone' : undefined,
  cacheHandler: require.resolve('./cache-handler.mjs'),
  cacheMaxMemorySize: process.env.NEXT_PRIVATE_STANDALONE ? 0 : undefined, // Disable in-memory cache when using Redis

  images: {
    minimumCacheTTL: 2592000, // 30 days — Next.js optimized image cache
    imageSizes: [128, 300, 600, 900, 1200, 1400, 1920],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  devIndicators: false,
  reactStrictMode: true,
  trailingSlash: false,
  redirects,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  onDemandEntries: {
    // Log which pages are being compiled
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Adjust as needed
    },
    middlewareClientMaxBodySize: '100mb',
    optimizeCss: true,
    optimizeServerReact: true,
    // Optimize package imports to reduce module count
    optimizePackageImports: [
      '@fluentui/react-icons',
      'lucide-react',
      '@payloadcms/ui',
      'recharts',
      'react-hook-form',
      '@radix-ui/react-select',
      '@radix-ui/react-dialog',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-accordion',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      'date-fns',
      'lexical',
      'next-intl',
      'remotion',
      '@remotion/player',
    ],
    // Turbopack optimizations
    turbo: {
      // Reduce memory usage during development
      memoryLimit: 8192,
    },
  },
  serverExternalPackages: [
    'sharp',
    '@payloadcms/db-postgres',
    'payload',
    // Analytics and monitoring - keep these external (12MB+)
    '@google-analytics/data',
    '@opentelemetry/api',
    '@opentelemetry/sdk-node',
    '@opentelemetry/auto-instrumentations-node',
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/exporter-metrics-otlp-grpc',
    '@grpc/grpc-js',
    'protobufjs',
    'google-gax',
    'google-auth-library',
    // Pino transports: pino.transport() resolves targets dynamically via
    // require.resolve() at runtime — invisible to webpack/NFT static analysis.
    'pino',
    'pino-opentelemetry-transport',
    // Note: date-fns can't be externalized - it's in Payload's transpilePackages
    // The 2.94k date-fns modules will remain bundled
  ],
  // Ensure cache handler is included in standalone output
  outputFileTracingIncludes: {
    '/': ['./cache-handler.mjs'],
  },
}

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
