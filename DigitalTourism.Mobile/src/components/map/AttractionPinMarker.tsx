import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Svg, {Path, Ellipse, Defs, Filter, FeGaussianBlur} from 'react-native-svg';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

interface AttractionPinMarkerProps {
  imageUri?: string;
  onImageLoad?: () => void;
}

const SHADOW_PAD = moderateScale(6);
const PIN_WIDTH = moderateScale(52) + SHADOW_PAD * 2;
const PIN_HEIGHT = moderateScale(64) + SHADOW_PAD * 2;
const PHOTO_SIZE = moderateScale(40);
const PHOTO_TOP = moderateScale(4) + SHADOW_PAD;

/**
 * Teardrop-shaped pin marker with circular attraction photo.
 * Used at city zoom level for individual attractions/events.
 * Matches Figma design: teal (#00BBA7) teardrop, circular photo inside.
 */
function AttractionPinMarkerComponent({
  imageUri,
  onImageLoad,
}: AttractionPinMarkerProps) {
  return (
    <View style={styles.container}>
      <Svg width={PIN_WIDTH} height={PIN_HEIGHT} viewBox="0 0 64 76">
        <Defs>
          <Filter
            id="pinShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="1.8" />
          </Filter>
        </Defs>
        {/* Blurred drop shadow */}
        <Path
          d="M32 68C32 68 54 44 54 30C54 17.85 44.15 8 32 8C19.85 8 10 17.85 10 30C10 44 32 68 32 68Z"
          fill="black"
          opacity={0.32}
          transform="translate(0.5, 2)"
          filter="url(#pinShadow)"
        />
        {/* Ground shadow ellipse under the pin tip */}
        <Ellipse
          cx={32}
          cy={73.8}
          rx={7}
          ry={1.9}
          fill="black"
          opacity={0.22}
        />
        {/* Teardrop shape */}
        <Path
          d="M32 68C32 68 54 44 54 30C54 17.85 44.15 8 32 8C19.85 8 10 17.85 10 30C10 44 32 68 32 68Z"
          fill={palette.green500}
          stroke="white"
          strokeWidth={3}
        />
      </Svg>
      {/* Circular photo overlay */}
      <View style={styles.photoContainer}>
        {imageUri ? (
          <Image
            source={{uri: imageUri}}
            style={styles.photo}
            onLoad={onImageLoad}
          />
        ) : (
          <View style={styles.photoPlaceholder} />
        )}
      </View>
    </View>
  );
}

export const AttractionPinMarker = React.memo(AttractionPinMarkerComponent);

const styles = StyleSheet.create({
  container: {
    width: PIN_WIDTH,
    height: PIN_HEIGHT,
    alignItems: 'center',
  },
  photoContainer: {
    position: 'absolute',
    top: PHOTO_TOP,
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: palette.green50,
  },
});
