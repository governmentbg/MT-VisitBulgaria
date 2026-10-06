import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {linking} from '../navigation/linking';
import { createMMKV } from 'react-native-mmkv';
import BootSplash from 'react-native-bootsplash';
import theme from './theme';
import darkTheme from './darkTheme';
import { createPaperTheme } from './paperTheme';
import type { Theme } from './theme';
import { SystemBars } from 'react-native-edge-to-edge';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const storage = createMMKV({ id: 'theme-storage' });
const THEME_MODE_KEY = '@theme_mode';

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();

  // Initialize theme mode from storage or default to 'system'
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return 'light'; // Force light theme only for now
  });

  // Determine if dark mode should be active
  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  // Select the appropriate theme
  const activeTheme = isDark ? darkTheme : theme;

  // Persist theme mode changes
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storage.set(THEME_MODE_KEY, mode);
  };

  // Update when system color scheme changes and mode is 'system'
  useEffect(() => {
    if (themeMode === 'system') {
      // Force re-render when system theme changes
      setThemeModeState('system');
    }
  }, [systemColorScheme, themeMode]);

  const paperTheme = createPaperTheme(activeTheme, isDark);

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialLight: isDark ? undefined : paperTheme,
    materialDark: isDark ? paperTheme : undefined,
  });

  const navigationTheme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider
      value={{ themeMode, setThemeMode, isDark, theme: activeTheme }}
    >
      <RestyleThemeProvider theme={activeTheme}>
        <PaperProvider theme={paperTheme}>
          <NavigationContainer
            theme={navigationTheme}
            linking={linking}
            onReady={() => {
              // Hide instantly — AnimatedSplashScreen takes over seamlessly
              BootSplash.hide({ fade: false });
            }}
          >
             <SystemBars style={isDark ? "light" : "dark"}  />
             
            {children}
          </NavigationContainer>
        </PaperProvider>
      </RestyleThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
};

export type { Theme };
