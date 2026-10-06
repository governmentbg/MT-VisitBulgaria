import React from 'react';
import {StyleSheet, Image as RNImage, View} from 'react-native';
import Svg, {Defs, Filter, FeGaussianBlur, Rect} from 'react-native-svg';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import type {CityCluster} from '../../hooks/useCityClusters';

interface CityPinMarkerProps {
  cluster: CityCluster;
  onImageLoad?: () => void;
}

const PIN_WIDTH = moderateScale(100);
const IMAGE_HEIGHT = moderateScale(85);
const LABEL_HEIGHT = moderateScale(32);
const BORDER_WIDTH = moderateScale(4);
const CARD_HEIGHT = IMAGE_HEIGHT + LABEL_HEIGHT;
const CARD_RADIUS = moderateScale(16);

const SHADOW_PAD = moderateScale(14);
const CANVAS_WIDTH = PIN_WIDTH + SHADOW_PAD * 2;
const CANVAS_HEIGHT = CARD_HEIGHT + SHADOW_PAD * 2;
const SHADOW_OFFSET_Y = moderateScale(6);

/**
 * City pin marker for the map view (country zoom level).
 * Shows a card with city hero image on top and city name below.
 * Drop shadow is drawn via SVG filter so it renders identically on iOS/Android
 * inside react-native-maps markers (RN shadow/elevation are unreliable there).
 */
function CityPinMarkerComponent({cluster, onImageLoad}: CityPinMarkerProps) {
  return (
    <View style={styles.wrapper}>
      <Svg
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={StyleSheet.absoluteFill}>
        <Defs>
          <Filter
            id="cityShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </Filter>
        </Defs>
        <Rect
          x={SHADOW_PAD}
          y={SHADOW_PAD + SHADOW_OFFSET_Y}
          width={PIN_WIDTH}
          height={CARD_HEIGHT}
          rx={CARD_RADIUS}
          ry={CARD_RADIUS}
          fill="black"
          opacity={0.28}
          filter="url(#cityShadow)"
        />
      </Svg>
      <Box
        width={PIN_WIDTH}
        borderRadius="xl"
        borderWidth={BORDER_WIDTH}
        borderColor="mainBackground"
        backgroundColor="mainBackground"
        overflow="hidden">
        <Box
          width="100%"
          height={IMAGE_HEIGHT}
          backgroundColor="surfaceBackground">
          {cluster.heroImageUrl ? (
            <RNImage
              source={{uri: cluster.heroImageUrl}}
              style={styles.image}
              resizeMode="cover"
              onLoad={onImageLoad}
            />
          ) : (
            <Box flex={1} alignItems="center" justifyContent="center">
              <Text variant="header" color="textSecondary">
                {cluster.cityName.charAt(0)}
              </Text>
            </Box>
          )}
        </Box>
        <Box
          paddingHorizontal="xs"
          paddingVertical="xs"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height={LABEL_HEIGHT}>
          <Text
            variant="small"
            fontFamily={fonts.bold}
            color="textPrimary"
            textAlign="center"
            numberOfLines={1}>
            {cluster.cityName}
          </Text>
        </Box>
      </Box>
    </View>
  );
}

export const CityPinMarker = React.memo(CityPinMarkerComponent);

const styles = StyleSheet.create({
  wrapper: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: SHADOW_PAD,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
