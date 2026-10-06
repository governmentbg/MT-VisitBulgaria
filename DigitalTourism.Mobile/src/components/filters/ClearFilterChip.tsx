import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

interface ClearFilterChipProps {
  onPress: () => void;
  label?: string;
}

export const ClearFilterChip = React.memo(function ClearFilterChip({
  onPress,
  label = 'Clear',
}: ClearFilterChipProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box
        borderRadius="full"
        flexDirection="row"
        alignItems="center"
        paddingLeft="m"
        paddingRight="m"
        paddingVertical="s"
        marginRight="s"
        style={styles.chip}>
        <Icon source="close" size={moderateScale(16)} color={palette.dangerDark} />
        <Text fontFamily={fonts.bold} style={styles.label}>
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  chip: {
    backgroundColor: 'rgba(219,52,11,0.1)',
    gap: moderateScale(4),
  },
  label: {
    fontSize: moderateScale(16),
    color: palette.dangerDark,
  },
});
