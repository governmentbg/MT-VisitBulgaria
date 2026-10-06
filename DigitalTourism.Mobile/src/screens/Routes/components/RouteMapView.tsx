import React, {useRef, useMemo, useEffect, useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Box, Text} from '../../../design';
import {useTheme} from '../../../theme';
import {useTranslation} from 'react-i18next';
import {moderateScale} from '../../../theme/scaling';
import {fonts} from '../../../theme/fonts';
import {palette} from '../../../theme/palette';
import {mapStyle} from '../../../design/mapStyles';
import {AttractionPinMarker} from '../../../components/map/AttractionPinMarker';
import type {RouteDay, RouteStop} from '../../../models/Route';
import {DEFAULT_REGION} from '../../../constants/map';
import {getDayBadgeColor} from '../utils/dayBadgeColor';

interface RouteMapViewProps {
  days: RouteDay[];
  focusLocation?: {latitude: number; longitude: number} | null;
  onMarkerPress?: (stop: RouteStop) => void;
}

interface MarkerData {
  id: string;
  name: string;
  image?: string;
  latitude: number;
  longitude: number;
  dayNumber: number;
  badgeColor: string;
  stop: RouteStop;
}


const EDGE_PADDING = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60,
};

export function RouteMapView({days, focusLocation, onMarkerPress}: RouteMapViewProps) {
  const {isDark} = useTheme();
  const {t} = useTranslation('routes');
  const mapRef = useRef<MapView>(null);
  const [imageLoadState, setImageLoadState] = useState<Record<string, boolean>>({});

  // Flatten all days' stops with coordinates; each marker carries its day
  // number + a distinct badge color derived from the day index.
  const markers = useMemo<MarkerData[]>(() => {
    const result: MarkerData[] = [];

    days.forEach((day, dayIdx) => {
      const badgeColor = getDayBadgeColor(dayIdx);
      const dayNumber = dayIdx + 1;
      for (const stop of day.stops) {
        if (stop.location?.latitude && stop.location?.longitude) {
          result.push({
            id: stop.id,
            name: stop.name,
            image: stop.image,
            latitude: stop.location.latitude,
            longitude: stop.location.longitude,
            dayNumber,
            badgeColor,
            stop,
          });
        }
      }
    });

    return result;
  }, [days]);

  // Fit map to show all markers on mount (skip if focusing on a specific stop)
  useEffect(() => {
    if (markers.length === 0 || !mapRef.current || focusLocation) {
      return;
    }

    const timer = setTimeout(() => {
      const coordinates = markers.map(m => ({
        latitude: m.latitude,
        longitude: m.longitude,
      }));

      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: EDGE_PADDING,
        animated: true,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [markers, focusLocation]);

  // Animate to focused location when pin button is tapped from the list
  useEffect(() => {
    if (!focusLocation || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: focusLocation.latitude,
        longitude: focusLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500,
    );
  }, [focusLocation]);

  // Defer flipping tracksViewChanges off by one frame + a short delay so the
  // iOS marker snapshot captures the fully-drawn bitmap, not the frame before.
  const handleImageLoad = useCallback((markerId: string) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        setImageLoadState(prev => ({...prev, [markerId]: true}));
      }, 50);
    });
  }, []);

  if (markers.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" padding="xl">
        <Text
          style={[styles.emptyText, {fontFamily: fonts.regular}]}
          color="textSecondary">
          {t('noStopsOnMap')}
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <MapView
        ref={mapRef}
        key={isDark ? 'route-map-dark' : 'route-map-light'}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        toolbarEnabled={false}
        showsUserLocation={false}
        showsMyLocationButton={false}>
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            tracksViewChanges={!imageLoadState[marker.id]}
            onPress={e => {
              e.stopPropagation();
              onMarkerPress?.(marker.stop);
            }}>
            <RouteMarkerPin
              marker={marker}
              onImageLoad={() => handleImageLoad(marker.id)}
            />
          </Marker>
        ))}
      </MapView>
    </Box>
  );
}

/** Route marker: shared teardrop pin with a sequence number badge overlay */
const RouteMarkerPin = React.memo(function RouteMarkerPin({
  marker,
  onImageLoad,
}: {
  marker: MarkerData;
  onImageLoad: () => void;
}) {
  return (
    <View style={styles.markerContainer}>
      <AttractionPinMarker
        imageUri={marker.image}
        onImageLoad={onImageLoad}
      />
      <View style={[styles.numberBadge, {backgroundColor: marker.badgeColor}]}>
        <Text style={[styles.numberText, {fontFamily: fonts.bold}]}>
          {marker.dayNumber}
        </Text>
      </View>
    </View>
  );
});

const BADGE_SIZE = moderateScale(20);

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.99, // Prevent map flickering on Android
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  numberBadge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: palette.white,
  },
  numberText: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(13),
    color: palette.white,
  },
  emptyText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    textAlign: 'center',
  },
});
