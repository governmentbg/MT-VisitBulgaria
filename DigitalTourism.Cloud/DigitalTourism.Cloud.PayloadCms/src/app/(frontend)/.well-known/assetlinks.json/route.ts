import { NextResponse } from 'next/server'

/**
 * Android App Links (Digital Asset Links) file.
 *
 * Served at https://<domain>/.well-known/assetlinks.json with
 * `Content-Type: application/json`.
 *
 * Values come from environment variables injected by the deploy pipeline so
 * each environment (dev/staging/prod) serves only its own association data:
 *
 *   MOBILE_ANDROID_PACKAGE_NAME         e.g. "com.visitbulgaria.app.staging"
 *   MOBILE_ANDROID_SHA256_FINGERPRINTS  comma-separated SHA-256 fingerprints
 *
 * When the env vars are empty, the endpoint returns an empty JSON array
 * (still valid) so the build doesn't break while association data is being
 * provisioned.
 */
export async function GET() {
  const packageName = process.env.MOBILE_ANDROID_PACKAGE_NAME?.trim()
  const fingerprintsEnv = process.env.MOBILE_ANDROID_SHA256_FINGERPRINTS?.trim()

  const fingerprints = (fingerprintsEnv ?? '')
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)

  const body =
    packageName && fingerprints.length > 0
      ? [
          {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
              namespace: 'android_app',
              package_name: packageName,
              sha256_cert_fingerprints: fingerprints,
            },
          },
        ]
      : []

  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
