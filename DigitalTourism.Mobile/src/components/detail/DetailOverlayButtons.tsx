import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Icon, type IconName} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

const overlayButtonShadow = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
});

interface DetailOverlayButtonsProps {
  onBack: () => void;
  onHeart?: () => void;
  onShare?: () => void;
  isFavourited?: boolean;
}

function OverlayButton({
  icon,
  onPress,
  accessibilityLabel,
}: {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      testID={`overlay-btn-${icon}`}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button">
      <Box
        width={moderateScale(32)}
        height={moderateScale(32)}
        borderRadius="full"
        backgroundColor="mainBackground"
        alignItems="center"
        justifyContent="center"
        style={overlayButtonShadow.shadow}>
        <Icon source={icon as IconName} size={moderateScale(16)} color="textPrimary" />
      </Box>
    </TouchableOpacity>
  );
}

export const DetailOverlayButtons = React.memo(function DetailOverlayButtons({
  onBack,
  onHeart,
  onShare,
  isFavourited = false,
}: DetailOverlayButtonsProps) {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation('common');

  const dynamicStyles = useMemo(() => ({
    container: {top: insets.top + moderateScale(8)},
    shareButton: {backgroundColor: palette.green50},
  }), [insets.top]);

  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      flexDirection="row"
      justifyContent="space-between"
      paddingHorizontal="m"
      style={dynamicStyles.container}>
      <OverlayButton icon="chevron-left" onPress={onBack} accessibilityLabel={t('actions.goBack')} />
      <Box flexDirection="row" gap="s">
        {onShare && (
          <TouchableOpacity onPress={onShare} activeOpacity={0.7} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} testID="overlay-btn-share" accessibilityLabel={t('actions.share')} accessibilityRole="button">
            <Box
              width={moderateScale(32)}
              height={moderateScale(32)}
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              style={[dynamicStyles.shareButton, overlayButtonShadow.shadow]}>
              <Icon source="share-variant" size={moderateScale(16)} color={palette.green700} />
            </Box>
          </TouchableOpacity>
        )}
        {onHeart && (
          <OverlayButton icon={isFavourited ? 'heart' : 'heart-outline'} onPress={onHeart} accessibilityLabel={isFavourited ? t('actions.removeFromFavourites') : t('actions.addToFavourites')} />
        )}
      </Box>
    </Box>
  );
});
