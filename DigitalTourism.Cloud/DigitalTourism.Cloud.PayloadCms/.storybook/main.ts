import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-designs'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    // Server-side deps (payload, drizzle, grpc, pino, etc.) leak Node.js
    // built-in modules into the browser bundle. Stub them all out.
    const nodeBuiltins = [
      'assert', 'async_hooks', 'buffer', 'child_process', 'cluster',
      'console', 'constants', 'crypto', 'dgram', 'diagnostics_channel',
      'dns', 'domain', 'events', 'fs', 'fs/promises', 'http', 'http2',
      'https', 'module', 'net', 'os', 'path', 'perf_hooks', 'process',
      'punycode', 'querystring', 'readline', 'repl', 'stream',
      'string_decoder', 'sys', 'timers', 'tls', 'tty', 'url', 'util',
      'v8', 'vm', 'worker_threads', 'zlib',
    ]

    const fallback: Record<string, false> = {}
    for (const mod of nodeBuiltins) {
      fallback[mod] = false
    }

    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        ...fallback,
      },
    }

    // Handle `node:*` prefixed imports by adding a scheme handler
    // that returns an empty module
    config.module = {
      ...config.module,
      rules: [
        ...(config.module?.rules || []),
        {
          scheme: 'node',
          resolve: { preferRelative: true },
          use: {
            loader: 'raw-loader',
            options: {},
          },
          type: 'javascript/auto',
        },
      ],
    }

    // Externalize all node: imports as empty modules
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : config.externals ? [config.externals] : []),
      ({ request }: { request?: string }, callback: (err: null, result?: string) => void) => {
        if (request && request.startsWith('node:')) {
          return callback(null, '{}')
        }
        callback(null)
      },
    ]

    return config
  },
}

export default config
