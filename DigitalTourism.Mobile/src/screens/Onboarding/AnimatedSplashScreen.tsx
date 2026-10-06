import React, {useEffect} from 'react';
import {StyleSheet, ImageBackground, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {isOnboardingCompleted} from '../../hooks/useOnboarding';
import type {RootStackScreenProps} from '../../navigation/types';

const splashBg = require('../../../assets/onboarding/welcome-bg.png');
const splashLogo = require('../../../assets/onboarding/splash-logo.png');

export function AnimatedSplashScreen({
  navigation,
}: RootStackScreenProps<'AnimatedSplash'>) {
  const logoOpacity = useSharedValue(1);
  const logoTranslateY = useSharedValue(0);

  const navigateNext = () => {
    if (isOnboardingCompleted()) {
      navigation.replace('Main', {screen: 'Explore'});
    } else {
      navigation.replace('Onboarding', {screen: 'Welcome'});
    }
  };

  useEffect(() => {
    // Hold for 500ms, then animate logo out
    const timer = setTimeout(() => {
      logoOpacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
      logoTranslateY.value = withTiming(
        -60,
        {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        },
        finished => {
          if (finished) {
            runOnJS(navigateNext)();
          }
        },
      );
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{translateY: logoTranslateY.value}],
  }));

  return (
    <ImageBackground
      source={splashBg}
      style={styles.container}
      resizeMode="cover">
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Image
          source={splashLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 154,
  },
});
