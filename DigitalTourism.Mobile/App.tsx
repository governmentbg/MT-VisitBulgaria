/**
 * Visit Bulgaria App
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AppThemeProvider } from './src/theme';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { I18nProvider } from './src/providers/I18nProvider';
import { QueryProvider } from './src/providers/QueryProvider';
import { AudioPlayerProvider } from './src/contexts/AudioPlayerContext';
import { AlertProvider } from './src/contexts/AlertContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { NavigationContextProvider } from './src/contexts/NavigationContext';
import { MiniAudioPlayer } from './src/components/audio';
import { MaintenanceProvider } from './src/providers/MaintenanceProvider';

import { RootNavigator } from './src/navigation/RootNavigator';
import {ErrorBoundary} from './src/components/common/ErrorBoundary';

enableFreeze(true);
enableScreens(true);

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppThemeProvider>
        <I18nProvider>
          <QueryProvider>
            <AlertProvider>
            <MaintenanceProvider>
            <AuthProvider>
              <AudioPlayerProvider>
                <NavigationContextProvider>
                  <BottomSheetModalProvider>
                    <ErrorBoundary>
                      <View style={styles.container}>
                        <RootNavigator />
                        <MiniAudioPlayer />
                      </View>
                    </ErrorBoundary>
                  </BottomSheetModalProvider>
                </NavigationContextProvider>
              </AudioPlayerProvider>
            </AuthProvider>
            </MaintenanceProvider>
            </AlertProvider>
          </QueryProvider>
        </I18nProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
