import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';
import lightTheme from '../theme/theme';
import {WelcomeScreen} from '../screens/Onboarding/WelcomeScreen';
import {CarouselScreen} from '../screens/Onboarding/CarouselScreen';
import type {OnboardingStackParamList} from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 350,
        }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Carousel" component={CarouselScreen} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
