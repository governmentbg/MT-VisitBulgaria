import { useState, useRef, useCallback, useEffect } from 'react';
import type { Region } from 'react-native-maps';

interface UseThrottledRegionOptions {
  /**
   * Minimum zoom level to track (default: 5)
   */
  minZoom?: number;

  /**
   * Maximum zoom level to track (default: 18)
   */
  maxZoom?: number;

  /**
   * Debounce delay in milliseconds (default: 500ms)
   * Updates only fire after user pauses for this duration
   */
  debounceMs?: number;
}

/**
 * Converts latitude delta to Web Mercator tile zoom level
 */
function getZoomLevelFromDelta(latitudeDelta: number): number {
  return Math.round(Math.log2(360 / latitudeDelta));
}

/**
 * Hook for debounced zoom-based region updates during map interaction.
 *
 * This provides efficient map interaction by:
 * - Debouncing updates: Only fires after user pauses for 500ms (configurable)
 * - NO updates during continuous gestures (zero overhead)
 * - Final update when user stops (ensures accuracy)
 *
 * Uses the same tile zoom levels as the spatial index (Web Mercator).
 *
 * Performance: Debouncing is more efficient than throttling because it waits
 * for the user to pause before doing expensive spatial index queries.
 *
 * @example
 * const { region, tileZoom, handleRegionChange, handleRegionChangeComplete } = useThrottledRegion();
 *
 * <MapView
 *   onRegionChange={handleRegionChange}
 *   onRegionChangeComplete={handleRegionChangeComplete}
 * />
 */
export function useThrottledRegion(options: UseThrottledRegionOptions = {}) {
  const {
    minZoom = 5,
    maxZoom = 18,
    debounceMs = 500,
  } = options;

  const [region, setRegion] = useState<Region | null>(null);
  const [tileZoom, setTileZoom] = useState<number>(10);

  const lastZoomRef = useRef<number>(10);
  const pendingRegionRef = useRef<Region | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateRegion = useCallback((newRegion: Region) => {
    const newZoom = getZoomLevelFromDelta(newRegion.latitudeDelta);
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

    setRegion(newRegion);
    setTileZoom(clampedZoom);
    lastZoomRef.current = clampedZoom;
  }, [minZoom, maxZoom]);

  const handleRegionChange = useCallback((newRegion: Region) => {
    const newZoom = getZoomLevelFromDelta(newRegion.latitudeDelta);
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    const zoomChanged = clampedZoom !== lastZoomRef.current;

    // Store latest region for final update on regionChangeComplete
    pendingRegionRef.current = newRegion;

    // Only debounce if tile zoom level changed
    if (zoomChanged) {
      // Clear any pending debounced update
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Schedule debounced update
      debounceTimerRef.current = setTimeout(() => {
        updateRegion(newRegion);
        pendingRegionRef.current = null;
        debounceTimerRef.current = null;
      }, debounceMs);
    }
  }, [updateRegion, minZoom, maxZoom, debounceMs]);

  const handleRegionChangeComplete = useCallback((finalRegion: Region) => {
    // Clear any pending debounced update
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Final update when user stops interacting
    updateRegion(finalRegion);
  }, [updateRegion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    region,
    tileZoom,
    handleRegionChange,
    handleRegionChangeComplete,
  };
}
