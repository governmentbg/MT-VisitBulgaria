import React from 'react';
import {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export interface CornerSnapConfig {
  playerWidth: number;
  playerHeight: number;
  padding: number;
  screenWidth: number;
  screenHeight: number;
  insets: {top: number; bottom: number};
  isInTabNavigator: boolean;
  tabBarHeight: number;
  isVisible: boolean;
}

export function useCornerSnapGesture(config: CornerSnapConfig) {
  const {
    playerWidth,
    playerHeight,
    padding,
    screenWidth,
    screenHeight,
    insets,
    isInTabNavigator,
    tabBarHeight,
    isVisible,
  } = config;

  // Position state
  const translateX = useSharedValue(screenWidth - playerWidth - padding);
  const translateY = useSharedValue(screenHeight - playerHeight - padding - 100);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // Visibility animation
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    if (isVisible) {
      opacity.value = withSpring(1, { damping: 20, stiffness: 200 });
      scale.value = withSpring(1, { damping: 20, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [isVisible, opacity, scale]);

  // Animate position when navigation state changes
  React.useEffect(() => {
    if (!isVisible) return;

    const bottomOffset = isInTabNavigator
      ? tabBarHeight + padding
      : padding + insets.bottom;
    const maxY = screenHeight - playerHeight - bottomOffset;
    const minY = padding + insets.top;

    const currentY = translateY.value;
    const isBottom = currentY > screenHeight / 2;
    const newY = isBottom ? maxY : minY;

    translateY.value = withSpring(newY, { damping: 20, stiffness: 200 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInTabNavigator, screenHeight, insets, isVisible]);

  // Store isInTabNavigator state as shared value for worklet access
  const isInTabShared = useSharedValue(isInTabNavigator);

  React.useEffect(() => {
    isInTabShared.value = isInTabNavigator;
  }, [isInTabNavigator, isInTabShared]);

  // Snap to nearest corner or edge
  const snapToCorner = (x: number, y: number) => {
    'worklet';
    const maxX = screenWidth - playerWidth - padding;
    const minX = padding;
    const minY = padding + insets.top;

    const inTab = isInTabShared.value;
    const bottomOffset = inTab
      ? tabBarHeight + padding
      : padding + insets.bottom;
    const maxY = screenHeight - playerHeight - bottomOffset;

    const snapX = x > screenWidth / 2 ? maxX : minX;
    const snapY = y > screenHeight / 2 ? maxY : minY;

    translateX.value = withSpring(snapX, { damping: 20, stiffness: 200 });
    translateY.value = withSpring(snapY, { damping: 20, stiffness: 200 });
  };

  // Gesture handler
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      startX.value = translateX.value;
      startY.value = translateY.value;
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate(event => {
      'worklet';
      const newX = startX.value + event.translationX;
      const newY = startY.value + event.translationY;

      const maxX = screenWidth - playerWidth - padding;
      const minX = padding;
      const minY = padding + insets.top;
      const inTab = isInTabShared.value;
      const bottomOffset = inTab
        ? tabBarHeight + padding
        : padding + insets.bottom;
      const maxY = screenHeight - playerHeight - bottomOffset;

      translateX.value = Math.max(minX, Math.min(maxX, newX));
      translateY.value = Math.max(minY, Math.min(maxY, newY));
    })
    .onEnd(event => {
      'worklet';
      const velocityX = event.velocityX;
      const velocityY = event.velocityY;
      const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

      if (velocity > 500) {
        const finalX = translateX.value + velocityX * 0.1;
        const finalY = translateY.value + velocityY * 0.1;
        snapToCorner(finalX, finalY);
      } else {
        snapToCorner(translateX.value, translateY.value);
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return {
    panGesture,
    animatedContainerStyle,
  };
}
