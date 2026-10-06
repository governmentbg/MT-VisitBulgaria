import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {Box, Text, Icon, Pressable} from '../../design';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';
import {useAudioPlayer} from '../../contexts/AudioPlayerContext';
import {formatTime} from '../../services/audioPlayerService';
import {useTranslation} from 'react-i18next';

/**
 * Full audio controls for the attraction detail screen
 */
export function AudioControls() {
  const {t} = useTranslation('audio');
  const {t: tCommon} = useTranslation('common');
  const theme = useTheme<Theme>();
  const {
    isPlaying,
    isLoading,
    position,
    duration,
    queueSize,
    currentTrackIndex,
    hasPreviousTrack,
    hasNextTrack,
    seekTo,
    skipForward,
    skipBackward,
    skipToNext,
    skipToPrevious,
    togglePlayPause,
  } = useAudioPlayer();

  const dynamicStyles = useMemo(() => ({
    queueInfo: {backgroundColor: theme.colors.surfaceBackground},
    playButton: {backgroundColor: theme.colors.primary},
  }), [theme.colors.surfaceBackground, theme.colors.primary]);

  const handleSeek = async (value: number) => {
    try {
      await seekTo(value);
    } catch (error) {
      if (__DEV__) console.warn('[AudioControls] Seek error:', error);
    }
  };

  const handleSkipBackward = async () => {
    try {
      await skipBackward(15);
    } catch (error) {
      if (__DEV__) console.warn('[AudioControls] Skip backward error:', error);
    }
  };

  const handleSkipForward = async () => {
    try {
      await skipForward(15);
    } catch (error) {
      if (__DEV__) console.warn('[AudioControls] Skip forward error:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await skipToPrevious();
    } catch (error) {
      if (__DEV__) console.warn('[AudioControls] Skip to previous error:', error);
    }
  };

  const handleNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      if (__DEV__) console.warn('[AudioControls] Skip to next error:', error);
    }
  };

  return (
    <Box>
      {/* Queue Info */}
      {queueSize > 1 && (
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          marginBottom="m"
          padding="s"
          borderRadius="s"
          style={dynamicStyles.queueInfo}>
          <Icon source="playlist-music" size={16} color="textSecondary" />
          <Text variant="small" color="textSecondary" marginLeft="xs">
            {t('trackOf', {current: (currentTrackIndex ?? 0) + 1, total: queueSize})}
          </Text>
        </Box>
      )}

      {/* Progress Slider */}
      <Box marginBottom="s">
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={position}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary}
          accessibilityLabel={t('a11y.seekSlider')}
          accessibilityRole="adjustable"
        />

        {/* Time Labels */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingHorizontal="s">
          <Text variant="small" color="textSecondary">
            {formatTime(position)}
          </Text>
          <Text variant="small" color="textSecondary">
            {formatTime(duration)}
          </Text>
        </Box>
      </Box>

      {/* Control Buttons */}
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap="m"
        marginTop="m">
        {/* Previous Track */}
        <Pressable
          onPress={handlePrevious}
          disabled={!hasPreviousTrack}
          style={styles.skipButton}
          accessibilityLabel={t('a11y.previousTrack')}
          accessibilityRole="button"
          accessibilityState={{disabled: !hasPreviousTrack}}>
          <Icon
            source="skip-previous"
            size={32}
            color={hasPreviousTrack ? 'textPrimary' : 'textSecondary'}
          />
        </Pressable>

        {/* Skip Backward 15s */}
        <Pressable
          onPress={handleSkipBackward}
          style={styles.skipButton}
          accessibilityLabel={t('a11y.skipBackward')}
          accessibilityRole="button">
          <Icon source="rewind-15" size={28} color="textPrimary" />
        </Pressable>

        {/* Play/Pause */}
        <Pressable
          onPress={togglePlayPause}
          style={[
            styles.playButton,
            dynamicStyles.playButton,
          ]}
          accessibilityLabel={isPlaying ? tCommon('a11y.pause') : tCommon('a11y.play')}
          accessibilityRole="button">
          {isLoading ? (
            <Icon source="loading" size={36} color="textOnPrimary" />
          ) : (
            <Icon
              source={isPlaying ? 'pause' : 'play'}
              size={36}
              color="textOnPrimary"
            />
          )}
        </Pressable>

        {/* Skip Forward 15s */}
        <Pressable
          onPress={handleSkipForward}
          style={styles.skipButton}
          accessibilityLabel={t('a11y.skipForward')}
          accessibilityRole="button">
          <Icon source="fast-forward-15" size={28} color="textPrimary" />
        </Pressable>

        {/* Next Track */}
        <Pressable
          onPress={handleNext}
          disabled={!hasNextTrack}
          style={styles.skipButton}
          accessibilityLabel={t('a11y.nextTrack')}
          accessibilityRole="button"
          accessibilityState={{disabled: !hasNextTrack}}>
          <Icon
            source="skip-next"
            size={32}
            color={hasNextTrack ? 'textPrimary' : 'textSecondary'}
          />
        </Pressable>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 40,
  },
  skipButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
