import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Box, Text} from '../../../design';
import {useTranslation} from 'react-i18next';
import {moderateScale} from '../../../theme/scaling';
import {fonts} from '../../../theme/fonts';
import {palette} from '../../../theme/palette';
import {getDayBadgeColor} from '../utils/dayBadgeColor';

interface RouteDaySectionProps {
  dayNumber: number;
  destinationCount: number;
}

export const RouteDaySection = React.memo(function RouteDaySection({
  dayNumber,
  destinationCount,
}: RouteDaySectionProps) {
  const {t} = useTranslation('routes');

  const formattedDay = String(dayNumber).padStart(2, '0');
  const pillColor = getDayBadgeColor(dayNumber - 1);

  return (
    <Box marginBottom="s">
      <Box flexDirection="row" alignItems="center" gap="xs">
        <Text style={[styles.dayHeading, {fontFamily: fonts.bold}]}>
          {t('dayLabel')}
        </Text>
        <View style={[styles.pill, {backgroundColor: pillColor}]}>
          <Text style={[styles.pillText, {fontFamily: fonts.bold}]}>
            {formattedDay}
          </Text>
        </View>
      </Box>
      <Text style={[styles.destinationCount, {fontFamily: fonts.regular}]}>
        {t('destination', {count: destinationCount})}
      </Text>
    </Box>
  );
});

const styles = StyleSheet.create({
  dayHeading: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.3),
    color: palette.heading,
  },
  pill: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(999),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(14),
    color: palette.white,
    letterSpacing: 0.5,
  },
  destinationCount: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    color: palette.gray600,
  },
});
