import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text, Icon, type IconName} from '../../design';
import {moderateScale} from '../../theme/scaling';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({icon, title, subtitle, actionLabel, onAction}: EmptyStateProps) {
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
      <Text
        variant="caption"
        color="textSecondary"
        marginBottom="l"
        style={styles.centerText}>
        {subtitle}
      </Text>
      <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
        <Box
          backgroundColor="primary"
          borderRadius="full"
          paddingHorizontal="xl"
          paddingVertical="m">
          <Text variant="button" color="textOnPrimary">
            {actionLabel}
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
