import { NextResponse } from 'next/server'

/**
 * Apple App Site Association (AASA) file for Universal Links.
 *
 * Served at https://<domain>/.well-known/apple-app-site-association with
 * `Content-Type: application/json` and NO file extension — required by iOS.
 *
 * Values come from environment variables injected by the deploy pipeline so
 * each environment (dev/staging/prod) serves only its own association data:
 *
 *   MOBILE_IOS_TEAM_ID    e.g. "B793B4ZY5P"
 *   MOBILE_IOS_BUNDLE_ID  comma-separated bundle ids,
 *                         e.g. "com.visitbulgaria.app.staging"
 *
 * When the env vars are empty, the endpoint returns an empty details array
 * (still valid) so the build doesn't break while association data is being
 * provisioned.
 */
export async function GET() {
  const teamId = process.env.MOBILE_IOS_TEAM_ID?.trim()
  const bundleIdsEnv = process.env.MOBILE_IOS_BUNDLE_ID?.trim()

  const bundleIds = (bundleIdsEnv ?? '')
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean)

  const appIDs =
    teamId && bundleIds.length > 0 ? bundleIds.map((b) => `${teamId}.${b}`) : []

  const body = {
    applinks: {
      details:
        appIDs.length > 0
          ? [
              {
                appIDs,
                components: [
                  { '/': '/*/attractions/*' },
                  { '/': '/*/events/*' },
                  { '/': '/*/hotels/*' },
                  { '/': '/*/restaurants/*' },
                  { '/': '/*/activities/*' },
                ],
              },
            ]
          : [],
    },
  }

  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
