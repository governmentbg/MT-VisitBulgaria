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
import {SectionList as RNSectionList} from 'react-native';
import type {Theme} from '../theme';

// SectionList with Restyle props
export const SectionList = createRestyleComponent<
  SpacingProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    LayoutProps<Theme> &
    React.ComponentProps<typeof RNSectionList>,
  Theme
>([spacing, border, backgroundColor, layout], RNSectionList);
