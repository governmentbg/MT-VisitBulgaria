import React from 'react';
import {StyleSheet} from 'react-native';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {ExpandableSection} from './ExpandableSection';

interface ExpandableDatePickerProps {
  dates: string[]; // ISO date strings
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const ExpandableDatePicker = React.memo(function ExpandableDatePicker({
  dates,
}: ExpandableDatePickerProps) {
  if (dates.length === 0) {
    return null;
  }

  const firstDateFormatted = formatDate(dates[0]);

  return (
    <ExpandableSection
      icon="calendar"
      label={firstDateFormatted}
      showChevron={dates.length > 1}>
      {dates.length > 1 && (
        <Box paddingTop="s" paddingHorizontal="s">
          {dates.slice(1).map((date) => (
            <Box key={date} paddingVertical="xs">
              <Text style={styles.listDateText}>{formatDate(date)}</Text>
            </Box>
          ))}
        </Box>
      )}
    </ExpandableSection>
  );
});

const styles = StyleSheet.create({
  listDateText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: fonts.regular,
    color: palette.heading,
  },
});
