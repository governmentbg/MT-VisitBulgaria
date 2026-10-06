import React from 'react';
import {Button as PaperButton} from 'react-native-paper';
import {
  SpacingProps,
  LayoutProps,
} from '@shopify/restyle';
import {Box} from './Box';
import {Theme, useTheme} from '../theme';

export type ButtonProps = SpacingProps<Theme> &
  LayoutProps<Theme> & {
    onPress: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outlined' | 'text';
    icon?: string;
    testID?: string;
    accessibilityLabel?: string;
  };

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  testID,
  accessibilityLabel,
  ...restyleProps
}) => {
  const {theme} = useTheme();

  let mode: 'contained' | 'contained-tonal' | 'outlined' | 'text' = 'contained';
  let buttonColor: string | undefined;
  let textColor: string | undefined;

  switch (variant) {
    case 'primary':
      mode = 'contained';
      buttonColor = theme.colors.primary;
      textColor = theme.colors.textOnPrimary;
      break;
    case 'secondary':
      mode = 'contained-tonal';
      buttonColor = theme.colors.gray200;
      textColor = theme.colors.textPrimary;
      break;
    case 'outlined':
      mode = 'outlined';
      textColor = theme.colors.primary;
      break;
    case 'text':
      mode = 'text';
      textColor = theme.colors.primary;
      break;
  }

  return (
    <Box {...restyleProps}>
      <PaperButton
        mode={mode}
        onPress={onPress}
        loading={loading}
        disabled={disabled}
        icon={icon}
        buttonColor={buttonColor}
        textColor={textColor}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={{borderRadius: theme.borderRadii.m}}
        labelStyle={{
          fontFamily: theme.textVariants.button.fontFamily,
          fontSize: theme.textVariants.button.fontSize,
          lineHeight: theme.textVariants.button.lineHeight,
        }}
      >
        {children}
      </PaperButton>
    </Box>
  );
};
