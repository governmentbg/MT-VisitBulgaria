import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import {Icon} from '../design';
import type {IconName} from '../design/Icon';
import {useTranslation} from 'react-i18next';
import {fonts} from '../theme/fonts';
import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import type {Theme} from '../theme';

// Outline icons shown in the bar (inactive state)
const TAB_ICON_MAP: Record<string, IconName> = {
  Explore: 'map-marker-outline',
  Events: 'calendar-blank-outline',
  Routes: 'compass-outline',
  Favourites: 'heart-outline',
};

export const TabItem = ({
  route,
  index,
  state,
  descriptors,
  navigation,
  theme,
  TAB_WIDTH,
  animatedIndex,
}: {
  route: BottomTabBarProps['state']['routes'][number];
  index: number;
  state: BottomTabBarProps['state'];
  descriptors: BottomTabBarProps['descriptors'];
  navigation: BottomTabBarProps['navigation'];
  theme: Theme;
  TAB_WIDTH: number;
  animatedIndex: SharedValue<number>;
}) => {
  const {t} = useTranslation('navigation');
  const {options} = descriptors[route.key];
  const isFocused = state.index === index;

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const iconName = TAB_ICON_MAP[route.name] || ('help-circle-outline' as IconName);
  const label = t(`tabs.${route.name.toLowerCase()}`);

  // Icon fades out when this tab is active (icon moves to floating circle)
  const rIconStyle = useAnimatedStyle(() => {
    const dist = Math.abs(animatedIndex.value - index);
    const clamped = Math.min(Math.max(dist, 0), 1);
    const opacity = interpolate(clamped, [0, 0.4, 1], [0, 1, 1]);
    return {opacity};
  });

  // Active label (green-700, bold) – fades in when active
  const rActiveLabelStyle = useAnimatedStyle(() => {
    const dist = Math.abs(animatedIndex.value - index);
    const clamped = Math.min(Math.max(dist, 0), 1);
    const opacity = interpolate(clamped, [0, 0.4, 1], [1, 0, 0]);
    return {opacity};
  });

  // Inactive label (gray, regular) – fades in when inactive
  const rInactiveLabelStyle = useAnimatedStyle(() => {
    const dist = Math.abs(animatedIndex.value - index);
    const clamped = Math.min(Math.max(dist, 0), 1);
    const opacity = interpolate(clamped, [0, 0.4, 1], [0, 1, 1]);
    return {opacity};
  });

  return (
    <TouchableOpacity
      accessibilityRole="tab"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.tabItem, {width: TAB_WIDTH}]}>
      {/* Icon – hidden when this tab is active */}
      <Animated.View style={[styles.iconContainer, rIconStyle]}>
        <Icon source={iconName} size={24} color={theme.colors.textSecondary} />
      </Animated.View>

      {/* Label with cross-fade between active/inactive styles */}
      <View style={styles.labelContainer}>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            {color: theme.colors.textSecondary, fontFamily: fonts.regular},
            rInactiveLabelStyle,
          ]}>
          {label}
        </Animated.Text>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            styles.labelAbsolute,
            {color: theme.colors.accentGreenDark, fontFamily: fonts.bold},
            rActiveLabelStyle,
          ]}>
          {label}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    height: '100%',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    marginTop: 4,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 14,
  },
  labelAbsolute: {
    position: 'absolute',
  },
});
