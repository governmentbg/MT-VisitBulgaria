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
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import type {Theme} from '../theme';

// SafeAreaView with Restyle props
export const SafeAreaView = createRestyleComponent<
  SpacingProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    LayoutProps<Theme> &
    React.ComponentProps<typeof RNSafeAreaView>,
  Theme
>([spacing, border, backgroundColor, layout], RNSafeAreaView);
