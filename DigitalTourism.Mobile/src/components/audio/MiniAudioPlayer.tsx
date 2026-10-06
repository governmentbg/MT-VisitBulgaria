import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { Box, Icon, Pressable, Text, Image } from '../../design';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import {
  useAudioPlayer,
  useMiniPlayerVisible,
} from '../../contexts/AudioPlayerContext';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatTime } from '../../services/audioPlayerService';
import { useTranslation } from 'react-i18next';
import { useCornerSnapGesture } from '../../hooks/useCornerSnapGesture';
import { styles, MINI_PLAYER_HEIGHT, PADDING, TAB_BAR_HEIGHT } from './MiniAudioPlayer.styles';

/**
 * Mini Audio Player - Persistent floating bar shown when audio is playing
 * Appears above the tab bar
 */
export function MiniAudioPlayer() {
  const { t } = useTranslation('audio');
  const { t: tCommon } = useTranslation('common');
  const theme = useTheme<Theme>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isVisible = useMiniPlayerVisible();
  const navigation = useNavigation();
  const { isInTabNavigator } = useNavigationContext();
  const {
    currentTrack,
    currentAttraction,
    isPlaying,
    isLoading,
    position,
    duration,
    queueSize,
    hasPreviousTrack,
    hasNextTrack,
    stop,
    skipToNext,
    skipToPrevious,
    togglePlayPause,
  } = useAudioPlayer();

  const MINI_PLAYER_WIDTH = screenWidth * 0.45;

  // Corner-snapping gesture + visibility animation
  const { panGesture, animatedContainerStyle } = useCornerSnapGesture({
    playerWidth: MINI_PLAYER_WIDTH,
    playerHeight: MINI_PLAYER_HEIGHT,
    padding: PADDING,
    screenWidth,
    screenHeight,
    insets: { top: insets.top, bottom: insets.bottom },
    isInTabNavigator,
    tabBarHeight: TAB_BAR_HEIGHT,
    isVisible,
  });

  const handleNavigateToAttraction = () => {
    if (currentAttraction) {
      navigation.navigate('AttractionDetail', { id: currentAttraction.id });
    }
  };

  // Progress calculation
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  // Progress bar animation
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 950 });
  }, [progress, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleClose = async () => {
    try {
      await stop();
    } catch (error) {
      if (__DEV__) console.warn('[MiniAudioPlayer] Stop error:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await skipToPrevious();
    } catch (error) {
      if (__DEV__) console.warn('[MiniAudioPlayer] Skip to previous error:', error);
    }
  };

  const handleNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      if (__DEV__) console.warn('[MiniAudioPlayer] Skip to next error:', error);
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            width: MINI_PLAYER_WIDTH,
            borderColor: theme.colors.border,
          },
          animatedContainerStyle,
        ]}
      >
        {/* Background Image */}
        {currentTrack.artwork ? (
          <Image
            source={{ uri: currentTrack.artwork }}
            style={styles.backgroundImage}
          />
        ) : (
          <Box
            style={[
              styles.backgroundImage,
              { backgroundColor: theme.colors.border },
            ]}
          />
        )}

        {/* Dark overlay */}
        <Box style={styles.overlay} />

        {/* Progress bar at top */}
        <Box style={styles.progressContainer} backgroundColor="border">
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.primary },
              progressStyle,
            ]}
          />
        </Box>
        {/* Tappable content area */}
        <Pressable
          onPress={handleNavigateToAttraction}
          style={styles.tappableArea}
          accessibilityLabel={currentAttraction?.name || currentTrack.title}
          accessibilityRole="button"
        >
          <Box style={styles.content}>
            <Box
              style={styles.attractionNameContainer}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text style={styles.attractionName} numberOfLines={1}>
                {currentAttraction?.name || currentTrack.title}
              </Text>
            </Box>

            <Box
              flexDirection="row"
              alignItems="center"
              gap="xs"
              style={styles.controlsRow}
            >
              {/* Previous button */}
              {queueSize > 1 && (
                <Pressable
                  onPress={handlePrevious}
                  disabled={!hasPreviousTrack}
                  style={styles.controlButton}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                  accessibilityLabel={t('a11y.previousTrack')}
                  accessibilityRole="button"
                  accessibilityState={{disabled: !hasPreviousTrack}}
                >
                  <Icon
                    source="skip-previous"
                    size={24}
                    color={hasPreviousTrack ? 'textOnPrimary' : 'textSecondary'}
                  />
                </Pressable>
              )}

              {/* Play/Pause button */}
              <Pressable
                onPress={togglePlayPause}
                style={[
                  styles.playButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                accessibilityLabel={isPlaying ? tCommon('a11y.pause') : tCommon('a11y.play')}
                accessibilityRole="button"
              >
                {isLoading ? (
                  <Icon source="loading" size={24} color="textOnPrimary" />
                ) : (
                  <Icon
                    source={isPlaying ? 'pause' : 'play'}
                    size={24}
                    color="textOnPrimary"
                  />
                )}
              </Pressable>

              {/* Next button */}
              {queueSize > 1 && (
                <Pressable
                  onPress={handleNext}
                  disabled={!hasNextTrack}
                  style={styles.controlButton}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                  accessibilityLabel={t('a11y.nextTrack')}
                  accessibilityRole="button"
                  accessibilityState={{disabled: !hasNextTrack}}
                >
                  <Icon
                    source="skip-next"
                    size={24}
                    color={hasNextTrack ? 'textOnPrimary' : 'textSecondary'}
                  />
                </Pressable>
              )}
            </Box>

            {/* Time Display */}
            <Text style={styles.timeContainer}>
              {formatTime(position)} / {formatTime(duration)}
            </Text>
          </Box>
        </Pressable>

        {/* Close button - absolute positioned outside tappable area */}
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityLabel={t('a11y.closePlayer')}
          accessibilityRole="button"
        >
          <Icon source="close" size={18} color="textOnPrimary" />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

/**
 * Export the height for layout calculations
 */
export const MINI_AUDIO_PLAYER_HEIGHT = MINI_PLAYER_HEIGHT;
