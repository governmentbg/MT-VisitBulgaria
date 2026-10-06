import React, {useRef, useEffect, useMemo, useCallback} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Box, Text, Pressable} from '../../design';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';
import {useAudioPlayer} from '../../contexts/AudioPlayerContext';
import {formatTime} from '../../services/audioPlayerService';
import type {AudioSegment} from '../../models/AudioGuide';
import {useTranslation} from 'react-i18next';

interface AudioTranscriptionProps {
  segments: AudioSegment[];
}

/**
 * Scrollable transcription display with synced highlighting
 */
export function AudioTranscription({segments}: AudioTranscriptionProps) {
  const {t} = useTranslation('audio');
  const theme = useTheme<Theme>();
  const scrollViewRef = useRef<ScrollView>(null);
  const segmentRefs = useRef<{[key: number]: number}>({});
  const {position, seekTo} = useAudioPlayer();

  // Find the current segment based on playback position
  const currentSegmentIndex = segments.findIndex(
    segment => position >= segment.startTime && position < segment.endTime,
  );

  // Auto-scroll to current segment
  useEffect(() => {
    if (currentSegmentIndex >= 0 && scrollViewRef.current) {
      const offsetY = segmentRefs.current[currentSegmentIndex];
      if (offsetY !== undefined) {
        scrollViewRef.current.scrollTo({
          y: Math.max(0, offsetY - 100), // Offset to show some context above
          animated: true,
        });
      }
    }
  }, [currentSegmentIndex]);

  const activeSegmentStyle = useMemo(() => ({
    backgroundColor: theme.colors.primaryLight || `${theme.colors.primary}20`,
    borderLeftColor: theme.colors.primary,
  }), [theme.colors.primaryLight, theme.colors.primary]);

  const handleSegmentPress = useCallback(async (segment: AudioSegment) => {
    try {
      await seekTo(segment.startTime);
    } catch (error) {
      if (__DEV__) console.warn('[AudioTranscription] Seek error:', error);
    }
  }, [seekTo]);

  const measureSegment = useCallback((index: number, y: number) => {
    segmentRefs.current[index] = y;
  }, []);

  if (!segments || segments.length === 0) {
    return (
      <Box padding="m" alignItems="center">
        <Text variant="body" color="textSecondary">
          {t('noTranscription')}
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <Box
        paddingHorizontal="m"
        paddingVertical="s"
        borderBottomWidth={1}
        style={{borderBottomColor: theme.colors.border}}>
        <Text variant="subtitle">{t('transcription')}</Text>
      </Box>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator>
        {segments.map((segment, index) => {
          const isActive = index === currentSegmentIndex;

          return (
            <Pressable
              key={`${segment.startTime}-${segment.endTime}`}
              onPress={() => handleSegmentPress(segment)}
              onLayout={event => {
                measureSegment(index, event.nativeEvent.layout.y);
              }}
              style={[
                styles.segment,
                isActive ? activeSegmentStyle : styles.segmentInactive,
              ]}
              accessibilityLabel={t('a11y.transcriptionSeek', {time: formatTime(segment.startTime)})}
              accessibilityRole="button"
              accessibilityState={{selected: isActive}}>
              <Box flexDirection="row" alignItems="flex-start">
                <Text
                  variant="small"
                  color={isActive ? 'primary' : 'textSecondary'}
                  style={styles.timestamp}>
                  {formatTime(segment.startTime)}
                </Text>
                <Box flex={1}>
                  <Text
                    variant="body"
                    color={isActive ? 'textPrimary' : 'textSecondary'}
                    style={isActive && styles.activeText}>
                    {segment.text}
                  </Text>
                </Box>
              </Box>
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  segment: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 3,
    marginVertical: 2,
  },
  segmentInactive: {
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  timestamp: {
    width: 50,
    marginRight: 12,
  },
  activeText: {
    fontWeight: '500',
  },
});
