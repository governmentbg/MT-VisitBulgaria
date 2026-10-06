/**
 * @format
 */

// Must be imported before any code that uses crypto.getRandomValues()
import 'react-native-get-random-values';

import {AppRegistry} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import {StyleSheet} from 'react-native';

const rootStyle = StyleSheet.flatten({flex: 1});

const RootApp = () => (
  <GestureHandlerRootView style={rootStyle}>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => RootApp);

// Register the playback service for react-native-track-player
TrackPlayer.registerPlaybackService(() => require('./service'));
