import React, {useCallback} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {
  BottomSheetBackdrop,
  useBottomSheet,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

type PressBehavior = 'close' | 'none';

interface BackdropProps extends BottomSheetBackdropProps {
  pressBehavior: PressBehavior;
  opacity: number;
}

/**
 * Gorhom's built-in backdrop attaches a Gesture.Tap() via GestureDetector to an
 * absoluteFill view. That gesture can fire for taps that land on the sheet's
 * own background (empty areas with no child handler), dismissing the sheet
 * unexpectedly. We keep gorhom's backdrop for its opacity animation but
 * disable its tap handler and overlay a plain RN Pressable, which uses the
 * responder system and therefore only receives touches outside the sheet.
 */
function Backdrop({pressBehavior, opacity, ...props}: BackdropProps) {
  const {close} = useBottomSheet();
  const handlePress = useCallback(() => {
    if (pressBehavior === 'close') {
      close();
    }
  }, [close, pressBehavior]);

  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={opacity}
      pressBehavior="none">
      {pressBehavior === 'close' ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
      ) : null}
    </BottomSheetBackdrop>
  );
}

/**
 * Shared backdrop configuration for bottom sheets. Tapping the visible
 * backdrop area closes the sheet; taps on the sheet itself never propagate.
 */
export function useBottomSheetBackdrop(
  pressBehavior: PressBehavior = 'close',
  opacity: number = 0.7,
) {
  return useCallback(
    (props: BottomSheetBackdropProps) => (
      <Backdrop {...props} pressBehavior={pressBehavior} opacity={opacity} />
    ),
    [pressBehavior, opacity],
  );
}
