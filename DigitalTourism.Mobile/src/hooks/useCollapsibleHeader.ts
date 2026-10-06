import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  withTiming,
} from 'react-native-reanimated';

function interpolateCollapsible(
  scrollValue: number,
  threshold: number,
  targetHeight: number,
): {height: number; opacity: number} {
  'worklet';
  const height = interpolate(scrollValue, [0, threshold], [targetHeight, 0], Extrapolation.CLAMP);
  const opacity = interpolate(scrollValue, [0, threshold * 0.5], [1, 0], Extrapolation.CLAMP);
  return {height, opacity};
}

export interface CollapsibleHeaderConfig {
  fullHeight: number;
  collapsedHeight: number;
  titleSectionHeight: number;
  chipsSectionHeight: number;
  paddingExpanded: number;
  paddingCollapsed: number;
}

export function useCollapsibleHeader(config: CollapsibleHeaderConfig) {
  const {
    fullHeight,
    collapsedHeight,
    titleSectionHeight,
    chipsSectionHeight,
    paddingExpanded,
    paddingCollapsed,
  } = config;

  const collapseThreshold = fullHeight - collapsedHeight;
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = Math.max(0, event.contentOffset.y);
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, collapseThreshold],
      [fullHeight, collapsedHeight],
      Extrapolation.CLAMP,
    );
    const paddingBottom = interpolate(
      scrollY.value,
      [0, collapseThreshold],
      [paddingExpanded, paddingCollapsed],
      Extrapolation.CLAMP,
    );
    return {height, paddingBottom};
  });

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    ...interpolateCollapsible(scrollY.value, collapseThreshold, titleSectionHeight),
    overflow: 'hidden' as const,
  }));

  const chipsAnimatedStyle = useAnimatedStyle(() => ({
    ...interpolateCollapsible(scrollY.value, collapseThreshold, chipsSectionHeight),
    overflow: 'hidden' as const,
  }));

  /** Reset scroll position and expand the header (e.g., when filters change). */
  const resetScroll = (listRef: {current: {scrollToOffset: (opts: {offset: number; animated: boolean}) => void} | null}) => {
    listRef.current?.scrollToOffset({offset: 0, animated: true});
    scrollY.value = withTiming(0, {duration: 300});
  };

  return {
    scrollY,
    scrollHandler,
    headerAnimatedStyle,
    titleAnimatedStyle,
    chipsAnimatedStyle,
    resetScroll,
  };
}
