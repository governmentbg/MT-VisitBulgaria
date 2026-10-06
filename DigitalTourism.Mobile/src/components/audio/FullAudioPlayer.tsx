import React, {useEffect, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Text, Icon, Pressable} from '../../design';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';
import {useAudioPlayer} from '../../contexts/AudioPlayerContext';
import {AudioControls} from './AudioControls';
import {AudioTranscription} from './AudioTranscription';
import type {AudioGuide} from '../../models/AudioGuide';
import type {Attraction} from '../../models/Attraction';
import {useTranslation} from 'react-i18next';
import {useAlert} from '../../contexts/AlertContext';

interface FullAudioPlayerProps {
  attraction: Attraction;
  audioGuide: AudioGuide;
  autoPlay?: boolean;
}

/**
 * Full audio player component for attraction detail screen
 * Includes controls and transcription
 */
export function FullAudioPlayer({
  attraction,
  audioGuide,
  autoPlay = false,
}: FullAudioPlayerProps) {
  const {t} = useTranslation('audio');
  const {t: tErrors} = useTranslation('errors');
  const {alert} = useAlert();
  const theme = useTheme<Theme>();
  const {currentTrack, playTrack, isLoading} = useAudioPlayer();

  const dynamicStyles = useMemo(() => ({
    headerBorder: {borderBottomColor: theme.colors.border},
    drmBadge: {backgroundColor: theme.colors.warning + '20'},
    playButton: {backgroundColor: theme.colors.primary},
    footerBorder: {borderTopColor: theme.colors.border},
  }), [theme.colors.border, theme.colors.warning, theme.colors.primary]);

  // Check if this attraction's audio is currently loaded
  const isCurrentTrack = currentTrack?.attractionId === attraction.id;

  // Auto-play on mount if requested and not already playing
  useEffect(() => {
    if (autoPlay && !isCurrentTrack && !isLoading) {
      playTrack(attraction).catch((error) => {
        if (__DEV__) console.warn('[FullAudioPlayer] Auto-play error:', error);
      });
    }
  }, [autoPlay, isCurrentTrack, isLoading, playTrack, attraction]);

  const handlePlay = async () => {
    if (!isCurrentTrack) {
      try {
        await playTrack(attraction);
      } catch (error) {
        if (__DEV__) console.warn('[FullAudioPlayer] Playback error:', error);
        alert(tErrors('audio.playbackFailed'), tErrors('audio.playbackFailedMessage'));
      }
    }
  };

  return (
    <Box
      style={styles.container}
      borderRadius="m"
      overflow="hidden"
      backgroundColor="surfaceBackground">
      {/* Header */}
      <Box
        padding="m"
        flexDirection="row"
        alignItems="center"
        style={dynamicStyles.headerBorder}
        borderBottomWidth={1}>
        <Icon source="headphones" size={24} color="primary" />
        <Box marginLeft="m" flex={1}>
          <Text variant="subtitle">{t('audioGuide')}</Text>
          <Text variant="small" color="textSecondary">
            {t('minutesLanguage', {minutes: Math.floor(audioGuide.duration / 60), language: audioGuide.language.toUpperCase()})}
          </Text>
        </Box>
        {audioGuide.hasDRM && (
          <Box
            paddingHorizontal="s"
            paddingVertical="xs"
            borderRadius="s"
            style={dynamicStyles.drmBadge}>
            <Text variant="small" color="warning">
              {t('protected')}
            </Text>
          </Box>
        )}
      </Box>

      {/* Play prompt if not current track */}
      {!isCurrentTrack && (
        <Box padding="m" alignItems="center">
          <Text variant="body" color="textSecondary" textAlign="center" marginBottom="m">
            {t('tapToStart')}
          </Text>
        </Box>
      )}

      {/* Audio Controls */}
      <Box padding="m">
        {isCurrentTrack ? (
          <AudioControls />
        ) : (
          <Box alignItems="center" padding="m">
            <Pressable
              onPress={handlePlay}
              style={[
                styles.playPromptButton,
                dynamicStyles.playButton,
              ]}
              accessibilityLabel={t('a11y.playPause')}
              accessibilityRole="button">
              <Icon
                source="play"
                size={32}
                color="textOnPrimary"                
              />
            </Pressable>
          </Box>
        )}
      </Box>

      {/* Transcription */}
      {isCurrentTrack && audioGuide.transcription.length > 0 && (
        <Box style={styles.transcriptionContainer}>
          <AudioTranscription segments={audioGuide.transcription} />
        </Box>
      )}

      {/* Transcription preview if not playing */}
      {!isCurrentTrack && audioGuide.transcription.length > 0 && (
        <Box padding="m" style={dynamicStyles.footerBorder} borderTopWidth={1}>
          <Text variant="small" color="textSecondary">
            {t('segmentsPreview', {count: audioGuide.transcription.length})}
          </Text>
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  playPromptButton: {
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
  transcriptionContainer: {
    maxHeight: 250,
    borderTopWidth: 1,
  },
});
