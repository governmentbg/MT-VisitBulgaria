import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Icon, Text, type IconName} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

interface DetailInfoPillProps {
  icon: IconName;
  text: string;
  onPress?: () => void;
}

export const DetailInfoPill = React.memo(function DetailInfoPill({
  icon,
  text,
  onPress,
}: DetailInfoPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="surfaceBackground"
        borderRadius="full"
        padding="s"
        gap="xs">
        <Icon source={icon} size={moderateScale(24)} color="textPrimary" />
        <Text style={styles.text}>{text}</Text>
      </Box>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
    color: palette.black,
    flex: 1,
  },
});
