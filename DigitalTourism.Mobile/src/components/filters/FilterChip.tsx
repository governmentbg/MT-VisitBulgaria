import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

interface FilterChipProps {
  label: string;
  emoji?: string;
  isActive: boolean;
  count?: number;
  onPress: () => void;
}

export const FilterChip = React.memo(function FilterChip({
  label,
  emoji,
  isActive,
  count,
  onPress,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{checked: isActive}}>
      <Box
        borderRadius="full"
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
        paddingVertical="s"
        marginRight="s"
        style={[
          styles.chip,
          isActive ? styles.chipActive : styles.chipInactive,
        ]}>
        {emoji && <Text style={styles.chipEmoji}>{emoji}  </Text>}
        <Text
          fontFamily={fonts.bold}
          style={[
            styles.chipLabel,
            isActive ? styles.chipLabelActive : styles.chipLabelInactive,
          ]}>
          {label}
        </Text>
        {count != null && !isActive && (
          <Text style={styles.chipCount}> ({count})</Text>
        )}
      </Box>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: palette.white,
    borderColor: palette.green100,
  },
  chipInactive: {
    backgroundColor: palette.gray50,
    borderColor: palette.gray100,
  },
  chipEmoji: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14),
  },
  chipLabel: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14),
  },
  chipLabelActive: {
    color: palette.gray900,
  },
  chipLabelInactive: {
    color: palette.gray900,
  },
  chipCount: {
    fontSize: moderateScale(14),
    color: palette.gray600,
  },
});
