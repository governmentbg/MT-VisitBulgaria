import React from 'react';
import {StyleSheet, View, type DimensionValue} from 'react-native';
import {Box, Text} from '../../../design';
import {useTheme} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {moderateScale} from '../../../theme/scaling';
import {fonts} from '../../../theme/fonts';
import {palette} from '../../../theme/palette';
import {theme as themeObj} from '../../../theme';

interface RouteProgressBarProps {
  visited: number;
  total: number;
}

export function RouteProgressBar({visited, total}: RouteProgressBarProps) {
  const {theme} = useTheme();
  const {t} = useTranslation('routes');

  const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
  const fillWidth = total > 0 ? `${(visited / total) * 100}%` : '0%';

  return (
    <Box>
      {/* Labels row */}
      <Box flexDirection="row" justifyContent="space-between" marginBottom="xs">
        <Text
          style={[styles.labelText, {fontFamily: fonts.regular}]}
          color="textPrimary">
          {t('visited', {current: visited, total})}
        </Text>
        <Text style={[styles.percentageText, {fontFamily: fonts.medium}]}>
          {percentage}%
        </Text>
      </Box>

      {/* Track */}
      <View
        style={[
          styles.track,
          {backgroundColor: theme.colors.surfaceBackground},
        ]}>
        {/* Fill */}
        <View
          style={[
            styles.fill,
            {
              width: fillWidth as DimensionValue,
              backgroundColor: palette.green500,
            },
          ]}
        />
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  percentageText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    color: palette.green500,
  },
  track: {
    height: moderateScale(8),
    borderRadius: themeObj.borderRadii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: themeObj.borderRadii.full,
  },
});
