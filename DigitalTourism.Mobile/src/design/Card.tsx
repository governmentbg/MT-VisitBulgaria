import React from 'react';
import {Card as PaperCard} from 'react-native-paper';
import {
  SpacingProps,
  LayoutProps,
} from '@shopify/restyle';
import {Box} from './Box';
import {Theme, useTheme} from '../theme';

export type CardProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  React.ComponentProps<typeof PaperCard> & {
    variant?: 'elevated' | 'outlined' | 'contained';
    children: React.ReactNode;
  };

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  ...props
}) => {
  const {theme} = useTheme();

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
  };

  const contentPadding = {
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
      <PaperCard
        mode={variant}
        style={[{backgroundColor: theme.colors.cardBackground}, style]}
        {...paperProps}
      >
        <PaperCard.Content style={contentPadding}>
          {children}
        </PaperCard.Content>
      </PaperCard>
    </Box>
  );
};
