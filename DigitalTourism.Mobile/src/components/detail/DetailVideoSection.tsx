import React, {useCallback, useState} from 'react';
import {
  Linking,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import {Box, Icon, Image, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {useTranslation} from 'react-i18next';
import {getYouTubeVideoId} from '../../utils/youtube';

interface VideoItem {
  url: string;
  thumbnail?: string;
  title?: string;
}

interface DetailVideoSectionProps {
  videos: VideoItem[];
}

export const DetailVideoSection = React.memo(function DetailVideoSection({
  videos,
}: DetailVideoSectionProps) {
  const {t} = useTranslation('common');

  if (videos.length === 0) {
    return null;
  }

  return (
    <Box gap="s">
      <Text fontFamily={fonts.bold} style={styles.sectionTitle}>
        {t('video')}
      </Text>
      {videos.map(video => (
        <VideoItemView key={video.url} video={video} t={t} />
      ))}
    </Box>
  );
});

interface VideoItemViewProps {
  video: VideoItem;
  t: ReturnType<typeof useTranslation>['t'];
}

function VideoItemView({video, t}: VideoItemViewProps) {
  const videoId = getYouTubeVideoId(video.url);
  const resolvedThumbnail =
    video.thumbnail ??
    (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);

  const {width: windowWidth} = useWindowDimensions();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePress = useCallback(() => {
    if (videoId) {
      setIsFullscreen(true);
      return;
    }
    Linking.openURL(video.url).catch(err => {
      if (__DEV__) console.warn('[Video] Failed to open URL:', err);
    });
  }, [videoId, video.url]);

  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  const playerWidth = windowWidth;
  const playerHeight = Math.round((windowWidth * 9) / 16);

  return (
    <View>
      <View style={styles.thumbnailContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          accessibilityLabel={t('a11y.playVideo', {title: video.title || ''})}
          accessibilityRole="button"
          style={styles.thumbnailTouchable}>
          {resolvedThumbnail ? (
            <Image
              source={{uri: resolvedThumbnail}}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderThumbnail} />
          )}
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Icon
                source="play"
                size={moderateScale(28)}
                color={palette.white}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {video.title && <Text style={styles.videoTitle}>{video.title}</Text>}
      {videoId && (
        <Modal
          visible={isFullscreen}
          animationType="fade"
          presentationStyle="fullScreen"
          onRequestClose={closeFullscreen}
          statusBarTranslucent>
          <StatusBar hidden />
          <SafeAreaView style={styles.fullscreenContainer} edges={['top', 'bottom']}>
            <Pressable
              style={styles.fullscreenBackdrop}
              onPress={closeFullscreen}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.closePlayer')}>
              <Pressable
                onPress={() => {}}
                style={[
                  styles.fullscreenPlayerWrapper,
                  {width: playerWidth, height: playerHeight},
                ]}>
                <YoutubePlayer
                  height={playerHeight}
                  width={playerWidth}
                  play
                  videoId={videoId}
                  initialPlayerParams={{
                    modestbranding: true,
                    rel: false,
                  }}
                  onChangeState={(state: string) => {
                    if (state === 'ended') {
                      closeFullscreen();
                    }
                  }}
                />
              </Pressable>
            </Pressable>
            <TouchableOpacity
              onPress={closeFullscreen}
              style={styles.fullscreenCloseButton}
              hitSlop={{top: 12, right: 12, bottom: 12, left: 12}}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.closePlayer')}>
              <Icon source="close" size={moderateScale(24)} color={palette.white} />
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.2),
    color: palette.heading,
  },
  thumbnailContainer: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    width: '100%',
    backgroundColor: palette.black,
  },
  thumbnailTouchable: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: palette.gray100,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  playButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: fonts.medium,
    color: palette.heading,
    marginTop: moderateScale(6),
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: palette.black,
  },
  fullscreenBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenPlayerWrapper: {
    backgroundColor: palette.black,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: moderateScale(12),
    right: moderateScale(12),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
