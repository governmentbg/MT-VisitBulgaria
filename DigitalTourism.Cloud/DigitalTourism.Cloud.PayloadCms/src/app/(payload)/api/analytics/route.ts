import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { createLogger } from '@/plugins/logging'
import type { UserRole } from '@/auth/keycloak'
import {
  buildRoleFilter,
  fetchAnalyticsData,
  getPeriodConfigFromDates,
  parseGA4Credentials,
  type GA4Config,
  type ExperienceAnalytics,
  type RoleFilter,
} from '@/lib/ga4/server'
import { EXPERIENCE_SLUGS } from '@/collections/Experiences/constants'
import type { PeriodConfig } from '@/lib/ga4/types'

const logger = createLogger('api:analytics')

// ============================================================================
// Configuration
// ============================================================================

const CACHE_TTL_SECONDS = 12 * 60 * 60 // 12 hours

// ============================================================================
// GA4 Configuration (from environment variables only)
// ============================================================================

function getGA4Config(): GA4Config {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''
  const propertyId = process.env.GA4_PROPERTY_ID || ''
  const credentialsBase64 = process.env.GA4_CREDENTIALS_JSON || ''

  const credentials = parseGA4Credentials(credentialsBase64)

  const enabled = Boolean(measurementId) && Boolean(propertyId) && Boolean(credentials)
  return { enabled, measurementId, propertyId, credentials }
}

// ============================================================================
// Data Enrichment
// ============================================================================

async function enrichExperiencesWithTitles(
  experiences: ExperienceAnalytics[],
): Promise<ExperienceAnalytics[]> {
  if (!experiences.length) return experiences

  try {
    const payload = await getPayload({ config: configPromise })
    const ids = experiences.map((e) => parseInt(e.experienceId, 10)).filter((id) => !isNaN(id))

    if (!ids.length) return experiences

    // Search all experience collections since we don't know which collection the IDs belong to
    const results = await Promise.all(
      EXPERIENCE_SLUGS.map((slug) =>
        payload.find({
          collection: slug,
          where: { id: { in: ids } },
          limit: ids.length,
          select: { id: true, title: true },
        }),
      ),
    )

    const titleMap = new Map(
      results.flatMap((result) => result.docs.map((doc) => [String(doc.id), doc.title || ''])),
    )

    return experiences.map((exp) => ({
      ...exp,
      title: titleMap.get(exp.experienceId) || exp.title,
    }))
  } catch (error) {
    logger.error('Error enriching experience titles', { error: error instanceof Error ? error.message : String(error) })
    return experiences
  }
}

// ============================================================================
// Cached Analytics Fetcher
// ============================================================================

interface AnalyticsFetchParams {
  startDate: string
  endDate: string
  roleFilter: RoleFilter | null
}

function createCachedAnalyticsFetcher(ga4Config: GA4Config) {
  return unstable_cache(
    async (params: AnalyticsFetchParams) => {
      const { startDate, endDate, roleFilter } = params

      // Build period config from dates
      const periodConfig: PeriodConfig = getPeriodConfigFromDates(startDate, endDate)

      // Fetch analytics data
      const analyticsData = await fetchAnalyticsData(ga4Config, periodConfig, roleFilter)

      if (!analyticsData) {
        return null
      }

      // Enrich experiences with titles (not cached separately to keep data fresh)
      const enrichedExperiences = await enrichExperiencesWithTitles(analyticsData.topExperiences)

      return {
        stats: analyticsData.stats,
        timeseries: analyticsData.timeseries,
        topExperiences: enrichedExperiences,
        demographics: analyticsData.demographics,
        trafficSources: analyticsData.trafficSources,
      }
    },
    ['analytics-data'],
    {
      revalidate: CACHE_TTL_SECONDS,
      tags: ['analytics'],
    },
  )
}

// ============================================================================
// Request Validation
// ============================================================================

function validateDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

// ============================================================================
// User Role Helpers
// ============================================================================

function getUserRole(userRoles: string[]): UserRole {
  if (userRoles.includes('admin')) return 'admin'
  if (userRoles.includes('tourism-curator')) return 'tourism-curator'
  if (userRoles.includes('municipal-moderator')) return 'municipal-moderator'
  return 'business-owner'
}

// ============================================================================
// Route Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const payload = await getPayload({ config: configPromise })
    const cookieHeader = request.headers.get('cookie') || ''
    const { user } = await payload.auth({
      headers: new Headers({ cookie: cookieHeader }),
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: startDate and endDate' },
        { status: 400 },
      )
    }

    if (!validateDateFormat(startDate) || !validateDateFormat(endDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 },
      )
    }

    // Get user info for role-based filtering
    const userRoles: string[] =
      user.collection === 'users' && 'roles' in user ? (user.roles as string[]) || [] : []
    const userId = String(user.id)
    const municipalityIds: string[] = (() => {
      if (user.collection !== 'users' || !('assignedMunicipality' in user)) return []
      const raw = user.assignedMunicipality as { id: number } | number | null
      if (!raw) return []
      const id = typeof raw === 'object' ? raw.id : raw
      return id != null ? [String(id)] : []
    })()

    // Determine user's effective role and build filter
    const effectiveRole = getUserRole(userRoles)
    const roleFilter = buildRoleFilter(effectiveRole, userId, municipalityIds)

    // Get GA4 configuration
    const ga4Config = getGA4Config()

    if (!ga4Config.enabled) {
      return NextResponse.json(
        { error: 'GA4 is not configured. Please set GA4_PROPERTY_ID, NEXT_PUBLIC_GA4_MEASUREMENT_ID, and GA4_CREDENTIALS_JSON environment variables.' },
        { status: 503 },
      )
    }

    // Fetch cached analytics data
    const fetchAnalytics = createCachedAnalyticsFetcher(ga4Config)
    const analyticsData = await fetchAnalytics({
      startDate,
      endDate,
      roleFilter,
    })

    if (!analyticsData) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 },
      )
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    logger.error('Analytics API error', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
