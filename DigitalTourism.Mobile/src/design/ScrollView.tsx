import {
  createRestyleComponent,
  spacing,
  border,
  backgroundColor,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  layout,
  LayoutProps,
} from '@shopify/restyle';
import {ScrollView as RNScrollView} from 'react-native';
import type {Theme} from '../theme';

// ScrollView with Restyle props
export const ScrollView = createRestyleComponent<
  SpacingProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    LayoutProps<Theme> &
    React.ComponentProps<typeof RNScrollView>,
  Theme
>([spacing, border, backgroundColor, layout], RNScrollView);
