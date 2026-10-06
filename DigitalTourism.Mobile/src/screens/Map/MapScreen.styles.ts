import {StyleSheet} from 'react-native';

export {DEFAULT_REGION} from '../../constants/map';

// Bulgaria geographic bounds
export const BULGARIA_BOUNDS = {
  northEast: {
    latitude: 44.2, // Northern border
    longitude: 28.6, // Eastern border
  },
  southWest: {
    latitude: 41.2, // Southern border
    longitude: 22.4, // Western border
  },
};

export const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.99, // Hack to prevent map flickering/reloading on Android
  },
});
