import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {formatDateRange} from '../../../utils/dateHelpers';
import type {Route, RouteStop} from '../../../models/Route';

export interface DaySection {
  dayNumber: number;
  data: RouteStop[];
}

export function useRouteComputedData(routeData: Route | null | undefined) {
  const {t, i18n} = useTranslation('routes');

  const {visited, total} = useMemo(() => {
    if (!routeData) return {visited: 0, total: 0};
    let v = 0;
    let count = 0;
    for (const day of routeData.days) {
      for (const stop of day.stops) {
        count++;
        if (stop.visited) v++;
      }
    }
    return {visited: v, total: count};
  }, [routeData]);

  const sections = useMemo<DaySection[]>(() => {
    if (!routeData) return [];
    return routeData.days.map(day => ({
      dayNumber: day.dayNumber,
      data: day.stops,
    }));
  }, [routeData]);

  const dateRangeText = useMemo(() => {
    if (!routeData) return '';
    const rangeStr = formatDateRange(
      routeData.startDate,
      routeData.duration,
      i18n.language,
    );
    return `${rangeStr} (${t('durationDays', {count: routeData.duration})})`;
  }, [routeData, i18n.language, t]);

  return {visited, total, sections, dateRangeText};
}
