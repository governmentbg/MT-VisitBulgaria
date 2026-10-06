import type { GA4Config } from '@/lib/ga4/types'
import { parseGA4Credentials } from '@/lib/ga4/server'

/**
 * Get GA4 configuration from environment variables
 * Used for frontend tracking script injection
 */
export function getGA4Config(): GA4Config {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''
  const propertyId = process.env.GA4_PROPERTY_ID || ''
  const credentialsBase64 = process.env.GA4_CREDENTIALS_JSON || ''

  const credentials = parseGA4Credentials(credentialsBase64)

  return {
    enabled: Boolean(measurementId),
    measurementId,
    propertyId,
    credentials,
  }
}
