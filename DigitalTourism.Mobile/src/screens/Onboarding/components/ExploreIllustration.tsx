import React, {useEffect} from 'react';
import {StyleSheet, ImageBackground, Dimensions} from 'react-native';
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
import {Box} from '../../../design';
import {CityPinCard} from './CityPinCard';

const mapBg = require('../../../../assets/onboarding/map-bg.png');
const cityPlovdiv = require('../../../../assets/onboarding/city-plovdiv.png');
const cityStaraZagora = require('../../../../assets/onboarding/city-stara-zagora.png');
const cityVelikoTarnovo = require('../../../../assets/onboarding/city-veliko-tarnovo.png');

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Easing curves matching WelcomeIllustration style
const SMOOTH_DECEL = Easing.bezier(0.22, 1.0, 0.36, 1.0);
const OVERSHOOT = Easing.bezier(0.34, 1.56, 0.64, 1.0);

// Staggered timing
const MAP_FADE_DURATION = 600;
const CARD_SLIDE_DURATION = 650;
const CARD_ROTATE_DURATION = 450;
const CENTER_DELAY = 200;
const LEFT_DELAY = 400;
const RIGHT_DELAY = 550;

interface ExploreIllustrationProps {
  isActive: boolean;
}

export function ExploreIllustration({isActive}: ExploreIllustrationProps) {
  const {t} = useTranslation('onboarding');

  // Map background
  const mapOpacity = useSharedValue(0);
  const mapScale = useSharedValue(1.1);

  // Center card (Plovdiv)
  const centerProgress = useSharedValue(0);
  const centerScale = useSharedValue(0.6);

  // Left card (Stara Zagora)
  const leftProgress = useSharedValue(0);
  const leftRotateProgress = useSharedValue(0);
  const leftScale = useSharedValue(0.6);

  // Right card (Veliko Tarnovo)
  const rightProgress = useSharedValue(0);
  const rightRotateProgress = useSharedValue(0);
  const rightScale = useSharedValue(0.6);

  useEffect(() => {
    if (isActive) {
      // Map fades in and slightly zooms to rest
      mapOpacity.value = withTiming(1, {duration: MAP_FADE_DURATION});
      mapScale.value = withTiming(1, {
        duration: MAP_FADE_DURATION + 200,
        easing: SMOOTH_DECEL,
      });

      // Center card: slides up from below + scale pop
      centerProgress.value = withDelay(
        CENTER_DELAY,
        withTiming(1, {duration: CARD_SLIDE_DURATION, easing: SMOOTH_DECEL}),
      );
      centerScale.value = withDelay(
        CENTER_DELAY,
        withSequence(
          withTiming(1.08, {
            duration: CARD_SLIDE_DURATION * 0.7,
            easing: SMOOTH_DECEL,
          }),
          withSpring(1, {damping: 12, stiffness: 180}),
        ),
      );

      // Left card: slides up + rotates into place
      leftProgress.value = withDelay(
        LEFT_DELAY,
        withTiming(1, {duration: CARD_SLIDE_DURATION, easing: SMOOTH_DECEL}),
      );
      leftRotateProgress.value = withDelay(
        LEFT_DELAY + 150,
        withTiming(1, {duration: CARD_ROTATE_DURATION, easing: OVERSHOOT}),
      );
      leftScale.value = withDelay(
        LEFT_DELAY,
        withSequence(
          withTiming(1.06, {
            duration: CARD_SLIDE_DURATION * 0.7,
            easing: SMOOTH_DECEL,
          }),
          withSpring(1, {damping: 12, stiffness: 180}),
        ),
      );

      // Right card: slides up + rotates into place
      rightProgress.value = withDelay(
        RIGHT_DELAY,
        withTiming(1, {duration: CARD_SLIDE_DURATION, easing: SMOOTH_DECEL}),
      );
      rightRotateProgress.value = withDelay(
        RIGHT_DELAY + 150,
        withTiming(1, {duration: CARD_ROTATE_DURATION, easing: OVERSHOOT}),
      );
      rightScale.value = withDelay(
        RIGHT_DELAY,
        withSequence(
          withTiming(1.06, {
            duration: CARD_SLIDE_DURATION * 0.7,
            easing: SMOOTH_DECEL,
          }),
          withSpring(1, {damping: 12, stiffness: 180}),
        ),
      );
    } else {
      // Reset all animations instantly
      const allValues = [
        mapOpacity, centerProgress, leftProgress,
        leftRotateProgress, rightProgress, rightRotateProgress,
      ];
      allValues.forEach(v => {
        cancelAnimation(v);
        v.value = 0;
      });
      cancelAnimation(mapScale);
      mapScale.value = 1.1;
      cancelAnimation(centerScale);
      centerScale.value = 0.6;
      cancelAnimation(leftScale);
      leftScale.value = 0.6;
      cancelAnimation(rightScale);
      rightScale.value = 0.6;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [isActive]);

  // Map animated style
  const mapStyle = useAnimatedStyle(() => ({
    opacity: mapOpacity.value,
    transform: [{scale: mapScale.value}],
  }));

  // Center card (Plovdiv) - slides up from bottom
  const centerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      centerProgress.value,
      [0, 1],
      [SCREEN_HEIGHT * 0.35, 0],
    );
    return {
      opacity: centerProgress.value,
      transform: [{translateY}, {scale: centerScale.value}],
    };
  });

  // Left card (Stara Zagora) - slides up + rotates to -11deg
  const leftStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      leftProgress.value,
      [0, 1],
      [SCREEN_HEIGHT * 0.4, 0],
    );
    const translateX = interpolate(leftProgress.value, [0, 1], [-30, 0]);
    const rotate = interpolate(leftRotateProgress.value, [0, 1], [0, -11]);
    return {
      opacity: leftProgress.value,
      transform: [
        {translateX},
        {translateY},
        {scale: leftScale.value},
        {rotate: `${rotate}deg`},
      ],
    };
  });

  // Right card (Veliko Tarnovo) - slides up + rotates to +10deg
  const rightStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      rightProgress.value,
      [0, 1],
      [SCREEN_HEIGHT * 0.4, 0],
    );
    const translateX = interpolate(rightProgress.value, [0, 1], [30, 0]);
    const rotate = interpolate(rightRotateProgress.value, [0, 1], [0, 10]);
    return {
      opacity: rightProgress.value,
      transform: [
        {translateX},
        {translateY},
        {scale: rightScale.value},
        {rotate: `${rotate}deg`},
      ],
    };
  });

  return (
    <Box flex={1} overflow="hidden" backgroundColor="surfaceBackground">
      <Animated.View style={[styles.mapWrapper, mapStyle]}>
        <ImageBackground
          source={mapBg}
          style={styles.mapBackground}
          resizeMode="cover">
          {/* City pins container */}
          <Box flex={1} justifyContent="center" alignItems="center">
            <Box style={styles.pinsContainer}>
              {/* Stara Zagora - left, rotated */}
              <Animated.View style={[styles.pinLeft, leftStyle]}>
                <CityPinCard
                  image={cityStaraZagora}
                  name={t('demo.cities.staraZagora')}
                />
              </Animated.View>

              {/* Plovdiv - center */}
              <Animated.View style={[styles.pinCenter, centerStyle]}>
                <CityPinCard image={cityPlovdiv} name={t('demo.cities.plovdiv')} />
              </Animated.View>

              {/* Veliko Tarnovo - right, rotated */}
              <Animated.View style={[styles.pinRight, rightStyle]}>
                <CityPinCard
                  image={cityVelikoTarnovo}
                  name={t('demo.cities.velikoTarnovo')}
                />
              </Animated.View>
            </Box>
          </Box>

          {/* Bottom gradient fade */}
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
            style={styles.gradient}
          />
        </ImageBackground>
      </Animated.View>
    </Box>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    width: '100%',
  },
  pinsContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: 220,
    position: 'relative',
  },
  pinLeft: {
    position: 'absolute',
    left: 0,
    top: 20,
  },
  pinCenter: {
    position: 'absolute',
    left: '50%',
    marginLeft: -64,
    top: 0,
    zIndex: 1,
  },
  pinRight: {
    position: 'absolute',
    right: 0,
    top: 30,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
});
