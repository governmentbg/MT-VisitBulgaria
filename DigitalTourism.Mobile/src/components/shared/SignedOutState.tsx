import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Text, Icon, type IconName} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';

interface SignedOutStateProps {
  icon: IconName;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function SignedOutState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: SignedOutStateProps) {
  return (
    <Box
      flex={1}
      backgroundColor="surfaceBackground"
      justifyContent="center"
      alignItems="center"
      paddingHorizontal="l">
      <Box
        width={moderateScale(80)}
        height={moderateScale(80)}
        borderRadius="full"
        backgroundColor="primaryLight"
        alignItems="center"
        justifyContent="center"
        marginBottom="l">
        <Icon source={icon} size={moderateScale(36)} color="primary" />
      </Box>
      <Text
        fontFamily={fonts.bold}
        color="textHeading"
        marginBottom="s"
        style={styles.title}>
        {title}
      </Text>
      <Text
        variant="body"
        color="textSecondary"
        marginBottom="l"
        style={styles.description}>
        {description}
      </Text>
      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.7}
        style={styles.buttonWrapper}>
        <Box
          backgroundColor="primary"
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
          style={styles.button}>
          <Text
            fontFamily={fonts.bold}
            color="textOnPrimary"
            style={styles.buttonText}>
            {actionLabel}
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttonWrapper: {
    alignSelf: 'stretch',
  },
  button: {
    height: moderateScale(48),
  },
  buttonText: {
    fontSize: moderateScale(16),
  },
});
