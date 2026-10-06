/**
 * Server-side GA4 Data API functions
 * Uses @google-analytics/data SDK - DO NOT import in client components
 * All queries filter by item_view events for consistent metrics
 */

import { createLogger } from '@/plugins/logging'
import type { UserRole } from '@/auth/keycloak'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import type {
  GA4Config,
  ServiceAccountCredentials,
  AnalyticsData,
  TimeseriesDataPoint,
  ExperienceAnalytics,
  Demographics,
  DemographicsItem,
  TrafficSources,
  RoleFilter,
  PeriodConfig,
  OverviewMetrics,
  DateRange,
} from './types'
import { getPeriodConfigFromDates } from './types'

export { getPeriodConfigFromDates }

// Re-export types
export type {
  GA4Config,
  ServiceAccountCredentials,
  AnalyticsData,
  TimeseriesDataPoint,
  ExperienceAnalytics,
  Demographics,
  TrafficSources,
  RoleFilter,
  PeriodConfig,
  OverviewMetrics,
  DateRange,
}

// Default date range: last 30 days -> Again -> Unused -> do we need this ?
// const DEFAULT_DATE_RANGE: DateRange = {
//   startDate: '30daysAgo',
//   endDate: 'today',
// }

// Helper to create empty overview metrics
function _createEmptyOverviewMetrics(): OverviewMetrics {
  return {
    totalPageViews: 0,
    totalUsers: 0,
    totalSessions: 0,
    avgSessionDuration: 0,
  }
}

const logger = createLogger('ga4')

/**
 * Parse GA4 credentials from a base64-encoded JSON string
 * @param credentialsBase64 - Base64-encoded JSON string of service account credentials
 * @returns Parsed credentials or null if parsing fails
 */
export function parseGA4Credentials(credentialsBase64: string): ServiceAccountCredentials | null {
  if (!credentialsBase64) return null

  try {
    // Decode base64 to JSON string, then parse
    const jsonString = Buffer.from(credentialsBase64, 'base64').toString('utf-8')
    return JSON.parse(jsonString) as ServiceAccountCredentials
  } catch {
    logger.error('Failed to parse GA4 credentials (expected base64-encoded JSON)')
    return null
  }
}

/**
 * Get GA4 configuration from environment variables
 * Settings collection values should override these in production
 */
export function getGA4ConfigFromEnv(): GA4Config {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''
  const propertyId = process.env.GA4_PROPERTY_ID || ''
  const credentialsBase64 = process.env.GA4_CREDENTIALS_JSON || ''

  const credentials = parseGA4Credentials(credentialsBase64)

  return {
    measurementId,
    propertyId,
    credentials,
    enabled: Boolean(measurementId),
  }
}

/**
 * Build role-based dimension filter for GA4 Data API
 */
export function buildRoleFilter(
  userRole: UserRole,
  userId?: string,
  assignedMunicipalities?: string[],
): RoleFilter | null {
  switch (userRole) {
    case 'admin':
    case 'tourism-curator':
      // No filter - full access
      return null

    case 'business-owner':
      if (!userId) return null
      return {
        dimensionName: 'customEvent:owner_id',
        operator: 'EXACT',
        expressions: [userId],
      }

    case 'municipal-moderator':
      if (!assignedMunicipalities?.length) return null
      return {
        dimensionName: 'customEvent:municipality_id',
        operator: 'IN_LIST',
        expressions: assignedMunicipalities,
      }

    default:
      return null
  }
}

/**
 * Create an authenticated GA4 Data API client
 */
function createGA4Client(credentials: ServiceAccountCredentials): BetaAnalyticsDataClient {
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  })
}

/**
 * Build dimension filter for item_view events with optional role filter
 * All queries use item_view as the base event filter
 */
function buildItemViewFilter(roleFilter: RoleFilter | null): object {
  const expressions: object[] = [
    {
      filter: {
        fieldName: 'eventName',
        stringFilter: {
          value: 'item_view',
          matchType: 'EXACT',
        },
      },
    },
  ]

  // Add role-based filter if present
  if (roleFilter) {
    if (roleFilter.operator === 'EXACT') {
      expressions.push({
        filter: {
          fieldName: roleFilter.dimensionName,
          stringFilter: {
            value: roleFilter.expressions[0],
            matchType: 'EXACT',
          },
        },
      })
    } else if (roleFilter.operator === 'IN_LIST') {
      expressions.push({
        filter: {
          fieldName: roleFilter.dimensionName,
          inListFilter: {
            values: roleFilter.expressions,
          },
        },
      })
    }
  }

  // Single filter or AND group
  if (expressions.length === 1) {
    return expressions[0]
  }

  return {
    andGroup: { expressions },
  }
}

/**
 * Fill missing dates in timeseries with zero values
 */
function fillMissingDates(
  data: TimeseriesDataPoint[],
  startDate: string,
  endDate: string,
): TimeseriesDataPoint[] {
  const dateMap = new Map<string, TimeseriesDataPoint>()

  // Index existing data by date
  for (const point of data) {
    dateMap.set(point.date, point)
  }

  // Generate all dates in range
  const result: TimeseriesDataPoint[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0].replace(/-/g, '')
    const existing = dateMap.get(dateStr)

    result.push(
      existing || {
        date: dateStr,
        visitors: 0,
        pageviews: 0,
        sessions: 0,
      },
    )

    current.setDate(current.getDate() + 1)
  }

  return result
}

/**
 * Fetch comprehensive analytics data from item_view events
 * All metrics are derived from item_view events for consistency
 */
export async function fetchAnalyticsData(
  config: GA4Config,
  periodConfig: PeriodConfig,
  roleFilter: RoleFilter | null,
): Promise<AnalyticsData | null> {
  if (!config.credentials || !config.propertyId) {
    logger.error('GA4 credentials or property ID not configured')
    return null
  }

  logger.debug('Fetching analytics data', { periodConfig, roleFilter })

  try {
    const client = createGA4Client(config.credentials)
    const propertyId = `properties/${config.propertyId}`
    const itemViewFilter = buildItemViewFilter(roleFilter)

    // GA4 batch API is limited to 5 requests per batch, so we split into 2 batches
    // All queries filter by item_view events
    // Batch 1: Overview stats, Timeseries, Top experiences, Country, City (5 reports)
    const batch1Requests = [
      // 0: Overview stats - all metrics from item_view events
      {
        dateRanges: [{ startDate: periodConfig.startDate, endDate: periodConfig.endDate }],
        metrics: [
          { name: 'eventCount' },
          { name: 'totalUsers' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
        ],
        dimensionFilter: itemViewFilter,
      },
      // 1: Timeseries - daily breakdown
      {
        dateRanges: [{ startDate: periodConfig.startDate, endDate: periodConfig.endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }, { name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
        dimensionFilter: itemViewFilter,
      },
      // 2: Top experiences by item_id
      {
        dateRanges: [{ startDate: periodConfig.startDate, endDate: periodConfig.endDate }],
        dimensions: [{ name: 'customEvent:item_id' }, { name: 'customEvent:item_type' }],
        metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 10,
        dimensionFilter: itemViewFilter,
      },
      // 3: Country breakdown
      {
        dateRanges: [{ startDate: periodConfig.startDate, endDate: periodConfig.endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 10,
        dimensionFilter: itemViewFilter,
      },
      // 4: City breakdown
      {
        dateRanges: [{ startDate: periodConfig.startDate, endDate: periodConfig.endDate }],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 10,
        dimensionFilter: itemViewFilter,
      },
    ]

    // Batch 2: Traffic sources (1 report)
    const batch2Requests = [
      // 0: Traffic sources
      {
        dateRanges: [{ startDate: periodConfig.startDate, endDate: periodConfig.endDate }],
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
        dimensionFilter: itemViewFilter,
      },
    ]

    logger.debug('Fetching analytics in 2 batch requests', {
      batch1: batch1Requests.length,
      batch2: batch2Requests.length,
    })

    // Execute both batches in parallel
    const [[batch1Response], [batch2Response]] = await Promise.all([
      client.batchRunReports({ property: propertyId, requests: batch1Requests }),
      client.batchRunReports({ property: propertyId, requests: batch2Requests }),
    ])

    const reports1 = batch1Response.reports || []
    const reports2 = batch2Response.reports || []

    // Parse overview stats (batch1, report 0)
    const statsRow = reports1[0]?.rows?.[0]
    const stats = {
      eventCount: parseInt(statsRow?.metricValues?.[0]?.value || '0', 10),
      totalUsers: parseInt(statsRow?.metricValues?.[1]?.value || '0', 10),
      sessions: parseInt(statsRow?.metricValues?.[2]?.value || '0', 10),
      avgSessionDuration: parseFloat(statsRow?.metricValues?.[3]?.value || '0'),
    }

    // Parse timeseries (batch1, report 1)
    const timeseriesRows = reports1[1]?.rows || []
    const timeseries: TimeseriesDataPoint[] = timeseriesRows.map((row) => ({
      date: row.dimensionValues?.[0]?.value || '',
      pageviews: parseInt(row.metricValues?.[0]?.value || '0', 10),
      visitors: parseInt(row.metricValues?.[1]?.value || '0', 10),
      sessions: parseInt(row.metricValues?.[2]?.value || '0', 10),
    }))

    // Parse top experiences (batch1, report 2)
    const experienceRows = reports1[2]?.rows || []
    const topExperiences: ExperienceAnalytics[] = experienceRows.map((row) => ({
      experienceId: row.dimensionValues?.[0]?.value || '',
      itemType: row.dimensionValues?.[1]?.value || '',
      title: '',
      views: parseInt(row.metricValues?.[0]?.value || '0', 10),
      uniqueVisitors: parseInt(row.metricValues?.[1]?.value || '0', 10),
    }))

    // Helper to parse demographic data
    type ReportRows = (typeof reports1)[number]['rows']
    const parseDemographic = (rows: ReportRows): DemographicsItem[] => {
      const rowsArray = rows || []
      const total = rowsArray.reduce(
        (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
        0,
      )
      return rowsArray.map((row) => {
        const value = parseInt(row.metricValues?.[0]?.value || '0', 10)
        return {
          name: row.dimensionValues?.[0]?.value || '(unknown)',
          value,
          percentage: total > 0 ? (value / total) * 100 : 0,
        }
      })
    }

    // Parse demographics
    const demographics: Demographics = {
      countries: parseDemographic(reports1[3]?.rows),
      cities: parseDemographic(reports1[4]?.rows),
    }

    // Parse traffic sources (batch2, report 0)
    const trafficRows = reports2[0]?.rows || []
    const totalSessions = trafficRows.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0', 10),
      0,
    )
    const trafficSources: TrafficSources = {
      sources: trafficRows.map((row) => {
        const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10)
        return {
          source: row.dimensionValues?.[0]?.value || '(direct)',
          medium: row.dimensionValues?.[1]?.value || '(none)',
          sessions,
          users: parseInt(row.metricValues?.[1]?.value || '0', 10),
          percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0,
        }
      }),
      totalSessions,
    }

    // Fill missing dates in timeseries
    const filledTimeseries = fillMissingDates(
      timeseries,
      periodConfig.startDate,
      periodConfig.endDate,
    )

    logger.debug('Batch response parsed', {
      eventCount: stats.eventCount,
      totalUsers: stats.totalUsers,
      sessions: stats.sessions,
      timeseriesCount: timeseries.length,
      experiencesCount: topExperiences.length,
      trafficSourcesCount: trafficSources.sources.length,
    })

    return {
      stats: {
        totalViews: { value: stats.eventCount },
        uniqueVisitors: { value: stats.totalUsers },
        sessions: { value: stats.sessions },
        avgSessionDuration: { value: stats.avgSessionDuration },
      },
      timeseries: filledTimeseries,
      topExperiences,
      demographics,
      trafficSources,
    }
  } catch (error) {
    logger.error('Error fetching GA4 analytics data', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
