import React, {useState, useCallback, useEffect} from 'react';
import {Marker} from 'react-native-maps';
import {CityPinMarker} from './CityPinMarker';
import type {CityCluster} from '../../hooks/useCityClusters';

/**
 * City marker wrapper that manages tracksViewChanges for image loading.
 * Starts tracking until the hero image loads, then stops to save performance.
 */
export const CityMapMarker = React.memo(function CityMapMarker({
  cluster,
  onPress,
}: {
  cluster: CityCluster;
  onPress: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(!cluster.heroImageUrl);
  // Defer flipping tracksViewChanges off by one frame + a short delay so the
  // iOS marker snapshot captures the fully-drawn bitmap, not the frame before.
  const handleImageLoad = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => setImageLoaded(true), 50);
    });
  }, []);

  // Fallback timeout: stop tracking view changes after 3s even if image fails to load
  useEffect(() => {
    const t = setTimeout(() => setImageLoaded(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Marker
      coordinate={cluster.coordinates}
      tracksViewChanges={!imageLoaded}
      onPress={onPress}>
      <CityPinMarker cluster={cluster} onImageLoad={handleImageLoad} />
    </Marker>
  );
});
