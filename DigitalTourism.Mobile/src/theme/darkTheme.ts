import {palette} from './palette';
import theme from './theme';

const darkTheme: typeof theme = {
  ...theme,
  colors: {
    // Main backgrounds
    mainBackground: palette.black,
    cardBackground: palette.darkSurface,
    surfaceBackground: palette.gray900,

    // Primary colors (keep brand green)
    primary: palette.green700,
    primaryLight: palette.green800,
    primaryDark: palette.green800,

    // Accent green
    accentGreen: palette.green500,
    accentGreenDark: palette.green700,
    accentGreenDarker: palette.green800,
    accentGreenLight: palette.green50,
    accentGreenMid: palette.green300,

    // Text colors (inverted)
    textPrimary: palette.white,
    textHeading: palette.white,
    textSecondary: palette.gray400,
    textTertiary: palette.gray800,
    textOnPrimary: palette.white,

    // Status colors
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    info: palette.info,

    // Danger
    dangerLight: palette.dangerDark,
    dangerDark: palette.dangerLight,

    // Borders and dividers
    border: palette.gray800,
    divider: palette.gray800,

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.7)',
    transparent: palette.transparent,

    // Grays (inverted for dark mode)
    gray50: palette.gray900,
    gray100: palette.gray800,
    gray200: palette.gray800,
    gray400: palette.gray400,
    gray600: palette.gray400,
    gray800: palette.gray200,
    gray900: palette.gray50,
  },
};

export default darkTheme;
