import React, {useState, useCallback, useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import {Marker} from 'react-native-maps';
import {Preload} from '../../design/Image';
import type {ZoomLevel} from '../../utils/mapHelpers';
import {AttractionPinMarker} from './AttractionPinMarker';

/** Minimal shape needed by MapMarker — accepts any map item with location and images */
interface MapMarkerItem {
  id: string;
  name: string;
  location: {latitude: number; longitude: number};
  images: string[];
}

interface MapMarkerProps {
  item: MapMarkerItem;
  zoomLevel: ZoomLevel;
  onPress: (item: MapMarkerItem) => void;
}

/**
 * Marker image loading is handled per-platform:
 *
 * Android: prefetch image, then bump a key to force a fresh Marker bitmap.
 *          tracksViewChanges stays false → zero flicker.
 *
 * iOS: react-native-maps snapshots the custom view on mount, so the image
 *      must already be drawn before the snapshot. We keep tracksViewChanges
 *      true until the inner Image fires onLoad, then flip it off.
 */
const isIOS = Platform.OS === 'ios';

function MapMarkerComponent({item, zoomLevel, onPress}: MapMarkerProps) {
  const firstImage = item.images[0];
  const [revision, setRevision] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(!firstImage);
  const prefetchedRef = useRef(false);

  const handlePress = useCallback(() => onPress(item), [onPress, item]);
  // Defer flipping tracksViewChanges off by one frame + a short delay so the
  // iOS marker snapshot captures the fully-drawn bitmap, not the frame before.
  const handleImageLoad = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => setImageLoaded(true), 50);
    });
  }, []);

  useEffect(() => {
    if (isIOS || !firstImage || prefetchedRef.current) return;
    Preload([{uri: firstImage}]);
    const timer = setTimeout(() => {
      prefetchedRef.current = true;
      setRevision(r => r + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [firstImage]);

  // Fallback: stop tracking on iOS even if onLoad never fires (broken URL, etc.)
  useEffect(() => {
    if (!isIOS || imageLoaded) return;
    const timer = setTimeout(() => setImageLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, [imageLoaded]);

  if (zoomLevel === 'country') {
    return null;
  }

  return (
    <Marker
      key={isIOS ? item.id : `${item.id}_${revision}`}
      coordinate={item.location}
      onPress={handlePress}
      stopPropagation={true}
      tracksViewChanges={isIOS ? !imageLoaded : false}>
      <AttractionPinMarker
        imageUri={firstImage}
        onImageLoad={handleImageLoad}
      />
    </Marker>
  );
}

export const MapMarker = React.memo(MapMarkerComponent);
