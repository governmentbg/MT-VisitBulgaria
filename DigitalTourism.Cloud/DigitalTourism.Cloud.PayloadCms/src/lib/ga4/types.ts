import { z } from 'zod'

// GA4 Configuration
export interface GA4Config {
  measurementId: string
  propertyId: string
  credentials: ServiceAccountCredentials | null
  enabled: boolean
}

export interface ServiceAccountCredentials {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

// Custom Event Types
export interface ExperienceViewEvent {
  item_id: string
  item_type: string
  owner_id: string
  city_id: string
  municipality_id: string
}

export interface GA4Event {
  name: string
  params: Record<string, string | number | boolean>
}

// Analytics Data Types
export interface AnalyticsMetric {
  value: number
}

export interface TimeseriesDataPoint {
  date: string
  visitors: number
  pageviews: number
  sessions?: number
}

export interface ExperienceAnalytics {
  experienceId: string
  title: string
  views: number
  uniqueVisitors: number
  itemType?: string
}

// Demographics types
export interface DemographicsItem {
  name: string
  value: number
  percentage: number
}

export interface Demographics {
  countries: DemographicsItem[]
  cities: DemographicsItem[]
}

// Overview metrics (aggregate stats)
export interface OverviewMetrics {
  totalPageViews: number
  totalUsers: number
  totalSessions: number
  avgSessionDuration: number
}

// Date range for queries
export interface DateRange {
  startDate: string // YYYY-MM-DD or relative like '7daysAgo'
  endDate: string // YYYY-MM-DD or 'today'
}

// Traffic sources types
export interface TrafficSourceItem {
  source: string
  medium: string
  sessions: number
  users: number
  percentage: number
}

export interface TrafficSources {
  sources: TrafficSourceItem[]
  totalSessions: number
}

// Enhanced analytics data
export interface AnalyticsData {
  stats: {
    totalViews: AnalyticsMetric
    uniqueVisitors: AnalyticsMetric
    avgSessionDuration: AnalyticsMetric
    sessions?: AnalyticsMetric
  }
  timeseries: TimeseriesDataPoint[]
  topExperiences: ExperienceAnalytics[]
  demographics?: Demographics
  trafficSources?: TrafficSources
}

// Period configuration
export type AnalyticsPeriod = 'today' | 'yesterday' | '7d' | '30d' | '90d' | '12mo'

export interface PeriodConfig {
  startDate: string
  endDate: string
  previousStartDate: string
  previousEndDate: string
  label: string
}

// GA4 Data API Response Schemas
export const MetricValueSchema = z.object({
  value: z.string().transform((v) => parseInt(v, 10) || 0),
})

export const DimensionValueSchema = z.object({
  value: z.string(),
})

export const RowSchema = z.object({
  dimensionValues: z.array(DimensionValueSchema).optional(),
  metricValues: z.array(MetricValueSchema),
})

export const GA4ReportResponseSchema = z.object({
  rows: z.array(RowSchema).optional().default([]),
  rowCount: z.number().optional(),
  metadata: z.object({}).passthrough().optional(),
})

// Role-based filter types
export type RoleFilter = {
  dimensionName: string
  operator: 'EXACT' | 'IN_LIST'
  expressions: string[]
}

export interface FetchGA4DataOptions {
  startDate: string
  endDate: string
  metrics: string[]
  dimensions?: string[]
  dimensionFilter?: {
    filter?: RoleFilter
    andGroup?: { filters: Array<{ filter: RoleFilter }> }
  }
}

// Utility functions for formatting
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

export function formatChange(value: number): string {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${Math.round(value)}%`
}

/**
 * Get period configuration with date ranges
 */
export function getPeriodConfig(period: AnalyticsPeriod): PeriodConfig {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  let startDate: string
  let endDate: string
  let previousStartDate: string
  let previousEndDate: string
  let label: string

  switch (period) {
    case 'today': {
      startDate = todayStr
      endDate = todayStr

      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      previousStartDate = yesterday.toISOString().split('T')[0]
      previousEndDate = previousStartDate

      label = 'Today'
      break
    }
    case 'yesterday': {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      startDate = yesterday.toISOString().split('T')[0]
      endDate = startDate

      const dayBefore = new Date(yesterday)
      dayBefore.setDate(dayBefore.getDate() - 1)
      previousStartDate = dayBefore.toISOString().split('T')[0]
      previousEndDate = previousStartDate

      label = 'Yesterday'
      break
    }
    case '7d': {
      endDate = todayStr
      const start = new Date(now)
      start.setDate(start.getDate() - 6) // 7 days including today
      startDate = start.toISOString().split('T')[0]

      const prevEnd = new Date(start)
      prevEnd.setDate(prevEnd.getDate() - 1)
      previousEndDate = prevEnd.toISOString().split('T')[0]

      const prevStart = new Date(prevEnd)
      prevStart.setDate(prevStart.getDate() - 6)
      previousStartDate = prevStart.toISOString().split('T')[0]

      label = 'Last 7 days'
      break
    }
    case '30d': {
      endDate = todayStr
      const start = new Date(now)
      start.setDate(start.getDate() - 29)
      startDate = start.toISOString().split('T')[0]

      const prevEnd = new Date(start)
      prevEnd.setDate(prevEnd.getDate() - 1)
      previousEndDate = prevEnd.toISOString().split('T')[0]

      const prevStart = new Date(prevEnd)
      prevStart.setDate(prevStart.getDate() - 29)
      previousStartDate = prevStart.toISOString().split('T')[0]

      label = 'Last 30 days'
      break
    }
    case '90d': {
      endDate = todayStr
      const start = new Date(now)
      start.setDate(start.getDate() - 89)
      startDate = start.toISOString().split('T')[0]

      const prevEnd = new Date(start)
      prevEnd.setDate(prevEnd.getDate() - 1)
      previousEndDate = prevEnd.toISOString().split('T')[0]

      const prevStart = new Date(prevEnd)
      prevStart.setDate(prevStart.getDate() - 89)
      previousStartDate = prevStart.toISOString().split('T')[0]

      label = 'Last 90 days'
      break
    }
    case '12mo': {
      endDate = todayStr
      const start = new Date(now)
      start.setFullYear(start.getFullYear() - 1)
      start.setDate(start.getDate() + 1)
      startDate = start.toISOString().split('T')[0]

      const prevEnd = new Date(start)
      prevEnd.setDate(prevEnd.getDate() - 1)
      previousEndDate = prevEnd.toISOString().split('T')[0]

      const prevStart = new Date(prevEnd)
      prevStart.setFullYear(prevStart.getFullYear() - 1)
      previousStartDate = prevStart.toISOString().split('T')[0]

      label = 'Last 12 months'
      break
    }
    default:
      throw new Error(`Unknown period: ${period}`)
  }

  return {
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
    label,
  }
}

/**
 * Create period config from explicit date range
 */
export function getPeriodConfigFromDates(startDate: string, endDate: string): PeriodConfig {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Calculate previous period of same length
  const prevEnd = new Date(start)
  prevEnd.setDate(prevEnd.getDate() - 1)
  const previousEndDate = prevEnd.toISOString().split('T')[0]

  const prevStart = new Date(prevEnd)
  prevStart.setDate(prevStart.getDate() - daysDiff + 1)
  const previousStartDate = prevStart.toISOString().split('T')[0]

  return {
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
    label: `${startDate} to ${endDate}`,
  }
}

/**
 * Fill missing dates in timeseries data
 */
export function fillMissingDates(
  data: TimeseriesDataPoint[],
  startDate: string,
  endDate: string,
): TimeseriesDataPoint[] {
  const dateMap = new Map<string, TimeseriesDataPoint>()

  // Index existing data
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
 * Format date from YYYYMMDD to locale string
 */
export function formatDateLabel(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr

  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)

  const date = new Date(`${year}-${month}-${day}`)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
