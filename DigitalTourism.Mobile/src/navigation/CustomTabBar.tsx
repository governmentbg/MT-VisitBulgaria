import React, {useEffect, useMemo} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedProps,
  interpolate,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useTheme} from '../theme';
import {TabItem} from './TabItem';
import {Icon} from '../design';
import type {IconName} from '../design/Icon';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ── Layout constants (derived from Figma node 93:1129) ──
export const BAR_HEIGHT = 62;
const CORNER_RADIUS = 24;
const CIRCLE_INNER = 52; // 32 icon + 10 padding × 2
const CIRCLE_BORDER = 4;
const CIRCLE_TOTAL = CIRCLE_INNER + CIRCLE_BORDER * 2; // 60
const CIRCLE_RADIUS = CIRCLE_TOTAL / 2; // 30
const CUTOUT_PADDING = 4; // gap between circle border and cutout edge
const CUTOUT_RADIUS = CIRCLE_RADIUS + CUTOUT_PADDING; // 34 — true circle
const CIRCLE_TOP = -CIRCLE_RADIUS; // circle center aligned with bar top
const CIRCLE_ICON_SIZE = 32;

// ── Fillet (elliptical-slope transition between bar top and circular cutout) ──
// Angle (from the circle's leftmost point) where the perfect-circle arc ends
// and the cubic Bézier fillet takes over. Larger = softer / wider S-curve.
const FILLET_ANGLE_DEG = 22;
const FILLET_ANGLE_RAD = (FILLET_ANGLE_DEG * Math.PI) / 180;
const FA_SIN = Math.sin(FILLET_ANGLE_RAD);
const FA_COS = Math.cos(FILLET_ANGLE_RAD);
// Tangent point on the cutout circle (offset from cx): angle FILLET_ANGLE
// up from the main arc's leftmost / rightmost points.
const FILLET_TP_DX = CUTOUT_RADIUS * FA_COS;
const FILLET_TP_DY = CUTOUT_RADIUS * FA_SIN;
// Where the tangent line at that point meets the bar top (y=0).
// Placing a Bézier control handle here guarantees C1 tangent continuity
// with the main circular arc — no kink at the junction.
const FILLET_TANGENT_DX = CUTOUT_RADIUS / FA_COS; // cr / cos(Δ)
// Extra horizontal spread of the Bézier start past the tangent crossing.
// Controls how gradual the slope feels on the bar top.
const FILLET_SPREAD = 12;

// ── Icon config per tab ──
const FILLED_ICONS: Record<string, IconName> = {
  Explore: 'map-marker',
  Events: 'calendar-blank',
  Routes: 'compass',
  Favourites: 'heart',
};

// Shared geometry so fill + border paths stay identical
function cutoutGeometry(cx: number, w: number) {
  'worklet';
  const r = CORNER_RADIUS;
  const cr = CUTOUT_RADIUS;

  // Tangent points — where the perfect-circle arc ends and the Bézier fillets begin
  const leftTpX = cx - FILLET_TP_DX;
  const rightTpX = cx + FILLET_TP_DX;
  const tpY = FILLET_TP_DY;

  // Second control point of each Bézier: lies on the tangent line from the
  // tangent point, on y=0. This forces C1 tangent continuity with the arc.
  const leftC2X = cx - FILLET_TANGENT_DX;
  const rightC2X = cx + FILLET_TANGENT_DX;

  // Where each Bézier meets the bar top. Clamped to the bar width so the
  // path never folds back at the edges of the screen.
  const leftFilletX = Math.max(0, leftC2X - FILLET_SPREAD);
  const rightFilletX = Math.min(w, rightC2X + FILLET_SPREAD);

  // First control point: midpoint between fillet start and C2 (on y=0).
  // Keeps the Bézier monotonic in x even when the edge clamp kicks in.
  const leftC1X = (leftFilletX + leftC2X) / 2;
  const rightC1X = (rightFilletX + rightC2X) / 2;

  // Shrink the top corners of the bar so an edge tab (first/last) can host
  // the fillet without the path folding back on itself.
  const rL = Math.max(0, Math.min(r, leftFilletX));
  const rR = Math.max(0, Math.min(r, w - rightFilletX));

  return {
    cr,
    leftFilletX,
    rightFilletX,
    leftC1X,
    rightC1X,
    leftC2X,
    rightC2X,
    leftTpX,
    rightTpX,
    tpY,
    rL,
    rR,
  };
}

// ── SVG cutout path builder (runs on UI thread) ──
function buildCutoutPath(cx: number, w: number, h: number): string {
  'worklet';
  const g = cutoutGeometry(cx, w);

  return (
    'M 0 ' + h +
    ' L 0 ' + g.rL +
    ' Q 0 0 ' + g.rL + ' 0' +
    ' L ' + g.leftFilletX + ' 0' +
    ' C ' + g.leftC1X + ' 0 ' + g.leftC2X + ' 0 ' + g.leftTpX + ' ' + g.tpY +
    ' A ' + g.cr + ' ' + g.cr + ' 0 0 0 ' + g.rightTpX + ' ' + g.tpY +
    ' C ' + g.rightC2X + ' 0 ' + g.rightC1X + ' 0 ' + g.rightFilletX + ' 0' +
    ' L ' + (w - g.rR) + ' 0' +
    ' Q ' + w + ' 0 ' + w + ' ' + g.rR +
    ' L ' + w + ' ' + h +
    ' Z'
  );
}

// Top-edge-only path (no bottom/sides — just the visible border along the cutout)
function buildTopEdgePath(cx: number, w: number): string {
  'worklet';
  const g = cutoutGeometry(cx, w);

  return (
    'M 0 ' + g.rL +
    ' Q 0 0 ' + g.rL + ' 0' +
    ' L ' + g.leftFilletX + ' 0' +
    ' C ' + g.leftC1X + ' 0 ' + g.leftC2X + ' 0 ' + g.leftTpX + ' ' + g.tpY +
    ' A ' + g.cr + ' ' + g.cr + ' 0 0 0 ' + g.rightTpX + ' ' + g.tpY +
    ' C ' + g.rightC2X + ' 0 ' + g.rightC1X + ' 0 ' + g.rightFilletX + ' 0' +
    ' L ' + (w - g.rR) + ' 0' +
    ' Q ' + w + ' 0 ' + w + ' ' + g.rR
  );
}

// ── Floating icon with cross-fade ──
const FloatingIcon = ({
  index,
  animatedIndex,
  iconName,
  color,
}: {
  index: number;
  animatedIndex: Animated.SharedValue<number>;
  iconName: IconName;
  color: string;
}) => {
  const style = useAnimatedStyle(() => {
    const dist = Math.abs(animatedIndex.value - index);
    const clamped = Math.min(Math.max(dist, 0), 1);
    const opacity = interpolate(clamped, [0, 0.4, 1], [1, 0, 0]);
    return {
      opacity,
      position: 'absolute' as const,
    };
  });

  return (
    <Animated.View style={style}>
      <Icon source={iconName} size={CIRCLE_ICON_SIZE} color={color} />
    </Animated.View>
  );
};

// ── Main tab bar ──
export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const {theme} = useTheme();
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const TAB_COUNT = state.routes.length;
  const TAB_WIDTH = width / TAB_COUNT;
  const TOTAL_HEIGHT = BAR_HEIGHT + insets.bottom;

  const animatedIndex = useSharedValue(state.index);

  const tabCenters = useMemo(
    () => state.routes.map((_, i) => TAB_WIDTH * i + TAB_WIDTH / 2),
    [TAB_WIDTH, state.routes],
  );

  const inputRange = useMemo(
    () => tabCenters.map((_, i) => i),
    [tabCenters],
  );

  useEffect(() => {
    animatedIndex.value = withSpring(state.index, {
      damping: 28,
      stiffness: 300,
      mass: 0.9,
    });
  }, [state.index, animatedIndex]);

  // Animated SVG fill path
  const animatedPathProps = useAnimatedProps(() => {
    const cx = interpolate(animatedIndex.value, inputRange, tabCenters);
    return {d: buildCutoutPath(cx, width, BAR_HEIGHT)};
  });

  // Animated SVG top-edge stroke path
  const animatedBorderProps = useAnimatedProps(() => {
    const cx = interpolate(animatedIndex.value, inputRange, tabCenters);
    return {d: buildTopEdgePath(cx, width)};
  });

  // Animated circle translateX
  const circleStyle = useAnimatedStyle(() => {
    const cx = interpolate(animatedIndex.value, inputRange, tabCenters);
    return {
      transform: [{translateX: cx - CIRCLE_TOTAL / 2}],
    };
  });

  return (
    <View style={[styles.container, {height: TOTAL_HEIGHT}]}>
      {/* SVG background with animated cutout */}
      <Svg width={width} height={BAR_HEIGHT} style={styles.svg}>
        <AnimatedPath
          animatedProps={animatedPathProps}
          fill={theme.colors.cardBackground}
        />
        <AnimatedPath
          animatedProps={animatedBorderProps}
          fill="none"
          stroke={theme.colors.border}
          strokeWidth={1}
        />
      </Svg>

      {/* Bottom safe-area fill */}
      <View
        style={[
          styles.bottomFill,
          {
            top: BAR_HEIGHT,
            height: insets.bottom,
            backgroundColor: theme.colors.cardBackground,
          },
        ]}
      />

      {/* Floating circle */}
      <Animated.View
        style={[
          styles.floatingCircle,
          circleStyle,
          {
            top: CIRCLE_TOP,
            backgroundColor: theme.colors.accentGreenLight,
            borderColor: theme.colors.cardBackground,
          },
        ]}>
        {state.routes.map((route, i) => {
          const iconName = FILLED_ICONS[route.name];
          if (!iconName) return null;
          return (
            <FloatingIcon
              key={route.key}
              index={i}
              animatedIndex={animatedIndex}
              iconName={iconName}
              color={theme.colors.accentGreenDark}
            />
          );
        })}
      </Animated.View>

      {/* Tab items */}
      <View style={[styles.tabsRow, {height: BAR_HEIGHT}]}>
        {state.routes.map((route, index) => (
          <TabItem
            key={route.key}
            route={route}
            index={index}
            state={state}
            descriptors={descriptors}
            navigation={navigation}
            theme={theme}
            TAB_WIDTH={TAB_WIDTH}
            animatedIndex={animatedIndex}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomFill: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  floatingCircle: {
    position: 'absolute',
    left: 0,
    width: CIRCLE_TOTAL,
    height: CIRCLE_TOTAL,
    borderRadius: CIRCLE_TOTAL / 2,
    borderWidth: CIRCLE_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    zIndex: 5,
  },
});
