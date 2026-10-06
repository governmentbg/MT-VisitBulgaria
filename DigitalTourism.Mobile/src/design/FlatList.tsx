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
import {FlatList as RNFlatList} from 'react-native';
import type {Theme} from '../theme';
import type {FlatListProps as RNFlatListProps} from 'react-native';
type FlatListRestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme>;

// Base Restyle FlatList (non-generic internally; generic typing is provided by FlatListWrapper)
const RestyleFlatList = createRestyleComponent<
  FlatListRestyleProps & RNFlatListProps<unknown>,
  Theme
>([spacing, border, backgroundColor, layout], RNFlatList);

export type FlatListWrapperProps<ItemT> = FlatListRestyleProps &
  RNFlatListProps<ItemT>;

/**
 * FlatListWrapper - FlatList with Restyle props and proper generic typing for items.
 */
export function FlatListWrapper<ItemT>(props: FlatListWrapperProps<ItemT>) {
  return <RestyleFlatList {...(props as FlatListWrapperProps<unknown>)} />;
}

// Backwards-compatible export name (typed as a generic component)
export const FlatList = RestyleFlatList as unknown as <ItemT>(
  props: FlatListWrapperProps<ItemT>,
) => React.JSX.Element;
