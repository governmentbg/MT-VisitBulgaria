import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {palette} from '../../theme/palette';

/**
 * Fixed-size branded share card rendered off-screen and captured to a PNG
 * via `react-native-view-shot`. Uses pixel-accurate dimensions (not
 * `moderateScale`) because the captured image is exported, not on-screen.
 *
 * Dimensions match the Open Graph aspect ratio (1200×630).
 */
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const BRANDING_HEIGHT = 96;
const IMAGE_HEIGHT = CARD_HEIGHT - BRANDING_HEIGHT;

const splashLogo = require('../../../assets/onboarding/splash-logo.png');

export interface ShareCardProps {
  imageUrl?: string;
  name: string;
  cityName?: string;
  onImageLoaded?: () => void;
}

export const ShareCard = React.memo<ShareCardProps>(
  ({imageUrl, name, cityName, onImageLoaded}) => {
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <FastImage
              source={{uri: imageUrl, priority: FastImage.priority.high}}
              style={styles.entityImage}
              resizeMode={FastImage.resizeMode.cover}
              onLoad={onImageLoaded}
              onError={onImageLoaded}
            />
          ) : (
            <View
              style={[styles.entityImage, styles.imagePlaceholder]}
              onLayout={onImageLoaded}
            />
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.gradient}
          />

          <View style={styles.textOverlay}>
            <Text style={styles.entityName} numberOfLines={2}>
              {name}
            </Text>
            {cityName ? (
              <Text style={styles.cityName}>{cityName}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.brandingBar}>
          <FastImage
            source={splashLogo}
            style={styles.logo}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={styles.appName}>Visit Bulgaria</Text>
        </View>
      </View>
    );
  },
);

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: palette.white,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  entityImage: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imagePlaceholder: {
    backgroundColor: palette.green500,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: IMAGE_HEIGHT * 0.55,
  },
  textOverlay: {
    position: 'absolute',
    left: 56,
    right: 56,
    bottom: 40,
  },
  entityName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 60,
    lineHeight: 72,
    color: palette.white,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
  },
  cityName: {
    fontFamily: 'Roboto-Regular',
    fontSize: 36,
    lineHeight: 44,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 10,
  },
  brandingBar: {
    width: CARD_WIDTH,
    height: BRANDING_HEIGHT,
    backgroundColor: palette.green700,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 56,
  },
  logo: {
    width: 56,
    height: 56,
  },
  appName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 34,
    color: palette.white,
    marginLeft: 24,
  },
});
