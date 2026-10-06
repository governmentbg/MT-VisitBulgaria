import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text, Icon, type IconName} from '../../design';
import {moderateScale} from '../../theme/scaling';

interface ErrorStateProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  retryLabel: string;
  onRetry: () => void;
}

export function ErrorState({
  icon = 'alert-circle-outline',
  title,
  subtitle,
  retryLabel,
  onRetry,
}: ErrorStateProps) {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="xl">
      <Box
        width={moderateScale(64)}
        height={moderateScale(64)}
        borderRadius="full"
        backgroundColor="surfaceBackground"
        alignItems="center"
        justifyContent="center"
        marginBottom="m">
        <Icon source={icon} size="l" color="textTertiary" />
      </Box>
      <Text
        variant="subtitle"
        color="textHeading"
        marginBottom="s"
        style={styles.centerText}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant="caption"
          color="textSecondary"
          marginBottom="l"
          style={styles.centerText}>
          {subtitle}
        </Text>
      ) : null}
      <TouchableOpacity
        onPress={onRetry}
        activeOpacity={0.7}
        accessibilityLabel={retryLabel}
        accessibilityRole="button">
        <Box
          backgroundColor="primary"
          borderRadius="full"
          paddingHorizontal="xl"
          paddingVertical="m">
          <Text variant="button" color="textOnPrimary">
            {retryLabel}
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  centerText: {
    textAlign: 'center',
  },
});
