import React, {useEffect} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {Box, Text, Image, Icon, ResizeMode} from '../../../design';
import {palette} from '../../../theme/palette';
import {fonts} from '../../../theme/fonts';

const placeSofiaChurch = require('../../../../assets/onboarding/place-sofia-church.png');
const placeNevsky = require('../../../../assets/onboarding/place-nevsky.png');
const placeArtGallery = require('../../../../assets/onboarding/place-art-gallery.png');
const placeHistoryMuseum = require('../../../../assets/onboarding/place-history-museum.png');

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 36;

const SMOOTH_DECEL = Easing.bezier(0.22, 1.0, 0.36, 1.0);

// Animation timing
const SWIPE_DELAY = 900;
const SWIPE_DURATION = 400;

// Card configs: image, nameKey (i18n), rotation (degrees), slide-in start offset, stagger delay
const CARD_CONFIGS = [
  {image: placeSofiaChurch, nameKey: 'demo.places.sofiaChurch', rotation: 2.3, startX: 80, delay: 200},
  {image: placeNevsky, nameKey: 'demo.places.nevskyCathedral', rotation: 0, startX: 100, delay: 350},
  {image: placeArtGallery, nameKey: 'demo.places.artGallery', rotation: -1.8, startX: 80, delay: 500},
  {image: placeHistoryMuseum, nameKey: 'demo.places.historyMuseum', rotation: 2.5, startX: 100, delay: 650},
  {image: placeSofiaChurch, nameKey: 'demo.places.rilaMonastery', rotation: -1.2, startX: 80, delay: 800},
  {image: placeArtGallery, nameKey: 'demo.places.plovdivOldTown', rotation: 1.8, startX: 100, delay: 950},
] as const;

interface JourneyIllustrationProps {
  isActive: boolean;
}

export function JourneyIllustration({isActive}: JourneyIllustrationProps) {
  const {t} = useTranslation('onboarding');
  const progress0 = useSharedValue(0);
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);
  const progress4 = useSharedValue(0);
  const progress5 = useSharedValue(0);
  const allProgress = [progress0, progress1, progress2, progress3, progress4, progress5];

  const swipeProgress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      allProgress.forEach((v, i) => {
        v.value = withDelay(
          CARD_CONFIGS[i].delay,
          withSpring(1, {damping: 14, stiffness: 120}),
        );
      });

      swipeProgress.value = withDelay(
        SWIPE_DELAY,
        withTiming(1, {duration: SWIPE_DURATION, easing: SMOOTH_DECEL}),
      );
    } else {
      allProgress.forEach(v => {
        cancelAnimation(v);
        v.value = 0;
      });
      cancelAnimation(swipeProgress);
      swipeProgress.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shared values are stable refs
  }, [isActive]);

  const card0Style = useAnimatedStyle(() => ({
    opacity: progress0.value,
    transform: [
      {translateX: interpolate(progress0.value, [0, 1], [CARD_CONFIGS[0].startX, 0])},
      {rotate: `${CARD_CONFIGS[0].rotation}deg`},
    ],
  }));

  const card1Style = useAnimatedStyle(() => ({
    opacity: progress1.value,
    transform: [
      {translateX: interpolate(progress1.value, [0, 1], [CARD_CONFIGS[1].startX, 0])},
      {rotate: `${CARD_CONFIGS[1].rotation}deg`},
    ],
  }));

  const card2Style = useAnimatedStyle(() => ({
    opacity: progress2.value,
    transform: [
      {translateX: interpolate(progress2.value, [0, 1], [CARD_CONFIGS[2].startX, 0])},
      {rotate: `${CARD_CONFIGS[2].rotation}deg`},
    ],
  }));

  const card3Style = useAnimatedStyle(() => ({
    opacity: progress3.value,
    transform: [
      {translateX: interpolate(progress3.value, [0, 1], [CARD_CONFIGS[3].startX, 0])},
      {rotate: `${CARD_CONFIGS[3].rotation}deg`},
    ],
  }));

  const card4Style = useAnimatedStyle(() => ({
    opacity: progress4.value,
    transform: [
      {translateX: interpolate(progress4.value, [0, 1], [CARD_CONFIGS[4].startX, 0])},
      {rotate: `${CARD_CONFIGS[4].rotation}deg`},
    ],
  }));

  const card5Style = useAnimatedStyle(() => ({
    opacity: progress5.value,
    transform: [
      {translateX: interpolate(progress5.value, [0, 1], [CARD_CONFIGS[5].startX, 0])},
      {rotate: `${CARD_CONFIGS[5].rotation}deg`},
    ],
  }));

  const cardStyles = [card0Style, card1Style, card2Style, card3Style, card4Style, card5Style];

  const swipeCardStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: interpolate(swipeProgress.value, [0, 1], [0, -100])},
    ],
  }));

  const swipeActionStyle = useAnimatedStyle(() => ({
    opacity: swipeProgress.value,
  }));

  return (
    <Box flex={1} backgroundColor="accentGreenLight">
      {/* Clipped cards area */}
      <View style={styles.clippedArea}>
        <Box style={styles.cardsContainer}>
          {CARD_CONFIGS.map((card, index) => (
            <Animated.View
              key={card.nameKey}
              style={[styles.cardRow, cardStyles[index]]}>
              {index === 1 ? (
                <Box style={styles.swipeContainer}>
                  <Animated.View style={[styles.swipeCardInner, swipeCardStyle]}>
                    <PlaceCard config={card} swiped t={t} />
                  </Animated.View>
                  <Animated.View style={[styles.swipeAction, swipeActionStyle]}>
                    <Box style={styles.swipeActionContent}>
                      <Box style={styles.checkCircle}>
                        <Icon source="check" size={16} color="mainBackground" />
                      </Box>
                      <Text style={styles.swipeActionText}>{t('demo.markAsVisited')}</Text>
                    </Box>
                  </Animated.View>
                </Box>
              ) : (
                <Box style={styles.card}>
                  <PlaceCard config={card} t={t} />
                </Box>
              )}
            </Animated.View>
          ))}
        </Box>

        {/* Gradient fade at bottom of cards area */}
        <LinearGradient
          colors={['rgba(230,248,246,0)', palette.green50]}
          style={styles.gradient}
        />
      </View>
    </Box>
  );
}

function PlaceCard({config, swiped, t}: {config: (typeof CARD_CONFIGS)[number]; swiped?: boolean; t: (key: string) => string}) {
  return (
    <Box style={[styles.cardInner, swiped && styles.cardInnerSwiped]}>
      <Image
        source={config.image}
        style={styles.cardImage}
        resizeMode={ResizeMode.cover}
      />
      <Box style={styles.cardContent}>
        <Text
          variant="caption"
          fontFamily={fonts.bold}
          color="textSecondary"
          numberOfLines={1}>
          {t('demo.attractions')}
        </Text>
        <Text
          fontFamily={fonts.bold}
          color="textPrimary"
          numberOfLines={1}
          style={styles.cardTitle}>
          {t(config.nameKey)}
        </Text>
      </Box>
      <Box style={styles.navButton}>
        <Icon source="navigation-variant-outline" size={16} color="accentGreenDark" />
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  clippedArea: {
    flex: 1,
    overflow: 'hidden',
  },
  cardsContainer: {
    gap: 10,
    paddingTop: 45,
    paddingHorizontal: 18,
  },
  cardRow: {
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  swipeContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    height: 90,
  },
  swipeCardInner: {
    width: '100%',
    zIndex: 1,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.gray100,
    padding: 8,
    gap: 13,
    height: 90,
    shadowColor: '#141414',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardInnerSwiped: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardImage: {
    width: 74,
    height: 74,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 19,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 48,
    backgroundColor: palette.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: palette.green700,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  swipeActionContent: {
    alignItems: 'center',
    gap: 4,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 48,
    backgroundColor: palette.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeActionText: {
    color: palette.white,
    fontSize: 12,
    lineHeight: 18,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
});
