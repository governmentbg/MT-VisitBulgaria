import React from 'react';
import {StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Box, Text, Icon} from '../design';
import {fonts} from '../theme/fonts';
import {moderateScale} from '../theme/scaling';
import {palette} from '../theme/palette';
import {useTranslation} from 'react-i18next';

interface MaintenanceScreenProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

/**
 * Full-screen overlay shown when the API is unreachable (network error, 502/503).
 * Not a real maintenance signal — it's a connectivity fallback.
 */
export function MaintenanceScreen({onRetry, isRetrying}: MaintenanceScreenProps) {
  const {t} = useTranslation('common');

  return (
    <Box flex={1} backgroundColor="mainBackground" justifyContent="center" alignItems="center" padding="xl">
      {/* Icon */}
      <Box
        width={moderateScale(80)}
        height={moderateScale(80)}
        borderRadius="full"
        alignItems="center"
        justifyContent="center"
        marginBottom="l"
        style={styles.iconContainer}>
        <Icon source="cloud-off-outline" size={moderateScale(36)} color={palette.green700} />
      </Box>

      {/* Title */}
      <Text fontFamily={fonts.bold} style={styles.title}>
        {t('maintenance.title', {defaultValue: 'Can\'t reach the server'})}
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        {t('maintenance.message', {
          defaultValue: 'We couldn\'t connect to our servers. Please check your internet connection and try again.',
        })}
      </Text>

      {/* Retry button */}
      <TouchableOpacity
        onPress={onRetry}
        disabled={isRetrying}
        activeOpacity={0.8}
        style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}>
        {isRetrying ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Icon source="refresh" size={moderateScale(18)} color="#FFFFFF" />
            <Text fontFamily={fonts.bold} style={styles.retryText}>
              {t('maintenance.retry', {defaultValue: 'Try again'})}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Subtle hint */}
      <Text style={styles.hint}>
        {t('maintenance.hint', {defaultValue: 'If the problem persists, please try again later'})}
      </Text>
    </Box>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: palette.green50,
  },
  title: {
    fontSize: moderateScale(22),
    color: palette.gray900,
    textAlign: 'center',
    marginBottom: moderateScale(12),
  },
  description: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(15 * 1.6),
    color: palette.gray400,
    textAlign: 'center',
    marginBottom: moderateScale(32),
    paddingHorizontal: moderateScale(16),
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    backgroundColor: palette.green700,
    borderRadius: 48,
    height: moderateScale(48),
    paddingHorizontal: moderateScale(32),
    marginBottom: moderateScale(16),
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryText: {
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
  hint: {
    fontSize: moderateScale(13),
    color: palette.gray400,
    textAlign: 'center',
  },
});
