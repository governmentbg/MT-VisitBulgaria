import React from 'react';
import {Icon as PaperIcon} from 'react-native-paper';
import {
  SpacingProps,
  LayoutProps,
  ColorProps,
} from '@shopify/restyle';
import glyphMap from '@react-native-vector-icons/material-design-icons/glyphmaps/MaterialDesignIcons.json';
import {Box} from './Box';
import {Theme, useTheme} from '../theme';

export type IconName = keyof typeof glyphMap;

export type IconProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  Omit<ColorProps<Theme>, 'color'> & {
    source: IconName;//| Exclude<React.ComponentProps<typeof PaperIcon>['source'], string>;
    size?: keyof Theme['iconSizes'] | number;
    color?: keyof Theme['colors'] | string;
  };

export const Icon: React.FC<IconProps> = ({
  source,
  size = 'm',
  color: iconColor,
  ...restyleProps
}) => {
  const {theme} = useTheme();

  // Resolve size from theme or use as-is if it's a number
  const resolvedSize =
    typeof size === 'string' && size in theme.iconSizes
      ? theme.iconSizes[size as keyof Theme['iconSizes']]
      : typeof size === 'number'
      ? size
      : theme.iconSizes.m;

  // Resolve color from theme or use as-is if it's a string
  const resolvedColor =
    iconColor && typeof iconColor === 'string' && iconColor in theme.colors
      ? theme.colors[iconColor as keyof Theme['colors']]
      : iconColor || theme.colors.textPrimary;

  return (
    <Box {...restyleProps}>
      <PaperIcon source={source} size={resolvedSize} color={resolvedColor} />
    </Box>
  );
};
