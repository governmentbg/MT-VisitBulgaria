import {createTheme} from '@shopify/restyle';
import {palette} from './palette';
import {fonts} from './fonts';
import {moderateScale} from './scaling';

const theme = createTheme({
  colors: {
    // Main backgrounds
    mainBackground: palette.white,
    cardBackground: palette.white,
    surfaceBackground: palette.gray50,

    // Primary colors (green — brand identity)
    primary: palette.green700,
    primaryLight: palette.green50,
    primaryDark: palette.green800,

    // Accent green
    accentGreen: palette.green500,
    accentGreenDark: palette.green700,
    accentGreenDarker: palette.green800,
    accentGreenLight: palette.green50,
    accentGreenMid: palette.green300,

    // Text colors
    textPrimary: palette.black,
    textHeading: palette.heading,
    textSecondary: palette.gray600,
    textTertiary: palette.gray400,
    textOnPrimary: palette.white,

    // Status colors
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
    info: palette.info,

    // Danger
    dangerLight: palette.dangerLight,
    dangerDark: palette.dangerDark,

    // Borders and dividers
    border: palette.gray100,
    divider: palette.gray100,

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.4)',
    transparent: palette.transparent,

    // Grays
    gray50: palette.gray50,
    gray100: palette.gray100,
    gray200: palette.gray200,
    gray400: palette.gray400,
    gray600: palette.gray600,
    gray800: palette.gray800,
    gray900: palette.gray900,
  },
  spacing: {
    // Scaled variants (default for responsive UI)
    none: 0,
    xs: moderateScale(4),
    s: moderateScale(8),
    m: moderateScale(16),
    l: moderateScale(24),
    xl: moderateScale(32),
    xxl: moderateScale(40),
    xxxl: moderateScale(48),

    // Fixed variants (non-scaling)
    noneFixed: 0,
    xsFixed: 4,
    sFixed: 8,
    mFixed: 16,
    lFixed: 24,
    xlFixed: 32,
    xxlFixed: 40,
    xxxlFixed: 48,
  },
  borderRadii: {
    none: 0,
    xs: moderateScale(2),
    s: moderateScale(4),
    m: moderateScale(8),
    l: moderateScale(12),
    xl: moderateScale(16),
    xxl: moderateScale(24),
    full: 9999,

    // Fixed variants
    xsFixed: 2,
    sFixed: 4,
    mFixed: 8,
    lFixed: 12,
    xlFixed: 16,
    xxlFixed: 24,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },
  textVariants: {
    defaults: {
      fontFamily: fonts.regular,
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
      color: 'textPrimary',
    },
    header: {
      fontFamily: fonts.bold,
      fontSize: moderateScale(34),
      lineHeight: moderateScale(40),
      color: 'textHeading',
    },
    subheader: {
      fontFamily: fonts.bold,
      fontSize: moderateScale(28),
      lineHeight: moderateScale(36),
      color: 'textHeading',
    },
    title: {
      fontFamily: fonts.bold,
      fontSize: moderateScale(24),
      lineHeight: moderateScale(29),
      color: 'textHeading',
    },
    subtitle: {
      fontFamily: fonts.bold,
      fontSize: moderateScale(16),
      lineHeight: moderateScale(19),
      color: 'textHeading',
    },
    body: {
      fontFamily: fonts.regular,
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
      color: 'textPrimary',
    },
    bodyMedium: {
      fontFamily: fonts.medium,
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
      color: 'textPrimary',
    },
    caption: {
      fontFamily: fonts.regular,
      fontSize: moderateScale(14),
      lineHeight: moderateScale(21),
      color: 'textSecondary',
    },
    captionBold: {
      fontFamily: fonts.bold,
      fontSize: moderateScale(14),
      lineHeight: moderateScale(14),
      color: 'textSecondary',
    },
    small: {
      fontFamily: fonts.regular,
      fontSize: moderateScale(12),
      lineHeight: moderateScale(16),
      color: 'textSecondary',
    },
    button: {
      fontFamily: fonts.bold,
      fontSize: moderateScale(16),
      lineHeight: moderateScale(16),
      color: 'textOnPrimary',
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'cardBackground',
      borderRadius: 'l',
      padding: 'm',
    },
    elevated: {
      backgroundColor: 'cardBackground',
      borderRadius: 'xl',
      padding: 'm',
      shadowColor: 'gray800',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    outlined: {
      backgroundColor: 'cardBackground',
      borderRadius: 'xl',
      padding: 'm',
      borderWidth: 1,
      borderColor: 'border',
    },
    subtle: {
      backgroundColor: 'surfaceBackground',
      borderRadius: 'xl',
      padding: 's',
    },
  },
  buttonVariants: {
    defaults: {
      backgroundColor: 'primary',
      borderRadius: 'full',
      paddingHorizontal: 'l',
      paddingVertical: 'm',
    },
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'primaryLight',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'primary',
    },
    text: {
      backgroundColor: 'transparent',
      paddingHorizontal: 's',
      paddingVertical: 's',
    },
  },
  iconSizes: {
    xs: moderateScale(12),
    s: moderateScale(16),
    m: moderateScale(24),
    l: moderateScale(32),
    xl: moderateScale(48),
    xsFixed: 12,
    sFixed: 16,
    mFixed: 24,
    lFixed: 32,
    xlFixed: 48,
  },
});

export type Theme = typeof theme;
export default theme;
