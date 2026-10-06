import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {Box} from '../../../design';
import {useTheme} from '@shopify/restyle';
import type {Theme} from '../../../theme';

interface DotIndicatorProps {
  currentPage: number;
  totalPages: number;
}

function Dot({isActive}: {isActive: boolean}) {
  const theme = useTheme<Theme>();

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isActive ? 24 : 8, {damping: 15, stiffness: 150}),
    backgroundColor: isActive
      ? theme.colors.accentGreen
      : theme.colors.gray400,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function DotIndicator({currentPage, totalPages}: DotIndicatorProps) {
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center" gap="s">
      {Array.from({length: totalPages}, (_, i) => (
        <Dot key={i} isActive={i === currentPage} />
      ))}
    </Box>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
