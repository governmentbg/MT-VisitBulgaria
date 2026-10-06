import React, {useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {Box, Text, Image, Icon, ResizeMode} from '../../../design';
import {palette} from '../../../theme/palette';
import {fonts} from '../../../theme/fonts';

const eventImage = require('../../../../assets/onboarding/event-jazz-fest.png');

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 60;

const SMOOTH_DECEL = Easing.bezier(0.22, 1.0, 0.36, 1.0);
const OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1.0);

// Animation timing
const CARD_DELAY = 200;
const CARD_DURATION = 650;
const BADGE_DELAY = 600;
const BADGE_DURATION = 400;
const HEART_DELAY = 750;
const HEART_DURATION = 500;

interface EventsIllustrationProps {
  isActive: boolean;
}

export function EventsIllustration({isActive}: EventsIllustrationProps) {
  const {t} = useTranslation('onboarding');
  const cardProgress = useSharedValue(0);
  const cardScale = useSharedValue(0.85);
  const badgeProgress = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const heartProgress = useSharedValue(0);
  const heartScale = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Card slides up + scales in
      cardProgress.value = withDelay(
        CARD_DELAY,
        withTiming(1, {duration: CARD_DURATION, easing: SMOOTH_DECEL}),
      );
      cardScale.value = withDelay(
        CARD_DELAY,
        withSequence(
          withTiming(1.03, {
            duration: CARD_DURATION * 0.7,
            easing: SMOOTH_DECEL,
          }),
          withSpring(1, {damping: 14, stiffness: 180}),
        ),
      );

      // Date badge pops in
      badgeProgress.value = withDelay(
        BADGE_DELAY,
        withTiming(1, {duration: BADGE_DURATION, easing: SMOOTH_DECEL}),
      );
      badgeScale.value = withDelay(
        BADGE_DELAY,
        withSequence(
          withTiming(1.15, {
            duration: BADGE_DURATION * 0.6,
            easing: OVERSHOOT,
          }),
          withSpring(1, {damping: 10, stiffness: 200}),
        ),
      );

      // Heart icon pops in
      heartProgress.value = withDelay(
        HEART_DELAY,
        withTiming(1, {duration: HEART_DURATION, easing: SMOOTH_DECEL}),
      );
      heartScale.value = withDelay(
        HEART_DELAY,
        withSequence(
          withTiming(1.25, {
            duration: HEART_DURATION * 0.5,
            easing: OVERSHOOT,
          }),
          withSpring(1, {damping: 8, stiffness: 200}),
        ),
      );
    } else {
      // Reset all animations instantly
      const allValues = [
        cardProgress, badgeProgress, heartProgress,
        badgeScale, heartScale,
      ];
      allValues.forEach(v => {
        cancelAnimation(v);
        v.value = 0;
      });
      cancelAnimation(cardScale);
      cardScale.value = 0.85;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [isActive]);

  const cardStyle = useAnimatedStyle(() => {
    const translateY = interpolate(cardProgress.value, [0, 1], [120, 0]);
    return {
      opacity: cardProgress.value,
      transform: [{translateY}, {scale: cardScale.value}],
    };
  });

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeProgress.value,
    transform: [{scale: badgeScale.value}],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartProgress.value,
    transform: [{scale: heartScale.value}],
  }));

  return (
    <Box flex={1} backgroundColor="accentGreenLight" justifyContent="center" alignItems="center">
      {/* Animated event card */}
      <Animated.View style={[styles.cardWrapper, cardStyle]}>
        <Box style={styles.card}>
          {/* Event image */}
          <Box style={styles.imageContainer}>
            <Image
              source={eventImage}
              style={styles.eventImage}
              resizeMode={ResizeMode.cover}
            />

            {/* Date badge */}
            <Animated.View style={[styles.dateBadge, badgeStyle]}>
              <Text
                variant="caption"
                fontFamily={fonts.bold}
                color="textPrimary"
                textAlign="center">
                {t('demo.event.month')}
              </Text>
              <Text
                fontFamily={fonts.bold}
                textAlign="center"
                style={styles.dateDay}>
                14
              </Text>
              <Text
                variant="caption"
                fontFamily={fonts.bold}
                color="textPrimary"
                textAlign="center">
                2026
              </Text>
            </Animated.View>

            {/* Heart icon overlay */}
            <Animated.View style={[styles.heartOverlay, heartStyle]}>
              <Box style={styles.heartCircle}>
                <Icon source="heart" size={60} color="mainBackground" />
              </Box>
            </Animated.View>
          </Box>

          {/* Event details */}
          <Box style={styles.detailsContainer}>
            <Text
              variant="caption"
              fontFamily={fonts.bold}
              style={styles.statusText}>
              {t('demo.event.status')}
            </Text>
            <Text
              fontFamily={fonts.bold}
              color="textPrimary"
              style={styles.eventTitle}>
              {t('demo.event.title')}
            </Text>
            <Box flexDirection="row" alignItems="center" gap="xs">
              <Icon source="map-marker-outline" size={16} color="textSecondary" />
              <Text
                variant="caption"
                fontFamily={fonts.bold}
                color="textSecondary">
                {t('demo.event.location')}
              </Text>
            </Box>
            <Text
              variant="body"
              color="textSecondary"
              numberOfLines={2}
              style={styles.eventDescription}>
              {t('demo.event.description')}
            </Text>
          </Box>
        </Box>
      </Animated.View>

      {/* Bottom gradient fade */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.gradient}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: palette.green500,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 203,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.green50,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dateDay: {
    fontSize: 24,
    lineHeight: 29,
    color: palette.green500,
  },
  heartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: `${palette.green500}80`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 23,
    gap: 6,
  },
  statusText: {
    color: palette.green500,
    fontSize: 12,
  },
  eventTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 21,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
});
