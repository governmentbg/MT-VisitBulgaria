import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';
import {CustomTabBar} from './CustomTabBar';
import {MapScreen} from '../screens/Map/MapScreen';
import {EventsScreen} from '../screens/Events/EventsScreen';
import {RoutesScreen} from '../screens/Routes/RoutesScreen';
import {FavouritesScreen} from '../screens/Favourites/FavouritesScreen';
import {ConfirmDialog} from '../design/ConfirmDialog';
import {useAuth} from '../contexts/AuthContext';
import type {TabParamList} from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const TabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

export const BottomTabNavigator = () => {
  const {t} = useTranslation('navigation');
  const {t: tCommon} = useTranslation('common');
  const {sessionExpired, clearSessionExpired} = useAuth();

  return (
    <>
      <Tab.Navigator
        tabBar={TabBar}
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="Explore"
          component={MapScreen}
          options={{title: t('tabs.explore')}}
        />
        <Tab.Screen
          name="Events"
          component={EventsScreen}
          options={{title: t('tabs.events')}}
        />
        <Tab.Screen
          name="Routes"
          component={RoutesScreen}
          options={{title: t('tabs.routes')}}
        />
        <Tab.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{title: t('tabs.favourites')}}
        />
      </Tab.Navigator>

      <ConfirmDialog
        visible={sessionExpired}
        onDismiss={clearSessionExpired}
        icon="clock-alert-outline"
        title={tCommon('sessionExpired', {defaultValue: 'Session Expired'})}
        message={tCommon('sessionExpiredMessage', {defaultValue: 'Your session has expired. Please log in again.'})}
        actions={[
          {
            label: tCommon('ok', {defaultValue: 'OK'}),
            onPress: clearSessionExpired,
            variant: 'default',
          },
        ]}
      />
    </>
  );
};
