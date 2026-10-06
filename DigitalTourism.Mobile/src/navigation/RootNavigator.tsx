import React, {useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigationState} from '@react-navigation/native';
import {NavigationStateTracker} from '../contexts/NavigationContext';
import {useTranslation} from 'react-i18next';
import {analytics} from '../services/analytics';

import {BottomTabNavigator} from './BottomTabNavigator';
import {OnboardingNavigator} from './OnboardingNavigator';
import {AnimatedSplashScreen} from '../screens/Onboarding/AnimatedSplashScreen';
import {EventDetailScreen} from '../screens/Events/EventDetailScreen';
import {AttractionDetailScreen} from '../screens/Attractions/AttractionDetailScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {EditProfileScreen} from '../screens/Profile/EditProfileScreen';
import {HotelDetailScreen} from '../screens/Hotels/HotelDetailScreen';
import {RestaurantDetailScreen} from '../screens/Restaurants/RestaurantDetailScreen';
import {ActivityDetailScreen} from '../screens/Activities/ActivityDetailScreen';
import {RouteDetailScreen} from '../screens/Routes/RouteDetailScreen';
import {CreateRouteScreen} from '../screens/Routes/CreateRouteScreen';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Higher-order component that wraps screens with the tracker + GA4 screen view
function withNavigationTracker<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  function TrackedComponent(props: P) {
    const currentRouteName = useNavigationState(state => {
      if (!state) return undefined;
      return state.routes[state.index]?.name;
    });
    const prevRouteRef = useRef<string | undefined>(undefined);

    useEffect(() => {
      if (currentRouteName && currentRouteName !== prevRouteRef.current) {
        analytics.trackScreenView(currentRouteName);
        prevRouteRef.current = currentRouteName;
      }
    }, [currentRouteName]);

    return (
      <>
        <NavigationStateTracker />
        <Component {...props} />
      </>
    );
  }
  TrackedComponent.displayName = `withNavigationTracker(${Component.displayName || Component.name || 'Component'})`;
  return TrackedComponent;
}

// Wrap all screen components with navigation tracking
const tracked = {
  Main: withNavigationTracker(BottomTabNavigator),
  EventDetail: withNavigationTracker(EventDetailScreen),
  AttractionDetail: withNavigationTracker(AttractionDetailScreen),
  Settings: withNavigationTracker(SettingsScreen),
  HotelDetail: withNavigationTracker(HotelDetailScreen),
  RestaurantDetail: withNavigationTracker(RestaurantDetailScreen),
  ActivityDetail: withNavigationTracker(ActivityDetailScreen),
  Profile: withNavigationTracker(ProfileScreen),
  EditProfile: withNavigationTracker(EditProfileScreen),
  RouteDetail: withNavigationTracker(RouteDetailScreen),
  CreateRoute: withNavigationTracker(CreateRouteScreen),
};

export const RootNavigator = () => {
  const {t} = useTranslation('navigation');

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="AnimatedSplash"
        component={AnimatedSplashScreen}
        options={{animation: 'none'}}
      />
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      <Stack.Screen name="Main" component={tracked.Main} />     
      <Stack.Screen
        name="EventDetail"
        component={tracked.EventDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AttractionDetail"
        component={tracked.AttractionDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HotelDetail"
        component={tracked.HotelDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={tracked.RestaurantDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={tracked.ActivityDetail}
        options={{
          headerShown: false,
        }}
      />
<Stack.Screen
        name="Profile"
        component={tracked.Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={tracked.EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RouteDetail"
        component={tracked.RouteDetail}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="CreateRoute"
        component={tracked.CreateRoute}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={tracked.Settings}
        options={{
          headerShown: true,
          title: t('screens.settings'),
        }}
      />
    </Stack.Navigator>
  );
};
