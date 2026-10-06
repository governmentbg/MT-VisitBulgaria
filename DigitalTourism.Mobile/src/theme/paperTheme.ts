import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import type {MD3Theme} from 'react-native-paper';
import {Theme} from './theme';
import {fonts} from './fonts';

export const createPaperTheme = (restyleTheme: Theme, isDark: boolean): MD3Theme => {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  // Fallback to base theme fonts if custom fonts aren't loaded
  const baseFonts = baseTheme.fonts;

  return {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: restyleTheme.colors.primary,
      primaryContainer: restyleTheme.colors.primaryLight,
      secondary: restyleTheme.colors.gray800,
      secondaryContainer: restyleTheme.colors.gray200,
      tertiary: restyleTheme.colors.info,
      error: restyleTheme.colors.error,
      errorContainer: '#FDECEA',
      background: restyleTheme.colors.mainBackground,
      surface: restyleTheme.colors.cardBackground,
      surfaceVariant: restyleTheme.colors.surfaceBackground,
      outline: restyleTheme.colors.border,
      outlineVariant: restyleTheme.colors.divider,
      onPrimary: restyleTheme.colors.textOnPrimary,
      onPrimaryContainer: restyleTheme.colors.textPrimary,
      onSecondary: restyleTheme.colors.textOnPrimary,
      onSecondaryContainer: restyleTheme.colors.textPrimary,
      onTertiary: restyleTheme.colors.textOnPrimary,
      onError: restyleTheme.colors.textOnPrimary,
      onErrorContainer: restyleTheme.colors.error,
      onBackground: restyleTheme.colors.textPrimary,
      onSurface: restyleTheme.colors.textPrimary,
      onSurfaceVariant: restyleTheme.colors.textSecondary,
      inverseSurface: isDark ? restyleTheme.colors.gray100 : restyleTheme.colors.gray900,
      inverseOnSurface: isDark ? restyleTheme.colors.textPrimary : restyleTheme.colors.textOnPrimary,
      inversePrimary: restyleTheme.colors.primaryDark,
      shadow: 'rgba(0, 0, 0, 0.3)',
      scrim: restyleTheme.colors.overlay,
      backdrop: restyleTheme.colors.overlay,
      elevation: {
        level0: 'transparent',
        level1: isDark ? '#1E1E1E' : '#FFFFFF',
        level2: isDark ? '#232323' : '#F5F5F5',
        level3: isDark ? '#282828' : '#EEEEEE',
        level4: isDark ? '#2C2C2C' : '#E8E8E8',
        level5: isDark ? '#2E2E2E' : '#E0E0E0',
      },
      surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
      onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',
    },
    // @ts-ignore - MD3Type doesn't allow fontSize/lineHeight overrides but they work at runtime
    fonts: {
      ...baseFonts,
      displayLarge: {
        ...baseFonts.displayLarge,
        fontFamily: fonts.bold,
        fontSize: restyleTheme.textVariants.header.fontSize as number,
        lineHeight: restyleTheme.textVariants.header.lineHeight as number,
      },
      displayMedium: {
        ...baseFonts.displayMedium,
        fontFamily: fonts.bold,
        fontSize: restyleTheme.textVariants.subheader.fontSize,
        lineHeight: restyleTheme.textVariants.subheader.lineHeight,
      },
      displaySmall: {
        ...baseFonts.displaySmall,
        fontFamily: fonts.bold,
        fontSize: restyleTheme.textVariants.title.fontSize,
        lineHeight: restyleTheme.textVariants.title.lineHeight,
      },
      headlineLarge: {
        ...baseFonts.headlineLarge,
        fontFamily: fonts.bold,
        fontSize: restyleTheme.textVariants.header.fontSize,
        lineHeight: restyleTheme.textVariants.header.lineHeight,
      },
      headlineMedium: {
        ...baseFonts.headlineMedium,
        fontFamily: fonts.bold,
        fontSize: restyleTheme.textVariants.subheader.fontSize,
        lineHeight: restyleTheme.textVariants.subheader.lineHeight,
      },
      headlineSmall: {
        ...baseFonts.headlineSmall,
        fontFamily: fonts.bold,
        fontSize: restyleTheme.textVariants.title.fontSize,
        lineHeight: restyleTheme.textVariants.title.lineHeight,
      },
      titleLarge: {
        ...baseFonts.titleLarge,
        fontFamily: fonts.medium,
        fontSize: restyleTheme.textVariants.title.fontSize,
        lineHeight: restyleTheme.textVariants.title.lineHeight,
      },
      titleMedium: {
        ...baseFonts.titleMedium,
        fontFamily: fonts.medium,
        fontSize: restyleTheme.textVariants.subtitle.fontSize,
        lineHeight: restyleTheme.textVariants.subtitle.lineHeight,
      },
      titleSmall: {
        ...baseFonts.titleSmall,
        fontFamily: fonts.medium,
        fontSize: restyleTheme.textVariants.body.fontSize,
        lineHeight: restyleTheme.textVariants.body.lineHeight,
      },
      labelLarge: {
        ...baseFonts.labelLarge,
        fontFamily: fonts.medium,
        fontSize: restyleTheme.textVariants.button.fontSize,
        lineHeight: restyleTheme.textVariants.button.lineHeight,
      },
      labelMedium: {
        ...baseFonts.labelMedium,
        fontFamily: fonts.medium,
        fontSize: restyleTheme.textVariants.caption.fontSize,
        lineHeight: restyleTheme.textVariants.caption.lineHeight,
      },
      labelSmall: {
        ...baseFonts.labelSmall,
        fontFamily: fonts.medium,
        fontSize: restyleTheme.textVariants.small.fontSize,
        lineHeight: restyleTheme.textVariants.small.lineHeight,
      },
      bodyLarge: {
        ...baseFonts.bodyLarge,
        fontFamily: fonts.regular,
        fontSize: restyleTheme.textVariants.body.fontSize,
        lineHeight: restyleTheme.textVariants.body.lineHeight,
      },
      bodyMedium: {
        ...baseFonts.bodyMedium,
        fontFamily: fonts.regular,
        fontSize: restyleTheme.textVariants.body.fontSize,
        lineHeight: restyleTheme.textVariants.body.lineHeight,
      },
      bodySmall: {
        ...baseFonts.bodySmall,
        fontFamily: fonts.regular,
        fontSize: restyleTheme.textVariants.caption.fontSize,
        lineHeight: restyleTheme.textVariants.caption.lineHeight,
      },
      default: {
        ...baseFonts.default,
        fontFamily: fonts.regular               
      },
    },
  };
};
