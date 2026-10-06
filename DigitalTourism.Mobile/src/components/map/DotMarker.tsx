import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../../theme';

interface DotMarkerProps {
  color: string;
  isEvent?: boolean;
}

/**
 * Simple dot marker for medium zoom levels (10-13)
 * Shows a circular dot with optional event styling
 */
export function DotMarker({color, isEvent = false}: DotMarkerProps) {
  const theme = useTheme<Theme>();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: color},
        isEvent && styles.eventBorder,
        isEvent && {borderColor: theme.colors.surfaceBackground},
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  eventBorder: {
    borderWidth: 2,
  },
});
