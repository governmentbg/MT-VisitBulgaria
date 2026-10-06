import React, {useEffect} from 'react';
import {StyleSheet, Image, Dimensions, Text as RNText, View} from 'react-native';
import {palette} from '../../../theme/palette';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const photo1 = require('../../../../assets/onboarding/photo1.png');
const photo2 = require('../../../../assets/onboarding/photo2.png');
const paperPlane = require('../../../../assets/onboarding/paper-plane.png');
import DashedPath from '../../../../assets/onboarding/dashed-path.svg';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

// Custom bezier curves
const PHOTO_EASE_IN = Easing.bezier(0.22, 1.0, 0.36, 1.0); // smooth deceleration
const PHOTO_BOUNCE = Easing.bezier(0.34, 1.56, 0.64, 1.0); // overshoot bounce
const PIN_EASE = Easing.bezier(0.16, 1.2, 0.3, 1.0); // fast approach with slight overshoot

// Animation timing
const PHOTO1_DELAY = 400; // after title/subtitle appear
const PHOTO2_DELAY = 550;
const PHOTO_SLIDE_DURATION = 700;
const PHOTO_ROTATE_DURATION = 500;
const PIN1_DELAY = PHOTO1_DELAY + PHOTO_SLIDE_DURATION + 100;
const PIN2_DELAY = PHOTO2_DELAY + PHOTO_SLIDE_DURATION + 150;
const PIN_DURATION = 450;
const PLANE_DELAY = PIN1_DELAY + 200;

export function WelcomeIllustration() {
  // Photo 1 animation values
  const photo1Progress = useSharedValue(0);
  const photo1Rotate = useSharedValue(0);

  // Photo 2 animation values
  const photo2Progress = useSharedValue(0);
  const photo2Rotate = useSharedValue(0);

  // Pin animation values (0 = offscreen at 45deg, 1 = pinned)
  const pin1Progress = useSharedValue(0);
  const pin2Progress = useSharedValue(0);

  // Pin scale for pop effect
  const pin1Scale = useSharedValue(0);
  const pin2Scale = useSharedValue(0);

  // Paper plane
  const planeOpacity = useSharedValue(0);
  const planeTranslateX = useSharedValue(-40);
  const planeTranslateY = useSharedValue(30);

  useEffect(() => {
    // --- Photo 1: slide up from below screen ---
    photo1Progress.value = withDelay(
      PHOTO1_DELAY,
      withTiming(1, {duration: PHOTO_SLIDE_DURATION, easing: PHOTO_EASE_IN}),
    );
    photo1Rotate.value = withDelay(
      PHOTO1_DELAY + 200,
      withTiming(1, {duration: PHOTO_ROTATE_DURATION, easing: PHOTO_BOUNCE}),
    );

    // --- Photo 2: slide up from below screen (staggered) ---
    photo2Progress.value = withDelay(
      PHOTO2_DELAY,
      withTiming(1, {duration: PHOTO_SLIDE_DURATION, easing: PHOTO_EASE_IN}),
    );
    photo2Rotate.value = withDelay(
      PHOTO2_DELAY + 200,
      withTiming(1, {duration: PHOTO_ROTATE_DURATION, easing: PHOTO_BOUNCE}),
    );

    // --- Pin 1: fly in from top-left at 45deg, pin the image ---
    pin1Progress.value = withDelay(
      PIN1_DELAY,
      withTiming(1, {duration: PIN_DURATION, easing: PIN_EASE}),
    );
    pin1Scale.value = withDelay(
      PIN1_DELAY,
      withSequence(
        withTiming(1.3, {duration: PIN_DURATION * 0.6, easing: PIN_EASE}),
        withTiming(1, {duration: PIN_DURATION * 0.4, easing: Easing.out(Easing.back(3))}),
      ),
    );

    // --- Pin 2: fly in from top-right at 45deg, pin the image ---
    pin2Progress.value = withDelay(
      PIN2_DELAY,
      withTiming(1, {duration: PIN_DURATION, easing: PIN_EASE}),
    );
    pin2Scale.value = withDelay(
      PIN2_DELAY,
      withSequence(
        withTiming(1.3, {duration: PIN_DURATION * 0.6, easing: PIN_EASE}),
        withTiming(1, {duration: PIN_DURATION * 0.4, easing: Easing.out(Easing.back(3))}),
      ),
    );

    // --- Paper plane floats in ---
    planeOpacity.value = withDelay(
      PLANE_DELAY,
      withTiming(1, {duration: 500}),
    );
    planeTranslateX.value = withDelay(
      PLANE_DELAY,
      withTiming(0, {duration: 800, easing: Easing.out(Easing.quad)}),
    );
    planeTranslateY.value = withDelay(
      PLANE_DELAY,
      withTiming(0, {duration: 800, easing: Easing.out(Easing.quad)}),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, []);

  // --- Photo 1 animated style ---
  const photo1Style = useAnimatedStyle(() => {
    const translateY = interpolate(photo1Progress.value, [0, 1], [SCREEN_HEIGHT * 0.6, 0]);
    const rotate = interpolate(photo1Rotate.value, [0, 1], [0, -7]);
    return {
      transform: [{translateY}, {rotate: `${rotate}deg`}],
    };
  });

  // --- Photo 2 animated style ---
  const photo2Style = useAnimatedStyle(() => {
    const translateY = interpolate(photo2Progress.value, [0, 1], [SCREEN_HEIGHT * 0.6, 0]);
    const rotate = interpolate(photo2Rotate.value, [0, 1], [0, 14]);
    return {
      transform: [{translateY}, {rotate: `${rotate}deg`}],
    };
  });

  // --- Pin 1: flies in from top-left (negative X, negative Y at 45deg) ---
  const pin1Style = useAnimatedStyle(() => {
    const translateX = interpolate(pin1Progress.value, [0, 1], [-120, 0]);
    const translateY = interpolate(pin1Progress.value, [0, 1], [-120, 0]);
    const rotate = interpolate(pin1Progress.value, [0, 1], [-45, 0]);
    return {
      transform: [
        {translateX},
        {translateY},
        {scale: pin1Scale.value},
        {rotate: `${rotate}deg`},
      ],
      opacity: pin1Progress.value,
    };
  });

  // --- Pin 2: flies in from top-right (positive X, negative Y at 45deg) ---
  const pin2Style = useAnimatedStyle(() => {
    const translateX = interpolate(pin2Progress.value, [0, 1], [120, 0]);
    const translateY = interpolate(pin2Progress.value, [0, 1], [-120, 0]);
    const rotate = interpolate(pin2Progress.value, [0, 1], [45, 0]);
    return {
      transform: [
        {translateX},
        {translateY},
        {scale: pin2Scale.value},
        {rotate: `${rotate}deg`},
      ],
      opacity: pin2Progress.value,
    };
  });

  // --- Paper plane style ---
  const planeStyle = useAnimatedStyle(() => ({
    opacity: planeOpacity.value,
    transform: [
      {translateX: planeTranslateX.value},
      {translateY: planeTranslateY.value},
      {rotate: '-6deg'},
    ],
  }));

  return (
    <Animated.View style={styles.container}>
      {/* Dashed path background */}
      <View style={styles.dashedPath}>
        <DashedPath width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
      </View>

      {/* Photo 1 - larger, rotated left */}
      <Animated.View style={[styles.photo1Wrapper, photo1Style]}>
        <Animated.View style={[styles.pin, pin1Style]}>
          <RNText style={styles.pinLarge}>📍</RNText>
        </Animated.View>
        <Animated.View style={styles.photoCard}>
          <Image
            source={photo1}
            style={styles.photoImage}
            resizeMode="cover"
          />
        </Animated.View>
      </Animated.View>

      {/* Photo 2 - smaller, rotated right */}
      <Animated.View style={[styles.photo2Wrapper, photo2Style]}>
        <Animated.View style={[styles.pin, pin2Style]}>
          <RNText style={styles.pinSmall}>📍</RNText>
        </Animated.View>
        <Animated.View style={styles.photoCard}>
          <Image
            source={photo2}
            style={styles.photoImage}
            resizeMode="cover"
          />
        </Animated.View>
      </Animated.View>

      {/* Paper plane */}
      <Animated.Image
        source={paperPlane}
        style={[styles.paperPlane, planeStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  dashedPath: {
    position: 'absolute',
    width: '120%',
    height: '100%',
    left: '-10%',
  },
  photo1Wrapper: {
    width: 170,
    height: 220,
    marginRight: -20,
    marginTop: -20,
  },
  photo2Wrapper: {
    width: 160,
    height: 160,
    marginLeft: -20,
    marginTop: 40,
  },
  photoCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 6,
    borderColor: palette.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  pin: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    zIndex: 1,
  },
  pinLarge: {
    fontSize: 32,
  },
  pinSmall: {
    fontSize: 24,
  },
  paperPlane: {
    position: 'absolute',
    width: 55,
    height: 35,
    right: '14%',
    top: 0,
  },
});
