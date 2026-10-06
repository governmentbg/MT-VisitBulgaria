import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import {Box, Text} from '../../../design';
import {fonts} from '../../../theme/fonts';

const SMOOTH_DECEL = Easing.bezier(0.22, 1.0, 0.36, 1.0);

// Text appears after illustration has started
const TITLE_DELAY = 600;
const DESC_DELAY = 800;
const TEXT_DURATION = 500;
const TEXT_SLIDE = 30;

interface CarouselPageProps {
  title: string;
  description: string;
  isActive: boolean;
  renderIllustration: (isActive: boolean) => React.ReactNode;
}

export function CarouselPage({
  title,
  description,
  isActive,
  renderIllustration,
}: CarouselPageProps) {
  const titleProgress = useSharedValue(0);
  const descProgress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      titleProgress.value = withDelay(
        TITLE_DELAY,
        withTiming(1, {duration: TEXT_DURATION, easing: SMOOTH_DECEL}),
      );
      descProgress.value = withDelay(
        DESC_DELAY,
        withTiming(1, {duration: TEXT_DURATION, easing: SMOOTH_DECEL}),
      );
    } else {
      cancelAnimation(titleProgress);
      cancelAnimation(descProgress);
      titleProgress.value = 0;
      descProgress.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [isActive]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleProgress.value,
    transform: [
      {
        translateY: interpolate(titleProgress.value, [0, 1], [TEXT_SLIDE, 0]),
      },
    ],
  }));

  const descStyle = useAnimatedStyle(() => ({
    opacity: descProgress.value,
    transform: [
      {
        translateY: interpolate(descProgress.value, [0, 1], [TEXT_SLIDE, 0]),
      },
    ],
  }));

  return (
    <Box flex={1}>
      {/* Illustration area */}
      <Box flex={1}>
        {renderIllustration(isActive)}
      </Box>

      {/* Text content */}
      <Box paddingHorizontal="m" paddingVertical="l" gap="s">
        <Animated.View style={titleStyle}>
          <Text
            variant="title"
            fontFamily={fonts.bold}
            textAlign="center"
            color="textPrimary">
            {title}
          </Text>
        </Animated.View>
        <Animated.View style={descStyle}>
          <Text
            variant="body"
            textAlign="center"
            color="textSecondary"
            style={styles.description}>
            {description}
          </Text>
        </Animated.View>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  description: {
    maxWidth: 360,
    alignSelf: 'center',
  },
});
