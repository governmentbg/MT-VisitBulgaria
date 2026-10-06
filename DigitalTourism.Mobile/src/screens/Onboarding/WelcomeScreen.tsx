import React, {useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Box, Text} from '../../design';
import {useAuth} from '../../contexts/AuthContext';
import {OnboardingLanguageSelector} from './components/OnboardingLanguageSelector';
import {WelcomeIllustration} from './components/WelcomeIllustration';
import {palette} from '../../theme/palette';
import {fonts} from '../../theme/fonts';
import type {OnboardingStackScreenProps} from '../../navigation/types';

import Logo from '../../../assets/onboarding/logo.svg';
const welcomeBg = require('../../../assets/onboarding/welcome-bg.png');

export function WelcomeScreen({
  navigation,
}: OnboardingStackScreenProps<'Welcome'>) {
  const {t} = useTranslation('onboarding');
  const {login} = useAuth();
  const insets = useSafeAreaInsets();

  // Animation shared values
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const controlsTranslateY = useSharedValue(20);
  const controlsOpacity = useSharedValue(0);

  // Get Started button press animation
  const btnScale = useSharedValue(1);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigateToCarousel = useCallback(() => {
    navigation.navigate('Carousel');
  }, [navigation]);

  const handleGetStarted = useCallback(() => {
    btnScale.value = withSequence(
      withTiming(0.92, {duration: 100, easing: Easing.out(Easing.quad)}),
      withTiming(1.05, {duration: 150, easing: Easing.out(Easing.quad)}),
      withTiming(1, {
        duration: 100,
        easing: Easing.inOut(Easing.quad),
      }),
    );
    // Navigate after the press animation completes
    navTimerRef.current = setTimeout(() => navigateToCarousel(), 350);
  }, [btnScale, navigateToCarousel]);

  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Staggered entrance animation
    logoScale.value = withSpring(1, {damping: 12, stiffness: 100});
    logoOpacity.value = withTiming(1, {duration: 400});

    titleTranslateY.value = withDelay(200, withSpring(0, {damping: 12}));
    titleOpacity.value = withDelay(200, withTiming(1, {duration: 400}));

    subtitleTranslateY.value = withDelay(350, withSpring(0, {damping: 12}));
    subtitleOpacity.value = withDelay(350, withTiming(1, {duration: 400}));

    controlsTranslateY.value = withDelay(500, withSpring(0, {damping: 12}));
    controlsOpacity.value = withDelay(500, withTiming(1, {duration: 400}));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{scale: logoScale.value}],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{translateY: titleTranslateY.value}],
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    transform: [{translateY: subtitleTranslateY.value}],
    opacity: subtitleOpacity.value,
  }));

  const controlsStyle = useAnimatedStyle(() => ({
    transform: [{translateY: controlsTranslateY.value}],
    opacity: controlsOpacity.value,
  }));

  const getStartedAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  const handleLogin = async () => {
    try {
      await login();
    } catch {
      // User cancelled or login failed — stay on welcome screen
    }
  };

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Full-screen gradient background */}
      <LinearGradient
        colors={['#EBF7FF', '#B9D8F4', '#D6EAF5']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Background scenery image at bottom */}
      <Image
        source={welcomeBg}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Top bar: logo center, language selector right */}
      <Box
        style={{paddingTop: insets.top + 12}}
        paddingHorizontal="m"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        position="relative">
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Logo width={100} height={80} />
        </Animated.View>

        <Box position="absolute" right={16} style={{top: insets.top + 12}}>
          <OnboardingLanguageSelector compact />
        </Box>
      </Box>

      {/* Title */}
      <Animated.View style={titleStyle}>
        <Text
          variant="header"
          textAlign="center"
          color="accentGreenDarker"
          marginTop="l"
          style={styles.title}>
          {t('welcome.title')}
        </Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={subtitleStyle}>
        <Text
          variant="body"
          textAlign="center"
          color="accentGreenDarker"
          marginTop="s"
          paddingHorizontal="xl">
          {t('welcome.subtitle')}
        </Text>
      </Animated.View>

      {/* Photo collage illustration */}
      <Animated.View style={styles.illustrationContainer}>
        <WelcomeIllustration />
      </Animated.View>

      {/* Bottom buttons */}
      <Animated.View style={controlsStyle}>
        <Box
          paddingHorizontal="m"
          paddingBottom="l"
          style={{paddingBottom: Math.max(insets.bottom, 24)}}
          gap="s">
          {/* Get Started button */}
          <Animated.View style={getStartedAnimStyle}>
            <TouchableOpacity
              style={styles.getStartedButton}
              activeOpacity={0.85}
              onPress={handleGetStarted}>
              <Text
                variant="button"
                color="textOnPrimary"
                fontFamily={fonts.bold}
                textAlign="center">
                {t('welcome.getStarted')}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Log In button */}
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={handleLogin}>
            <Text
              variant="button"
              fontFamily="Roboto-Bold"
              textAlign="center"
              color="accentGreenDarker">
              {t('welcome.loginButton')}
            </Text>
          </TouchableOpacity>
        </Box>
      </Animated.View>
    </Box>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: '-50%',
    right: '-50%',
    width: '200%',
    height: '60%',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
  },
  getStartedButton: {
    backgroundColor: palette.green700,
    borderRadius: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: palette.green50,
    borderRadius: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
