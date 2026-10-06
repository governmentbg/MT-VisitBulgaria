import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface DetailBottomCTAsProps {
  primaryLabel: string;
  primaryOnPress: () => void;
  secondaryLabel?: string;
  secondaryOnPress?: () => void;
}

export const DetailBottomCTAs = React.memo(function DetailBottomCTAs({
  primaryLabel,
  primaryOnPress,
  secondaryLabel,
  secondaryOnPress,
}: DetailBottomCTAsProps) {
  const insets = useSafeAreaInsets();
  const hasSecondary = !!(secondaryLabel && secondaryOnPress);

  return (
    <Box position="absolute" left={0} right={0} bottom={0}>
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.gradient}
      />
      <Box
        backgroundColor="mainBackground"
        flexDirection="row"
        paddingHorizontal="m"
        gap="s"
        style={{paddingBottom: insets.bottom + moderateScale(12)}}>
        {hasSecondary && (
          <TouchableOpacity
            style={[styles.ctaButton, styles.ctaSecondary]}
            onPress={secondaryOnPress}
            activeOpacity={0.8}
            accessibilityLabel={secondaryLabel}
            accessibilityRole="button">
            <Text fontFamily={fonts.bold} style={styles.ctaSecondaryText}>
              {secondaryLabel}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.ctaButton, styles.ctaPrimary]}
          onPress={primaryOnPress}
          activeOpacity={0.8}
          accessibilityLabel={primaryLabel}
          accessibilityRole="button">
          <Text fontFamily={fonts.bold} style={styles.ctaPrimaryText}>
            {primaryLabel}
          </Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
});

const styles = StyleSheet.create({
  gradient: {
    height: moderateScale(80),
  },
  ctaButton: {
    flex: 1,
    height: moderateScale(48),
    borderRadius: 48,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  ctaSecondary: {
    backgroundColor: palette.green50,
  },
  ctaPrimary: {
    backgroundColor: palette.green700,
  },
  ctaSecondaryText: {
    fontSize: moderateScale(16),
    color: palette.green800,
  },
  ctaPrimaryText: {
    fontSize: moderateScale(16),
    color: palette.white,
  },
});
