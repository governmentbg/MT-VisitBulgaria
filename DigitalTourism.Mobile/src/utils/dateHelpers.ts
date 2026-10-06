import {EventStatus, EventPeriod} from '../models/Event';
import {formatDate, formatRelativeTime} from './formatters';

/**
 * Calculate event status based on current date
 */
export function calculateEventStatus(
  period: EventPeriod,
  now: Date = new Date(),
): EventStatus {
  const start = new Date(period.startDate);
  const end = new Date(period.endDate);

  if (now < start) {
    return EventStatus.UPCOMING;
  } else if (now > end) {
    return EventStatus.PAST;
  } else {
    return EventStatus.ACTIVE;
  }
}

/**
 * Check if event is currently active
 */
export function isEventActive(
  period: EventPeriod,
  now: Date = new Date(),
): boolean {
  return calculateEventStatus(period, now) === EventStatus.ACTIVE;
}

/**
 * Format event date for display
 * Uses the locale-aware formatter
 */
export function formatEventDate(dateString: string): string {
  return formatDate(dateString);
}

/**
 * Format event date range for display
 */
export function formatEventPeriod(period: EventPeriod): string {
  const start = formatEventDate(period.startDate);
  const end = formatEventDate(period.endDate);
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
}

/**
 * Get relative time description (e.g., "2 days ago", "in 3 weeks")
 * Uses the locale-aware formatter with i18n translations
 */
export function getRelativeTime(dateString: string): string {
  return formatRelativeTime(dateString);
}

/**
 * Format a route date range from start date + duration.
 * Same month:      "15–20 March 2026"
 * Different month:  "28 March – 2 April 2026"
 */
export function formatDateRange(startDate: string, duration: number, locale: string): string {
  const start = new Date(startDate);
  // Fix timezone: parse as local date to avoid off-by-one issues
  if (startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = startDate.split('-').map(Number);
    start.setFullYear(y, m - 1, d);
  }
  const end = new Date(start);
  // duration is count of days inclusive of start (e.g., duration=3 starting Mar 15 → end=Mar 17)
  end.setDate(end.getDate() + duration - 1);

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const monthYear = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(end);
    return `${start.getDate()}\u2013${end.getDate()} ${monthYear}`;
  }

  const startFmt = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
  }).format(start);
  const endFmt = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(end);
  return `${startFmt} \u2013 ${endFmt}`;
}
