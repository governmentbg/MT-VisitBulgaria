import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import FastImage, {FastImageProps, OnLoadEvent} from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  interpolate,
} from 'react-native-reanimated';

export type ImageProps = FastImageProps & {
  /** Disable the skeleton shimmer while loading (default: shown for uri sources) */
  disableSkeleton?: boolean;
};

const SHIMMER_BG = '#E1E9EE';

/**
 * Image component wrapping FastImage with an automatic shimmer pulse
 * shown while the image loads from a network URI.
 *
 * FastImage already renders its own wrapper View internally, so we pass
 * the shimmer as `children` — no extra View layer needed.
 */
export const Image: React.FC<ImageProps> = ({
  disableSkeleton,
  onLoad,
  onError,
  style,
  source,
  children,
  ...rest
}) => {
  const isNetworkImage =
    !disableSkeleton &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    'uri' in source &&
    !!source.uri;

  const [loaded, setLoaded] = useState(!isNetworkImage);

  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (!loaded) {
      shimmer.value = withRepeat(withTiming(1, {duration: 1000}), -1, true);
    }
    return () => cancelAnimation(shimmer);
  }, [loaded, shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [1, 0.5]),
  }));

  const handleLoad = useCallback(
    (e: OnLoadEvent) => {
      setLoaded(true);
      onLoad?.(e);
    },
    [onLoad],
  );

  const handleLoadEnd = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setLoaded(true);
    onError?.();
  }, [onError]);

  // No skeleton needed — render plain FastImage
  if (!isNetworkImage) {
    return (
      <FastImage {...rest} source={source} style={style} onLoad={onLoad} onError={onError}>
        {children}
      </FastImage>
    );
  }

  return (
    <FastImage
      {...rest}
      source={source}
      style={style}
      onLoad={handleLoad}
      onLoadEnd={handleLoadEnd}
      onError={handleError}>
      {!loaded && (
        <Animated.View
          style={[StyleSheet.absoluteFill, {backgroundColor: SHIMMER_BG}, shimmerStyle]}
          pointerEvents="none"
        />
      )}
      {children}
    </FastImage>
  );
};

export const ResizeMode = FastImage.resizeMode;
export const Priority = FastImage.priority;
export const CacheControl = FastImage.cacheControl;
export const Preload = FastImage.preload;
