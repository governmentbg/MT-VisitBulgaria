import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {fonts} from '../../theme/fonts';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';
import AiMagicIcon from '../../../assets/icons/ai-magic.svg';

interface NearbyChipProps {
  count: number;
  onPress?: () => void;
}

/**
 * "X nearby" floating pill chip shown at city zoom level.
 * Matches Figma: filled teal (#00BBA7) bg, sparkle icon, light text, green glow shadow.
 */
export function NearbyChip({count, onPress}: NearbyChipProps) {
  const {t} = useTranslation('map');
  const {t: tCommon} = useTranslation('common');

  if (count === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={tCommon('a11y.nearbyChip', {count})}
      accessibilityRole="button">
      <Box
        borderRadius="full"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        paddingLeft="s"
        paddingRight="m"
        height={moderateScale(40)}
        style={styles.container}>
        <AiMagicIcon
          width={moderateScale(16)}
          height={moderateScale(16)}
        />
        <Text
          fontFamily={fonts.bold}
          marginLeft="xs"
          style={styles.text}>
          {t('nearbyCount', {count})}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    borderColor: palette.green500,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 25},
    shadowOpacity: 0.3,
    shadowRadius: 50,
    elevation: 6,
  },
  text: {
    fontSize: moderateScale(16),
    color: palette.green700,
  },
});
