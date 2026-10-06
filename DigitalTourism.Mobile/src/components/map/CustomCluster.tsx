import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Circle, Defs, Filter, FeGaussianBlur} from 'react-native-svg';
import {Text} from '../../design';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';
import {palette} from '../../theme/palette';

interface CustomClusterProps {
  count: number;
}

const SIZE = 50;
const SHADOW_PAD = 6;
const CANVAS = SIZE + SHADOW_PAD * 2;
const CENTER = CANVAS / 2;
const RADIUS = SIZE / 2;
const BORDER = 5;

/**
 * Custom cluster marker showing the number of items.
 * Shadow is drawn inside the SVG so it renders identically on iOS and Android
 * (RN shadow/elevation don't work reliably inside react-native-maps markers).
 */
function CustomClusterComponent({count}: CustomClusterProps) {
  const theme = useTheme<Theme>();

  return (
    <View style={styles.wrapper}>
      <Svg width={CANVAS} height={CANVAS}>
        <Defs>
          <Filter
            id="clusterShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </Filter>
        </Defs>
        {/* Blurred drop shadow */}
        <Circle
          cx={CENTER}
          cy={CENTER + 2}
          r={RADIUS}
          fill="black"
          opacity={0.35}
          filter="url(#clusterShadow)"
        />
        {/* White border */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill={palette.white}
        />
        {/* Inner fill */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS - BORDER}
          fill={theme.colors.primary}
        />
      </Svg>
      <View style={styles.label} pointerEvents="none">
        <Text variant="small" style={styles.text}>
          {count}
        </Text>
      </View>
    </View>
  );
}

export const CustomCluster = React.memo(CustomClusterComponent);

const styles = StyleSheet.create({
  wrapper: {
    width: CANVAS,
    height: CANVAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    width: CANVAS,
    height: CANVAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: palette.white,
    fontWeight: 'bold',
  },
});
