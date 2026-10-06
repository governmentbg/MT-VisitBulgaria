import React from 'react';
import {TouchableRipple} from 'react-native-paper';
import {
  SpacingProps,
  LayoutProps,
  BorderProps,
  BackgroundColorProps,
  useTheme,
} from '@shopify/restyle';
import {Box} from './Box';
import type {Theme} from '../theme';

export type PressableProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  React.ComponentProps<typeof TouchableRipple> & {
    children: React.ReactNode;
    testID?: string;
    accessibilityLabel?: string;
  };

export const Pressable: React.FC<PressableProps> = ({
  children,
  style,
  ...props
}) => {
  const theme = useTheme<Theme>();

  // Extract layout/spacing props
  const {
    margin,
    marginBottom,
    marginTop,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    width,
    height,
    flex,
    backgroundColor,
    borderRadius,
    borderWidth,
    borderColor,
    testID,
    accessibilityLabel,
    ...paperProps
  } = props as any; // Restyle props are not compatible with Paper's ViewStyle types

  const boxProps = {
    margin,
    marginBottom,
    marginTop,
    marginLeft,
    marginRight,
    marginHorizontal,
    marginVertical,
    width,
    height,
    flex,
    // We apply background/border to the Box wrapper or the Ripple?
    // Ripple needs to be on top of background usually.
    // If we put background on Box, Ripple is inside.
    // If we put background on Ripple style, it works.
    // Let's pass background/border to Ripple style via Restyle resolution if possible,
    // or just let Box handle it and Ripple be inside.
    // But Ripple needs to fill the Box.
  };

  // Resolve theme values for style
  const resolvedStyle = {
    backgroundColor: backgroundColor ? theme.colors[backgroundColor as keyof Theme['colors']] : undefined,
    borderRadius: borderRadius ? theme.borderRadii[borderRadius as keyof Theme['borderRadii']] : undefined,
    borderColor: borderColor ? theme.colors[borderColor as keyof Theme['colors']] : undefined,
    borderWidth: borderWidth,
  };

  return (
    <Box {...boxProps} overflow="hidden" style={[{borderRadius: resolvedStyle.borderRadius}]}>
      <TouchableRipple
        style={[resolvedStyle, style]}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        {...paperProps}
      >
        
        {children ? children : <Box />}
        
      </TouchableRipple>
    </Box>
  );
};
