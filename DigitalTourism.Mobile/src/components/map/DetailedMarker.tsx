import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, type IconName} from '../../design';

interface DetailedMarkerProps {
  icon: IconName;
  color: string;
  isEvent?: boolean;
}

/**
 * Detailed marker for high zoom levels (14-20)
 * Shows category icon inside a styled container
 */
export function DetailedMarker({
  icon,
  color,
  isEvent = false,
}: DetailedMarkerProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color,
        },
        isEvent ? styles.eventShape : styles.attractionShape,
      ]}>
      <Icon source={icon} size={20} color="mainBackground" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  attractionShape: {
    borderRadius: 20,
  },
  eventShape: {
    borderRadius: 4,
  },
});
