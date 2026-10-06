import {useState, useMemo, useCallback} from 'react';
import {useReorderRouteStops} from '../../../hooks/mutations/useRouteItems';
import type {Route, RouteStop} from '../../../models/Route';

/** Union type for the unified draggable list (headers + stops together) */
export type DragListItem =
  | {type: 'header'; key: string; dayNumber: number; stopCount: number}
  | {type: 'stop'; key: string; stop: RouteStop};

export function useRouteDragReorder(params: {
  routeId: number;
  routeData: Route | null | undefined;
}) {
  const {routeId, routeData} = params;
  const reorderStopsMutation = useReorderRouteStops();
  const [dragResetKey, setDragResetKey] = useState(0);

  // Flatten days into a single list for cross-day drag & drop
  const flatDragItems = useMemo((): DragListItem[] => {
    if (!routeData) return [];
    const items: DragListItem[] = [];
    for (const day of routeData.days) {
      items.push({
        type: 'header',
        key: `header_${day.dayNumber}`,
        dayNumber: day.dayNumber,
        stopCount: day.stops.length,
      });
      for (const stop of day.stops) {
        items.push({type: 'stop', key: stop.id, stop});
      }
    }
    return items;
  }, [routeData]);

  // Rebuild days from the reordered flat list after drag
  const handleDragEnd = useCallback(
    ({data}: {data: DragListItem[]}) => {
      if (!routeData) return;

      // If a stop was dragged above the first header, reset the list
      if (data.length > 0 && data[0].type === 'stop') {
        setDragResetKey(k => k + 1);
        return;
      }

      const newDays: Array<{dayNumber: number; stops: RouteStop[]}> = [];
      let currentDay: {dayNumber: number; stops: RouteStop[]} | null = null;

      for (const item of data) {
        if (item.type === 'header') {
          currentDay = {dayNumber: item.dayNumber, stops: []};
          newDays.push(currentDay);
        } else if (currentDay) {
          currentDay.stops.push(item.stop);
        }
      }

      reorderStopsMutation.mutate({routeId, days: newDays});
    },
    [routeId, routeData, reorderStopsMutation],
  );

  return {flatDragItems, dragResetKey, handleDragEnd};
}
