// Export theme types
export type {Theme, ThemeMode} from './AppThemeProvider';

// Export palette and fonts
export {palette} from './palette';
export {fonts} from './fonts';

// Export themes
export {default as theme} from './theme';
export {default as darkTheme} from './darkTheme';

// Export theme context and provider
export {
  AppThemeProvider,  
  useTheme,
} from './AppThemeProvider';

// Re-export useful types from restyle
export type {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  LayoutProps,
  OpacityProps,
  VisibleProps,
  TypographyProps,
  ShadowProps,
} from '@shopify/restyle';


