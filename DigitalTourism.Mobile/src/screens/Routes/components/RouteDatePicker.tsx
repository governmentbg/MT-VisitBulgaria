import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {Box, Text, Icon} from '../../../design';
import {useBottomSheetBackdrop} from '../../../hooks/useBottomSheetBackdrop';
import {fonts} from '../../../theme/fonts';
import {moderateScale} from '../../../theme/scaling';
import {palette} from '../../../theme/palette';
import {theme} from '../../../theme';
import {useTranslation} from 'react-i18next';

interface RouteDatePickerProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (startDate: string, duration: number) => void;
  initialStartDate?: string;
  initialDuration?: number;
}

/** Generate localized single-letter day-of-week headers starting from Sunday */
function getLocalizedDaysOfWeek(locale: string): string[] {
  // Jan 7, 2024 is a Sunday
  return Array.from({length: 7}, (_, i) => {
    const date = new Date(2024, 0, 7 + i);
    return new Intl.DateTimeFormat(locale, {weekday: 'narrow'}).format(date);
  });
}
const CALENDAR_ROWS = 6;
const CALENDAR_COLS = 7;

/**
 * Parse an ISO date string into year, month, day in local time.
 * Accepts both "YYYY-MM-DD" and full timestamps like
 * "YYYY-MM-DDTHH:mm:ss.sssZ" — only the calendar date portion is used.
 */
function parseISO(dateStr: string): {year: number; month: number; day: number} {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
  return {year: y, month: m - 1, day: d};
}

/** Format a Date to ISO YYYY-MM-DD */
function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get the number of days between two dates (inclusive) */
function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.round(Math.abs(b.getTime() - a.getTime()) / msPerDay) + 1;
}

/** Check if two dates represent the same calendar day */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Check if a date is strictly before today (ignoring time) */
function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

/** Build the 6x7 grid of day numbers for a given month/year */
function buildCalendarGrid(
  year: number,
  month: number,
): Array<{day: number; date: Date; isCurrentMonth: boolean}> {
  const firstOfMonth = new Date(year, month, 1);
  const startDow = firstOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Array<{day: number; date: Date; isCurrentMonth: boolean}> = [];

  // Previous month trailing days
  for (let i = startDow - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({
      day,
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month leading days
  const remaining = CALENDAR_ROWS * CALENDAR_COLS - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      day: d,
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
    });
  }

  return cells;
}

/**
 * Calendar bottom sheet for selecting a date range when creating/editing a route.
 * Renders a simple custom month calendar with range selection.
 */
export function RouteDatePicker({
  visible,
  onDismiss,
  onConfirm,
  initialStartDate,
  initialDuration,
}: RouteDatePickerProps) {
  const {t, i18n} = useTranslation('routes');
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const daysOfWeek = useMemo(
    () => getLocalizedDaysOfWeek(i18n.language),
    [i18n.language],
  );

  // Current month being displayed
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  // Selected range
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  // Initialize from props when sheet opens
  useEffect(() => {
    if (visible) {
      if (initialStartDate) {
        const parsed = parseISO(initialStartDate);
        const start = new Date(parsed.year, parsed.month, parsed.day);
        setRangeStart(start);
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
        if (initialDuration && initialDuration >= 1) {
          const end = new Date(start);
          end.setDate(end.getDate() + initialDuration - 1);
          setRangeEnd(end);
        } else {
          setRangeEnd(start);
        }
      } else {
        setRangeStart(null);
        setRangeEnd(null);
        setViewYear(new Date().getFullYear());
        setViewMonth(new Date().getMonth());
      }
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, initialStartDate, initialDuration]);

  const monthLabel = useMemo(() => {
    const date = new Date(viewYear, viewMonth, 1);
    return date.toLocaleDateString(i18n.language, {month: 'long', year: 'numeric'});
  }, [viewYear, viewMonth, i18n.language]);

  const calendarCells = useMemo(
    () => buildCalendarGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const canConfirm = rangeStart !== null && rangeEnd !== null;

  const goToPrevMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handleDayPress = useCallback(
    (date: Date) => {
      if (isPast(date)) {
        return;
      }

      if (!rangeStart || rangeEnd) {
        // First tap or resetting: set start
        setRangeStart(date);
        setRangeEnd(null);
      } else {
        // Second tap: set end (ensure start <= end)
        if (date.getTime() < rangeStart.getTime()) {
          setRangeEnd(rangeStart);
          setRangeStart(date);
        } else {
          setRangeEnd(date);
        }
      }
    },
    [rangeStart, rangeEnd],
  );

  const handleConfirm = useCallback(() => {
    if (rangeStart && rangeEnd) {
      const startISO = toISO(rangeStart);
      const duration = daysBetween(rangeStart, rangeEnd);
      onConfirm(startISO, duration);
    }
  }, [rangeStart, rangeEnd, onConfirm]);

  const renderBackdrop = useBottomSheetBackdrop();

  /** Determine the visual state of a calendar cell */
  const getCellState = useCallback(
    (date: Date) => {
      if (!rangeStart) {
        return 'default';
      }
      if (isSameDay(date, rangeStart)) {
        return 'start';
      }
      if (rangeEnd && isSameDay(date, rangeEnd)) {
        return 'end';
      }
      if (
        rangeEnd &&
        date.getTime() > rangeStart.getTime() &&
        date.getTime() < rangeEnd.getTime()
      ) {
        return 'inRange';
      }
      return 'default';
    },
    [rangeStart, rangeEnd],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      enablePanDownToClose
      enableHandlePanningGesture
      enableContentPanningGesture={false}
      stackBehavior="push"
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView style={styles.content}>
        {/* Month navigation header */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="m"
          marginBottom="m">
          <TouchableOpacity
            onPress={goToPrevMonth}
            activeOpacity={0.7}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Icon source="chevron-left" size="m" color="textPrimary" />
          </TouchableOpacity>
          <Text fontFamily={fonts.bold} style={styles.monthLabel}>
            {monthLabel}
          </Text>
          <TouchableOpacity
            onPress={goToNextMonth}
            activeOpacity={0.7}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Icon source="chevron-right" size="m" color="textPrimary" />
          </TouchableOpacity>
        </Box>

        {/* Day-of-week headers */}
        <Box flexDirection="row" paddingHorizontal="m" marginBottom="xs">
          {daysOfWeek.map((label, i) => (
            <View key={i} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{label}</Text>
            </View>
          ))}
        </Box>

        {/* Calendar grid */}
        <Box paddingHorizontal="m">
          {Array.from({length: CALENDAR_ROWS}).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.calendarRow}>
              {calendarCells
                .slice(
                  rowIndex * CALENDAR_COLS,
                  rowIndex * CALENDAR_COLS + CALENDAR_COLS,
                )
                .map((cell, colIndex) => {
                  const past = isPast(cell.date);
                  const state = getCellState(cell.date);
                  const isEndpoint = state === 'start' || state === 'end';
                  const isInRange = state === 'inRange';
                  const dimmed = !cell.isCurrentMonth || past;

                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.dayCell,
                        isInRange && styles.dayCellInRange,
                        state === 'start' && styles.dayCellRangeStart,
                        state === 'end' && styles.dayCellRangeEnd,
                      ]}
                      activeOpacity={dimmed ? 1 : 0.6}
                      onPress={() => handleDayPress(cell.date)}
                      disabled={past}>
                      <View
                        style={[
                          styles.dayCircle,
                          isEndpoint && styles.dayCircleSelected,
                        ]}>
                        <Text
                          style={[
                            styles.dayText,
                            dimmed && styles.dayTextDimmed,
                            isEndpoint && styles.dayTextSelected,
                          ]}>
                          {cell.day}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          ))}
        </Box>

        {/* Action buttons */}
        <Box
          flexDirection="row"
          paddingHorizontal="m"
          marginTop="m"
          marginBottom="l"
          style={styles.actionsRow}>
          <TouchableOpacity
            onPress={onDismiss}
            activeOpacity={0.8}
            style={[styles.actionButton, styles.cancelButton]}>
            <Text fontFamily={fonts.bold} style={styles.cancelText}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={canConfirm ? 0.8 : 1}
            disabled={!canConfirm}
            style={[
              styles.actionButton,
              styles.confirmButton,
              !canConfirm && styles.confirmButtonDisabled,
            ]}>
            <Text fontFamily={fonts.bold} style={styles.confirmText}>
              {t('chooseDates', {defaultValue: 'Choose dates'})}
            </Text>
          </TouchableOpacity>
        </Box>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const CELL_SIZE = moderateScale(40);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    backgroundColor: palette.gray300,
    width: 48,
  },
  content: {
    paddingTop: moderateScale(8),
  },
  monthLabel: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
    color: palette.heading,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: moderateScale(4),
  },
  dayHeaderText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.medium,
    color: palette.gray600,
  },
  calendarRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellInRange: {
    backgroundColor: palette.green50,
  },
  dayCellRangeStart: {
    backgroundColor: palette.green50,
    borderTopLeftRadius: CELL_SIZE / 2,
    borderBottomLeftRadius: CELL_SIZE / 2,
  },
  dayCellRangeEnd: {
    backgroundColor: palette.green50,
    borderTopRightRadius: CELL_SIZE / 2,
    borderBottomRightRadius: CELL_SIZE / 2,
  },
  dayCircle: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: palette.green500,
  },
  dayText: {
    fontSize: moderateScale(14),
    fontFamily: fonts.regular,
    color: palette.heading,
  },
  dayTextDimmed: {
    color: palette.gray200,
  },
  dayTextSelected: {
    color: palette.white,
    fontFamily: fonts.bold,
  },
  actionsRow: {
    gap: moderateScale(12),
  },
  actionButton: {
    flex: 1,
    height: moderateScale(48),
    borderRadius: theme.borderRadii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: palette.green700,
  },
  confirmButtonDisabled: {
    backgroundColor: palette.gray200,
  },
  confirmText: {
    fontSize: moderateScale(16),
    color: palette.white,
  },
  cancelButton: {
    backgroundColor: palette.green50,
  },
  cancelText: {
    fontSize: moderateScale(16),
    color: palette.green800,
  },
});
