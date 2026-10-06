import React, {
  useRef,
  useImperativeHandle,
  useCallback,
  forwardRef,
} from 'react';
import {StyleSheet, View} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {ShareCard} from './ShareCard';

export interface ShareCardCaptureHandle {
  capture: () => Promise<string>;
}

interface ShareCardCaptureProps {
  imageUrl?: string;
  name: string;
  cityName?: string;
}

const IMAGE_LOAD_TIMEOUT = 5000;

/**
 * Renders the ShareCard off-screen and exposes an imperative `capture()`
 * method that waits for the entity image to load before taking the snapshot.
 *
 * Mounted once per detail screen (inside `createDetailScreen`). The underlying
 * React view is kept alive in the render tree so the capture is instant when
 * the user opens the share sheet.
 */
export const ShareCardCapture = forwardRef<
  ShareCardCaptureHandle,
  ShareCardCaptureProps
>(({imageUrl, name, cityName}, ref) => {
  const viewShotRef = useRef<ViewShot>(null);
  const imageLoadedRef = useRef(false);
  const imageLoadResolveRef = useRef<(() => void) | null>(null);

  const handleImageLoaded = useCallback(() => {
    imageLoadedRef.current = true;
    imageLoadResolveRef.current?.();
    imageLoadResolveRef.current = null;
  }, []);

  const waitForImage = useCallback((): Promise<void> => {
    if (imageLoadedRef.current || !imageUrl) {
      return Promise.resolve();
    }
    return new Promise<void>(resolve => {
      imageLoadResolveRef.current = resolve;
      setTimeout(() => {
        resolve();
        imageLoadResolveRef.current = null;
      }, IMAGE_LOAD_TIMEOUT);
    });
  }, [imageUrl]);

  useImperativeHandle(
    ref,
    () => ({
      capture: async () => {
        await waitForImage();
        const uri = await viewShotRef.current!.capture!();
        return uri;
      },
    }),
    [waitForImage],
  );

  return (
    <View style={styles.offscreen} pointerEvents="none">
      <ViewShot
        ref={viewShotRef}
        options={{format: 'png', quality: 0.9, result: 'tmpfile'}}>
        <ShareCard
          imageUrl={imageUrl}
          name={name}
          cityName={cityName}
          onImageLoaded={handleImageLoaded}
        />
      </ViewShot>
    </View>
  );
});

ShareCardCapture.displayName = 'ShareCardCapture';

const styles = StyleSheet.create({
  offscreen: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 0,
  },
});
