import React from 'react';
import {TextInput as PaperTextInput} from 'react-native-paper';
import {
  SpacingProps,
  LayoutProps,
  useTheme,
} from '@shopify/restyle';
import {Box} from './Box';
import type {Theme} from '../theme';

export type TextInputProps = SpacingProps<Theme> &
  LayoutProps<Theme> &
  React.ComponentProps<typeof PaperTextInput> & {
    disabled?: boolean;
  };

export const TextInput: React.FC<TextInputProps> = ({
  mode = 'outlined',
  style,
  disabled,
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

  return (
    <Box {...boxProps}>
      <PaperTextInput
        mode={mode}
        disabled={disabled}
        style={[{backgroundColor: theme.colors.mainBackground}, style]}
        theme={{
          colors: {
            primary: theme.colors.primary,
            error: theme.colors.error,
            background: theme.colors.mainBackground,
          }
        }}
        {...paperProps}
      />
    </Box>
  );
};
