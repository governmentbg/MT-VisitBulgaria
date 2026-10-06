'use client'

import React, { useEffect, useState } from 'react'
import { SelectInput, useTranslation } from '@payloadcms/ui'
import type { OptionObject } from 'payload'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import {
  formatNumber,
  formatDuration,
  formatPercentage,
  formatDateLabel,
  type AnalyticsData,
  type TrafficSources,
  type DemographicsItem,
} from '@/lib/ga4'
import { analyticsLabels } from '@/i18n/admin'
import type { LocalizedLabel } from '@/i18n/admin'
import './index.scss'

// Helper to get localized label based on i18n language
function useLabel(label: LocalizedLabel): string {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('bg') ? 'bg' : 'en'
  return label[lang]
}

// No props needed - user info is determined server-side from the authenticated user

function usePeriodOptions(): OptionObject[] {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('bg') ? 'bg' : 'en'

  return [
    { label: analyticsLabels.periodToday[lang], value: 'today' },
    { label: analyticsLabels.periodYesterday[lang], value: 'yesterday' },
    { label: analyticsLabels.period7d[lang], value: '7d' },
    { label: analyticsLabels.period30d[lang], value: '30d' },
    { label: analyticsLabels.period90d[lang], value: '90d' },
    { label: analyticsLabels.period12mo[lang], value: '12mo' },
  ]
}

/**
 * Convert period selector value to date range
 */
function periodToDateRange(period: string): { startDate: string; endDate: string } {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  switch (period) {
    case 'today':
      return { startDate: todayStr, endDate: todayStr }

    case 'yesterday': {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      return { startDate: yesterdayStr, endDate: yesterdayStr }
    }

    case '7d': {
      const start = new Date(now)
      start.setDate(start.getDate() - 6)
      return { startDate: start.toISOString().split('T')[0], endDate: todayStr }
    }

    case '30d': {
      const start = new Date(now)
      start.setDate(start.getDate() - 29)
      return { startDate: start.toISOString().split('T')[0], endDate: todayStr }
    }

    case '90d': {
      const start = new Date(now)
      start.setDate(start.getDate() - 89)
      return { startDate: start.toISOString().split('T')[0], endDate: todayStr }
    }

    case '12mo': {
      const start = new Date(now)
      start.setFullYear(start.getFullYear() - 1)
      start.setDate(start.getDate() + 1)
      return { startDate: start.toISOString().split('T')[0], endDate: todayStr }
    }

    default:
      // Default to 30 days
      const start = new Date(now)
      start.setDate(start.getDate() - 29)
      return { startDate: start.toISOString().split('T')[0], endDate: todayStr }
  }
}

function formatAxisDate(dateStr: string, period: string): string {
  if (dateStr.length !== 8) return dateStr
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  const date = new Date(`${year}-${month}-${day}`)
  if (period === '12mo') {
    return date.toLocaleDateString('en-US', { month: 'short' })
  }
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
}

function SkeletonPulse({ width = '100%', height = '1rem' }: { width?: string; height?: string }) {
  return <div className="skeleton-pulse" style={{ width, height }} />
}

function StatCard({
  title,
  value,
  formatter = formatNumber,
  loading = false,
}: {
  title: string
  value?: number
  formatter?: (v: number) => string
  loading?: boolean
}) {
  return (
    <div className={`stat-card${loading ? ' stat-card--loading' : ''}`}>
      <div className="stat-card__label">{title}</div>
      {loading ? (
        <SkeletonPulse width="80px" height="2rem" />
      ) : (
        <div className="stat-card__value">{formatter(value ?? 0)}</div>
      )}
    </div>
  )
}

function SectionCard({
  title,
  children,
  loading = false,
}: {
  title: string
  children: React.ReactNode
  loading?: boolean
}) {
  return (
    <div className={`section-card${loading ? ' section-card--loading' : ''}`}>
      <h3 className="section-card__title">{title}</h3>
      {children}
    </div>
  )
}

function ChartSkeleton() {
  const loadingText = useLabel(analyticsLabels.loadingChartData)

  return (
    <div className="chart-skeleton">
      <div className="chart-skeleton__content">
        <div className="chart-skeleton__text">{loadingText}</div>
        <SkeletonPulse width="200px" height="0.5rem" />
      </div>
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="table-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="table-skeleton__row">
          <SkeletonPulse width="60%" height="1rem" />
          <SkeletonPulse width="20%" height="1rem" />
        </div>
      ))}
    </div>
  )
}

function DemographicsList({
  items,
  columnLabel,
  loading = false,
}: {
  items?: DemographicsItem[]
  columnLabel: string
  loading?: boolean
}) {
  const noDataText = useLabel(analyticsLabels.noDataAvailable)
  const usersLabel = useLabel(analyticsLabels.columnUsers)
  const percentLabel = useLabel(analyticsLabels.columnPercentage)

  if (loading) {
    return <TableSkeleton rows={5} />
  }

  if (!items || items.length === 0) {
    return <div className="analytics__no-data">{noDataText}</div>
  }

  return (
    <table className="data-table">
      <thead>
        <tr className="data-table__header-row">
          <th className="data-table__header-cell data-table__header-cell--left">{columnLabel}</th>
          <th className="data-table__header-cell data-table__header-cell--right">{usersLabel}</th>
          <th className="data-table__header-cell data-table__header-cell--right">{percentLabel}</th>
        </tr>
      </thead>
      <tbody>
        {items.slice(0, 5).map((item) => (
          <tr key={item.name} className="data-table__row">
            <td className="data-table__cell data-table__cell--left data-table__cell--bold">
              {item.name}
            </td>
            <td className="data-table__cell data-table__cell--right data-table__cell--bold">
              {formatNumber(item.value)}
            </td>
            <td className="data-table__cell data-table__cell--right data-table__cell--muted">
              {formatPercentage(item.percentage)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TrafficSourcesTable({
  data,
  loading = false,
}: {
  data?: TrafficSources
  loading?: boolean
}) {
  const noDataText = useLabel(analyticsLabels.noTrafficSourceData)
  const sourceMediumLabel = useLabel(analyticsLabels.columnSourceMedium)
  const sessionsLabel = useLabel(analyticsLabels.columnSessions)
  const usersLabel = useLabel(analyticsLabels.columnUsers)
  const percentLabel = useLabel(analyticsLabels.columnPercentage)

  if (loading) {
    return <TableSkeleton rows={5} />
  }

  if (!data || !data.sources || data.sources.length === 0) {
    return <div className="analytics__no-data">{noDataText}</div>
  }

  return (
    <table className="data-table">
      <thead>
        <tr className="data-table__header-row">
          <th className="data-table__header-cell data-table__header-cell--left">
            {sourceMediumLabel}
          </th>
          <th className="data-table__header-cell data-table__header-cell--right">{sessionsLabel}</th>
          <th className="data-table__header-cell data-table__header-cell--right">{usersLabel}</th>
          <th className="data-table__header-cell data-table__header-cell--right">{percentLabel}</th>
        </tr>
      </thead>
      <tbody>
        {data.sources.map((source) => (
          <tr key={`${source.source}-${source.medium}`} className="data-table__row">
            <td className="data-table__cell data-table__cell--left">
              <span className="data-table__source">{source.source}</span>
              <span className="data-table__medium"> / {source.medium}</span>
            </td>
            <td className="data-table__cell data-table__cell--right data-table__cell--bold">
              {formatNumber(source.sessions)}
            </td>
            <td className="data-table__cell data-table__cell--right data-table__cell--secondary">
              {formatNumber(source.users)}
            </td>
            <td className="data-table__cell data-table__cell--right data-table__cell--muted">
              {formatPercentage(source.percentage)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const AnalyticsClient: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('30d')

  // Get translated labels
  const titleLabel = useLabel(analyticsLabels.title)
  const totalViewsLabel = useLabel(analyticsLabels.totalViews)
  const uniqueVisitorsLabel = useLabel(analyticsLabels.uniqueVisitors)
  const sessionsLabel = useLabel(analyticsLabels.sessions)
  const avgSessionDurationLabel = useLabel(analyticsLabels.avgSessionDuration)
  const visitorsOverTimeLabel = useLabel(analyticsLabels.visitorsOverTime)
  const topCountriesLabel = useLabel(analyticsLabels.topCountries)
  const topCitiesLabel = useLabel(analyticsLabels.topCities)
  const trafficSourcesLabel = useLabel(analyticsLabels.trafficSources)
  const topExperiencesLabel = useLabel(analyticsLabels.topExperiences)
  const countryColumnLabel = useLabel(analyticsLabels.columnCountry)
  const cityColumnLabel = useLabel(analyticsLabels.columnCity)
  const experienceColumnLabel = useLabel(analyticsLabels.columnExperience)
  const typeColumnLabel = useLabel(analyticsLabels.columnType)
  const viewsColumnLabel = useLabel(analyticsLabels.columnViews)
  const uniqueVisitorsColumnLabel = useLabel(analyticsLabels.columnUniqueVisitors)
  const noDataForPeriodLabel = useLabel(analyticsLabels.noDataForPeriod)
  const noExperienceViewsLabel = useLabel(analyticsLabels.noExperienceViews)
  const errorLoadingLabel = useLabel(analyticsLabels.errorLoadingAnalytics)
  const experiencePrefix = useLabel(analyticsLabels.experienceNumberPrefix)
  const visitorsLabel = useLabel(analyticsLabels.visitors)

  const periodOptions = usePeriodOptions()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const { startDate, endDate } = periodToDateRange(period)
        const params = new URLSearchParams({ startDate, endDate })

        const response = await fetch(`/api/analytics?${params}`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch analytics data')
        }

        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [period])

  const stats = data?.stats
  const timeseries = data?.timeseries
  const topExperiences = data?.topExperiences
  const demographics = data?.demographics
  const trafficSources = data?.trafficSources

  return (
    <div className="analytics">
      {/* Error Banner */}
      {error && (
        <div className="analytics__error">
          <div className="analytics__error-title">{errorLoadingLabel}</div>
          <div className="analytics__error-message">{error}</div>
        </div>
      )}

      {/* Header with period selector */}
      <div className="analytics__header">
        <h1 className="analytics__title">{titleLabel}</h1>
        <div className="analytics__period-selector">
          <SelectInput
            path="period"
            name="period"
            options={periodOptions}
            value={period}
            isClearable={false}
            onChange={(option) => {
              const val = Array.isArray(option) ? option[0]?.value : option?.value
              setPeriod((val as string) || '30d')
            }}
          />
        </div>
      </div>

      {/* Stats Cards - Primary */}
      <div className="analytics__stats-grid">
        <StatCard title={totalViewsLabel} value={stats?.totalViews.value} loading={loading} />
        <StatCard
          title={uniqueVisitorsLabel}
          value={stats?.uniqueVisitors.value}
          loading={loading}
        />
        <StatCard title={sessionsLabel} value={stats?.sessions?.value} loading={loading} />
        <StatCard
          title={avgSessionDurationLabel}
          value={stats?.avgSessionDuration.value}
          formatter={formatDuration}
          loading={loading}
        />
      </div>

      {/* Time Series Chart */}
      <SectionCard title={visitorsOverTimeLabel} loading={loading}>
        {loading ? (
          <ChartSkeleton />
        ) : timeseries && timeseries.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeseries} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="var(--theme-elevation-200)" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatAxisDate(value, period)}
                tick={{ fill: 'var(--theme-elevation-600)', fontSize: 12 }}
                stroke="var(--theme-elevation-300)"
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="var(--theme-elevation-300)"
                tick={{ fill: 'var(--theme-elevation-600)', fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--theme-elevation-0)',
                  borderRadius: '6px',
                  border: '1px solid var(--theme-elevation-200)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(label) => formatDateLabel(label)}
                formatter={(value) => [
                  `${formatNumber(value as number)} ${visitorsLabel.toLowerCase()}`,
                  visitorsLabel,
                ]}
              />
              <Area
                dataKey="visitors"
                type="linear"
                stroke="#10b981"
                fill="url(#colorVisitors)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="analytics__no-data">{noDataForPeriodLabel}</div>
        )}
      </SectionCard>

      {/* Demographics and Traffic Sources */}
      <div className="analytics__sections-grid">
        <SectionCard title={topCountriesLabel} loading={loading}>
          <DemographicsList
            items={demographics?.countries}
            columnLabel={countryColumnLabel}
            loading={loading}
          />
        </SectionCard>
        <SectionCard title={topCitiesLabel} loading={loading}>
          <DemographicsList
            items={demographics?.cities}
            columnLabel={cityColumnLabel}
            loading={loading}
          />
        </SectionCard>
        <SectionCard title={trafficSourcesLabel} loading={loading}>
          <TrafficSourcesTable data={trafficSources} loading={loading} />
        </SectionCard>
      </div>

      {/* Top Experiences Table */}
      <div className="analytics__experiences">
        <SectionCard title={topExperiencesLabel} loading={loading}>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : topExperiences && topExperiences.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr className="data-table__header-row">
                  <th className="data-table__header-cell data-table__header-cell--left">
                    {experienceColumnLabel}
                  </th>
                  <th className="data-table__header-cell data-table__header-cell--left">
                    {typeColumnLabel}
                  </th>
                  <th className="data-table__header-cell data-table__header-cell--right">
                    {viewsColumnLabel}
                  </th>
                  <th className="data-table__header-cell data-table__header-cell--right">
                    {uniqueVisitorsColumnLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {topExperiences.map((exp) => (
                  <tr key={exp.experienceId} className="data-table__row">
                    <td className="data-table__cell data-table__cell--left">
                      {exp.title || `${experiencePrefix}${exp.experienceId}`}
                    </td>
                    <td className="data-table__cell data-table__cell--left data-table__cell--secondary">
                      {exp.itemType || '-'}
                    </td>
                    <td className="data-table__cell data-table__cell--right data-table__cell--bold">
                      {formatNumber(exp.views)}
                    </td>
                    <td className="data-table__cell data-table__cell--right data-table__cell--secondary">
                      {formatNumber(exp.uniqueVisitors)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="analytics__no-data">{noExperienceViewsLabel}</div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

export default AnalyticsClient
