/**
 * Localized Formatting Utilities
 *
 * Provides locale-aware formatting for:
 * - Currency (EUR)
 * - Numbers
 * - Dates
 * - Relative times
 */

import { i18n } from '../i18n';
import type { IconName } from '../design';

/**
 * Format a number as currency (EUR)
 * @param amount - The amount to format
 * @param currency - Currency code (default: EUR)
 */
export function formatCurrency(amount: number, currency = 'EUR'): string {
  try {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('[Formatters] Error formatting currency:', error);
    return `€${amount.toFixed(2)}`;
  }
}

/**
 * Format a number with locale-specific formatting
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatNumber(value: number, decimals = 1): string {
  try {
    return new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('[Formatters] Error formatting number:', error);
    return value.toFixed(decimals);
  }
}

/**
 * Format a date with locale-specific formatting
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormat options
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('[Formatters] Invalid date:', dateString);
      return dateString;
    }
    return new Intl.DateTimeFormat(i18n.language, options).format(date);
  } catch (error) {
    console.error('[Formatters] Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a date with long format (e.g., "Monday, January 15, 2024")
 * @param dateString - ISO date string
 */
export function formatLongDate(dateString: string): string {
  return formatDate(dateString, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date range
 * @param startDate - ISO date string for start
 * @param endDate - ISO date string for end
 */
export function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if same day
    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    ) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } catch (error) {
    console.error('[Formatters] Error formatting date range:', error);
    return `${startDate} - ${endDate}`;
  }
}

/**
 * Format a location string from city and municipality names.
 * Shared by all detail content components.
 */
export function formatLocation(
  cityName?: string,
  municipalityName?: string,
): string | undefined {
  if (!cityName) return undefined;
  return municipalityName ? `${cityName}, ${municipalityName}` : cityName;
}

/**
 * Build contact action buttons from entity fields.
 * Eliminates duplicated phone/website/booking/menu/reservation action arrays
 * across detail content components.
 */
export function buildContactActions(
  entity: {phone?: string; website?: string; bookingUrl?: string; menuUrl?: string; reservationUrl?: string},
  labels: {call?: string; website?: string; reserve?: string; menu?: string},
): Array<{icon: IconName; label: string; url: string}> {
  const actions: Array<{icon: IconName; label: string; url: string}> = [];

  if (entity.phone) {
    actions.push({icon: 'phone', label: labels.call ?? 'Call', url: `tel:${entity.phone}`});
  }
  if (entity.website) {
    actions.push({icon: 'web', label: labels.website ?? 'Web', url: entity.website});
  }
  if (entity.menuUrl) {
    actions.push({icon: 'book-open-variant', label: labels.menu ?? 'Menu', url: entity.menuUrl});
  }
  if (entity.bookingUrl ?? entity.reservationUrl) {
    actions.push({
      icon: 'calendar-check',
      label: labels.reserve ?? 'Reserve',
      url: (entity.bookingUrl ?? entity.reservationUrl)!,
    });
  }

  return actions;
}

/**
 * Format a date as relative time (e.g., "Today", "In 3 days", "2 weeks ago")
 * @param dateString - ISO date string
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Normalize to midnight for day comparison
    const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffMs = dateAtMidnight.getTime() - nowAtMidnight.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    // Today
    if (diffDays === 0) {
      return i18n.t('common:time.today');
    }
    
    // Tomorrow
    if (diffDays === 1) {
      return i18n.t('common:time.tomorrow');
    }
    
    // Yesterday
    if (diffDays === -1) {
      return i18n.t('common:time.yesterday');
    }
    
    // Future days (2-13 days)
    if (diffDays > 1 && diffDays < 14) {
      return i18n.t('common:time.inDays', { count: diffDays });
    }
    
    // Past days (2-13 days ago)
    if (diffDays < -1 && diffDays > -14) {
      return i18n.t('common:time.daysAgo', { count: Math.abs(diffDays) });
    }
    
    // Future weeks (2-7 weeks)
    if (diffDays >= 14 && diffDays < 60) {
      const weeks = Math.round(diffDays / 7);
      return i18n.t('common:time.inWeeks', { count: weeks });
    }
    
    // Past weeks (2-7 weeks ago)
    if (diffDays <= -14 && diffDays > -60) {
      const weeks = Math.round(Math.abs(diffDays) / 7);
      return i18n.t('common:time.weeksAgo', { count: weeks });
    }
    
    // Future months
    if (diffDays >= 60) {
      const months = Math.round(diffDays / 30);
      return i18n.t('common:time.inMonths', { count: months });
    }
    
    // Past months
    if (diffDays <= -60) {
      const months = Math.round(Math.abs(diffDays) / 30);
      return i18n.t('common:time.monthsAgo', { count: months });
    }
    
    // Fallback
    return formatDate(dateString);
  } catch (error) {
    console.error('[Formatters] Error formatting relative time:', error);
    return dateString;
  }
}
