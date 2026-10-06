/**
 * Next.js instrumentation entry point.
 * This file is automatically loaded by Next.js before the application starts.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  console.log(`[Instrumentation] register() called, NEXT_RUNTIME=${process.env.NEXT_RUNTIME}`)

  // Only initialize OpenTelemetry on the Node.js server runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Loading OpenTelemetry for Node.js runtime...')
    await import('./instrumentation.node')
  }
}
