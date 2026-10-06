import React, {useState, useMemo} from 'react';
import {ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {Box, Text, Icon} from '../../design';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';
import type {AudioGuide, AudioGuideSection} from '../../models/AudioGuide';
import type {Attraction} from '../../models/Attraction';
import {useAudioPlayer} from '../../contexts/AudioPlayerContext';
import {formatTime} from '../../services/audioPlayerService';
import {useTranslation} from 'react-i18next';
import {useAlert} from '../../contexts/AlertContext';

interface AudioGuideSelectorProps {
  attraction: Attraction;
}

/**
 * Audio Guide Selector - Displays and allows selection of audio guides
 * Shows sections with multiple guides per attraction
 */
export function AudioGuideSelector({attraction}: AudioGuideSelectorProps) {
  const {t} = useTranslation('audio');
  const {t: tErrors} = useTranslation('errors');
  const {alert} = useAlert();
  const theme = useTheme<Theme>();
  const {playTrack, playAttractionQueue, currentTrack, isPlaying} = useAudioPlayer();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Support both legacy single audioGuide and new audioGuides sections
  const sections: AudioGuideSection[] = attraction.audioGuides || [];
  const hasLegacyGuide = attraction.audioGuide && !sections.length;

  // Create a legacy section if only old format exists
  const legacySection: AudioGuideSection | null = hasLegacyGuide
    ? {
        id: 'legacy',
        title: 'Audio Guide',
        description: 'Explore this landmark',
        guides: [attraction.audioGuide!],
        order: 0,
      }
    : null;

  const allSections = legacySection ? [legacySection] : sections;

  const dynamicStyles = useMemo(() => ({
    sectionBackground: {backgroundColor: theme.colors.surfaceBackground},
    playAllButton: {backgroundColor: theme.colors.primary},
    guideItemActive: {
      backgroundColor: theme.colors.primary + '20',
      borderColor: theme.colors.primary,
    },
    guideItemInactive: {
      backgroundColor: theme.colors.surfaceBackground,
      borderColor: theme.colors.border,
    },
  }), [theme.colors.surfaceBackground, theme.colors.primary, theme.colors.border]);

  if (!allSections.length) {
    return null;
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handlePlayGuide = async (audioGuide: AudioGuide) => {
    try {
      await playTrack(attraction, audioGuide);
    } catch (error) {
      if (__DEV__) console.warn('[AudioGuideSelector] Playback error:', error);
      alert(tErrors('audio.playbackFailed'), tErrors('audio.playbackFailedMessage'));
    }
  };

  const handlePlayAllInSection = async (section: AudioGuideSection) => {
    try {
      await playAttractionQueue(attraction, section.id);
    } catch (error) {
      if (__DEV__) console.warn('[AudioGuideSelector] Play all error:', error);
      alert(tErrors('audio.playbackFailed'), tErrors('audio.playbackFailedMessage'));
    }
  };

  const isGuideActive = (guideId: string) => {
    return currentTrack?.audioGuide.id === guideId;
  };

  const totalGuidesCount = allSections.reduce(
    (sum, section) => sum + section.guides.length,
    0,
  );

  return (
    <Box marginBottom="m">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="m">
        <Text variant="subtitle">
          {t('audioGuides', {count: totalGuidesCount})}
        </Text>
      </Box>

      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        {allSections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          const hasMultipleGuides = section.guides.length > 1;

          return (
            <Box
              key={section.id}
              marginBottom="m"
              padding="m"
              borderRadius="m"
              style={dynamicStyles.sectionBackground}>
              {/* Section Header */}
              <TouchableOpacity
                onPress={() => hasMultipleGuides && toggleSection(section.id)}
                activeOpacity={hasMultipleGuides ? 0.7 : 1}
                accessibilityRole="button"
                accessibilityState={{expanded: isExpanded}}>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Box flex={1}>
                    <Text variant="subtitle" marginBottom="xs">
                      {section.title}
                    </Text>
                    {section.description && (
                      <Text variant="caption" color="textSecondary">
                        {section.description}
                      </Text>
                    )}
                    <Text variant="caption" color="textSecondary" marginTop="xs">
                      {t('guide', {count: section.guides.length})}
                    </Text>
                  </Box>
                  {hasMultipleGuides && (
                    <Box marginLeft="m">
                      <Icon
                        source={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={theme.colors.textSecondary}
                      />
                    </Box>
                  )}
                </Box>
              </TouchableOpacity>

              {/* Play All Button (if multiple guides) */}
              {hasMultipleGuides && (
                <TouchableOpacity
                  onPress={() => handlePlayAllInSection(section)}
                  style={styles.playAllButton}
                  accessibilityLabel={t('a11y.playAll')}
                  accessibilityRole="button">
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    paddingVertical="s"
                    paddingHorizontal="m"
                    borderRadius="m"
                    style={dynamicStyles.playAllButton}>
                    <Icon
                      source="play-circle"
                      size={20}
                      color={theme.colors.textOnPrimary}
                    />
                    <Text
                      variant="body"
                      color="textOnPrimary"
                      marginLeft="s"
                      fontWeight="bold">
                      {t('playAll')}
                    </Text>
                  </Box>
                </TouchableOpacity>
              )}

              {/* Audio Guides List */}
              {(isExpanded || !hasMultipleGuides) && (
                <Box marginTop="m" gap="s">
                  {section.guides.map(guide => {
                    const isActive = isGuideActive(guide.id);
                    const isCurrentlyPlaying = isActive && isPlaying;

                    return (
                      <TouchableOpacity
                        key={guide.id}
                        onPress={() => handlePlayGuide(guide)}
                        activeOpacity={0.7}
                        accessibilityLabel={t('a11y.playGuide', {title: guide.title})}
                        accessibilityRole="button"
                        accessibilityState={{selected: isActive}}>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          padding="m"
                          borderRadius="s"
                          style={[
                            isActive ? styles.guideItemActive : styles.guideItemInactive,
                            isActive ? dynamicStyles.guideItemActive : dynamicStyles.guideItemInactive,
                          ]}>
                          {/* Play Icon */}
                          <Box marginRight="m">
                            <Icon
                              source={isCurrentlyPlaying ? 'pause-circle' : 'play-circle'}
                              size={32}
                              color={
                                isActive
                                  ? theme.colors.primary
                                  : theme.colors.textSecondary
                              }
                            />
                          </Box>

                          {/* Guide Info */}
                          <Box flex={1}>
                            <Text
                              variant="body"
                              fontWeight={isActive ? 'bold' : 'normal'}
                              color={isActive ? 'primary' : 'textPrimary'}>
                              {guide.title}
                            </Text>
                            {guide.description && (
                              <Text
                                variant="caption"
                                color="textSecondary"
                                marginTop="xs">
                                {guide.description}
                              </Text>
                            )}
                            <Box flexDirection="row" alignItems="center" marginTop="xs">
                              <Icon
                                source="clock-outline"
                                size={14}
                                color={theme.colors.textSecondary}
                              />
                              <Text
                                variant="caption"
                                color="textSecondary"
                                marginLeft="xs">
                                {formatTime(guide.duration)}
                              </Text>
                              <Text
                                variant="caption"
                                color="textSecondary"
                                marginLeft="m">
                                {guide.language.toUpperCase()}
                              </Text>
                            </Box>
                          </Box>
                        </Box>
                      </TouchableOpacity>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  playAllButton: {
    marginTop: 12,
  },
  guideItemActive: {
    borderWidth: 2,
  },
  guideItemInactive: {
    borderWidth: 1,
  },
});
