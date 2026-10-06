import React from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {ExpandableSection} from './ExpandableSection';

export type {WorkingHoursEntry} from '../../types/common';
import type {WorkingHoursEntry} from '../../types/common';

interface ExpandableWorkingHoursProps {
  hours: WorkingHoursEntry[];
}

/** Internal day keys used in WorkingHoursEntry.days — must stay English for data matching */
const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Maps internal day keys to i18n translation keys */
const DAY_I18N_MAP: Record<string, string> = {
  Mon: 'workingHours.mon',
  Tue: 'workingHours.tue',
  Wed: 'workingHours.wed',
  Thu: 'workingHours.thu',
  Fri: 'workingHours.fri',
  Sat: 'workingHours.sat',
  Sun: 'workingHours.sun',
};

function getCurrentStatus(hours: WorkingHoursEntry[]): {
  isOpen: boolean;
  nextTime: string;
  nextDay?: string;
} {
  if (hours.length === 0) {
    return {isOpen: false, nextTime: ''};
  }

  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = dayNames[now.getDay()];
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const todayEntry = hours.find(h => h.days.includes(today));
  if (todayEntry && currentTime >= todayEntry.openTime && currentTime < todayEntry.closeTime) {
    return {isOpen: true, nextTime: todayEntry.closeTime};
  }

  for (let offset = 0; offset < 7; offset++) {
    const checkDay = dayNames[(now.getDay() + offset) % 7];
    const entry = hours.find(h => h.days.includes(checkDay));
    if (entry) {
      if (offset === 0 && currentTime < entry.openTime) {
        return {isOpen: false, nextTime: entry.openTime};
      }
      if (offset > 0) {
        return {isOpen: false, nextTime: entry.openTime, nextDay: checkDay};
      }
    }
  }

  return {isOpen: false, nextTime: ''};
}

function getHoursForDay(
  day: string,
  hours: WorkingHoursEntry[],
): {openTime: string; closeTime: string} | null {
  const entry = hours.find(h => h.days.includes(day));
  if (entry) {
    return {openTime: entry.openTime, closeTime: entry.closeTime};
  }
  return null;
}

export const ExpandableWorkingHours = React.memo(
  function ExpandableWorkingHours({hours}: ExpandableWorkingHoursProps) {
    const {t} = useTranslation('common');
    const {isOpen, nextTime, nextDay} = getCurrentStatus(hours);

    const timeLabel = nextDay
      ? `${t(DAY_I18N_MAP[nextDay])} ${nextTime}`
      : nextTime;

    const statusText = isOpen
      ? `${t('workingHours.open')} \u2022 ${t('workingHours.closes', {time: nextTime})}`
      : `${t('workingHours.closed')} \u2022 ${t('workingHours.opens', {time: timeLabel})}`;

    return (
      <ExpandableSection
        icon="clock-outline"
        label={statusText}
        labelStyle={isOpen ? styles.openText : undefined}>
        <Box paddingTop="s" paddingHorizontal="s">
          {DAY_KEYS.map(day => {
            const dayHours = getHoursForDay(day, hours);
            return (
              <Box
                key={day}
                flexDirection="row"
                justifyContent="space-between"
                paddingVertical="xs">
                <Text style={styles.dayText}>{t(DAY_I18N_MAP[day])}</Text>
                <Text style={styles.timeText}>
                  {dayHours
                    ? `${dayHours.openTime} - ${dayHours.closeTime}`
                    : t('workingHours.closed')}
                </Text>
              </Box>
            );
          })}
        </Box>
      </ExpandableSection>
    );
  },
);

const styles = StyleSheet.create({
  openText: {
    color: palette.green700,
  },
  dayText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: fonts.medium,
    color: palette.heading,
  },
  timeText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: fonts.regular,
    color: palette.gray600,
  },
});
