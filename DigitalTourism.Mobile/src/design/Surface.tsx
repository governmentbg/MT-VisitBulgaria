import React from 'react';
import {Surface as PaperSurface} from 'react-native-paper';
import {
  SpacingProps,
  LayoutProps,
  useTheme,
} from '@shopify/restyle';
import {Box} from './Box';
import type {Theme} from '../theme';

export type SurfaceProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  React.ComponentProps<typeof PaperSurface> & {
    children: React.ReactNode;
    elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  };

export const Surface: React.FC<SurfaceProps> = ({
  children,
  elevation = 1,
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
    padding,
    paddingBottom,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingHorizontal,
    paddingVertical,
    width,
    height,
    flex,
    ...paperProps
  } = props as any;

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
  };
  
  const paddingProps = {
    padding,
    paddingBottom,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingHorizontal,
    paddingVertical,
  };

  return (
    <Box {...boxProps}>
      <PaperSurface
        elevation={elevation}
        style={[
          {
            backgroundColor: theme.colors.surfaceBackground,
            borderRadius: theme.borderRadii.l,
          },
          // Apply padding via style since Paper Surface doesn't accept Restyle props directly
          // We need to convert Restyle spacing keys to values if they are keys, but here we rely on Box wrapper for margins
          // For padding inside Surface, we can pass it to style if we want, or wrap children in Box.
          // Let's wrap children in Box for padding to be safe with Restyle tokens
          style
        ]}
        {...paperProps}
      >
        <Box {...paddingProps}>
          {children}
        </Box>
      </PaperSurface>
    </Box>
  );
};
