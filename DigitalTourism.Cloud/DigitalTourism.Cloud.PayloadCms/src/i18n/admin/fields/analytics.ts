/**
 * Analytics dashboard translations
 */
import type { LocalizedLabel } from '../types'

export const analyticsLabels: Record<string, LocalizedLabel> = {
  // Page title
  title: {
    en: 'Analytics Dashboard',
    bg: 'Табло за анализи',
  },

  // Period options
  periodToday: {
    en: 'Today',
    bg: 'Днес',
  },
  periodYesterday: {
    en: 'Yesterday',
    bg: 'Вчера',
  },
  period7d: {
    en: 'Last 7 days',
    bg: 'Последните 7 дни',
  },
  period30d: {
    en: 'Last 30 days',
    bg: 'Последните 30 дни',
  },
  period90d: {
    en: 'Last 90 days',
    bg: 'Последните 90 дни',
  },
  period12mo: {
    en: 'Last 12 months',
    bg: 'Последните 12 месеца',
  },

  // Stat cards
  totalViews: {
    en: 'Total Views',
    bg: 'Общо прегледи',
  },
  uniqueVisitors: {
    en: 'Unique Visitors',
    bg: 'Уникални посетители',
  },
  sessions: {
    en: 'Sessions',
    bg: 'Сесии',
  },
  avgSessionDuration: {
    en: 'Avg. Session Duration',
    bg: 'Ср. продължителност',
  },

  // Section titles
  visitorsOverTime: {
    en: 'Visitors Over Time',
    bg: 'Посетители във времето',
  },
  topCountries: {
    en: 'Top Countries',
    bg: 'Топ държави',
  },
  topCities: {
    en: 'Top Cities',
    bg: 'Топ градове',
  },
  trafficSources: {
    en: 'Traffic Sources',
    bg: 'Източници на трафик',
  },
  topExperiences: {
    en: 'Top Experiences',
    bg: 'Топ преживявания',
  },

  // Table headers
  columnCountry: {
    en: 'Country',
    bg: 'Държава',
  },
  columnCity: {
    en: 'City',
    bg: 'Град',
  },
  columnUsers: {
    en: 'Users',
    bg: 'Потребители',
  },
  columnPercentage: {
    en: '%',
    bg: '%',
  },
  columnSourceMedium: {
    en: 'Source / Medium',
    bg: 'Източник / Среда',
  },
  columnSessions: {
    en: 'Sessions',
    bg: 'Сесии',
  },
  columnExperience: {
    en: 'Experience',
    bg: 'Обект',
  },
  columnType: {
    en: 'Type',
    bg: 'Тип',
  },
  columnViews: {
    en: 'Views',
    bg: 'Прегледи',
  },
  columnUniqueVisitors: {
    en: 'Unique Visitors',
    bg: 'Уникални посетители',
  },

  // Chart labels
  visitors: {
    en: 'Visitors',
    bg: 'Посетители',
  },

  // Empty states
  noDataAvailable: {
    en: 'No data available',
    bg: 'Няма налични данни',
  },
  noDataForPeriod: {
    en: 'No data available for this period',
    bg: 'Няма данни за този период',
  },
  noTrafficSourceData: {
    en: 'No traffic source data available',
    bg: 'Няма данни за източниците на трафик',
  },
  noExperienceViews: {
    en: 'No experience views recorded yet',
    bg: 'Все още няма записани прегледи',
  },

  // Loading states
  loadingChartData: {
    en: 'Loading chart data...',
    bg: 'Зареждане на графика...',
  },

  // Error states
  errorLoadingAnalytics: {
    en: 'Error loading analytics',
    bg: 'Грешка при зареждане на анализите',
  },

  // Misc
  experienceNumberPrefix: {
    en: 'Experience #',
    bg: 'Обект #',
  },
}
