import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import type {SvgProps} from 'react-native-svg';
import {Box, Icon, Text} from '../../design';
import type {IconName} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {fonts} from '../../theme/fonts';

type MapFabSize = 'small' | 'medium';

interface MapFabBaseProps {
  size?: MapFabSize;
  onPress: () => void;
  badge?: number;
  accessibilityLabel?: string;
}

interface MapFabIconProps extends MapFabBaseProps {
  icon: IconName;
  svgIcon?: never;
  iconColor?: string;
}

interface MapFabSvgProps extends MapFabBaseProps {
  icon?: never;
  svgIcon: React.FC<SvgProps>;
  iconColor?: never;
}

type MapFabProps = MapFabIconProps | MapFabSvgProps;

const SIZE_CONFIG = {
  small: {
    container: moderateScale(32),
    icon: moderateScale(16),
  },
  medium: {
    container: moderateScale(40),
    icon: moderateScale(24),
  },
};

/**
 * Floating action button for map overlays.
 * Supports both MaterialDesignIcons (via `icon` prop) and custom SVG components (via `svgIcon` prop).
 */
export function MapFab(props: MapFabProps) {
  const {size = 'medium', onPress, badge, accessibilityLabel} = props;
  const config = SIZE_CONFIG[size];
  const hitSlopValue = size === 'small' ? 6 : 2;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      hitSlop={{top: hitSlopValue, bottom: hitSlopValue, left: hitSlopValue, right: hitSlopValue}}>
      <Box
        backgroundColor="mainBackground"
        borderRadius="full"
        alignItems="center"
        justifyContent="center"
        width={config.container}
        height={config.container}
        style={styles.container}>
        {props.svgIcon ? (
          <props.svgIcon width={config.icon} height={config.icon} />
        ) : (
          <Icon
            source={props.icon}
            size={config.icon}
            color={props.iconColor ?? 'textPrimary'}
          />
        )}
      </Box>
      {badge != null && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: palette.green700,
    borderRadius: 100,
    minWidth: moderateScale(18),
    height: moderateScale(18),
    paddingHorizontal: moderateScale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: moderateScale(11),
    fontFamily: fonts.bold,
    color: palette.white,
    lineHeight: moderateScale(11),
  },
});
