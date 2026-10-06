import React, {useRef, useEffect, useMemo} from 'react';
import {TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {Box, Text, Icon} from './';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../theme';
import {moderateScale} from '../theme/scaling';
import {useBottomSheetBackdrop} from '../hooks/useBottomSheetBackdrop';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export interface ModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Enable pan down to close */
  enablePanDownToClose?: boolean;
  /** Enable backdrop dismiss */
  enableBackdropDismiss?: boolean;
  /** Show handle indicator */
  showHandle?: boolean;
  /** Optional title for the modal */
  title?: string;
  /** Maximum height as percentage (e.g., '90%'). Defaults to 90% */
  maxHeight?: string;
}

/**
 * Unified Modal component using BottomSheetModal from @gorhom/bottom-sheet
 * Automatically sizes to fit content with dynamic sizing
 */
export function Modal({
  visible,
  onClose,
  children,
  enablePanDownToClose = true,
  enableBackdropDismiss = true,
  showHandle = true,
  title,
  maxHeight = '90%',
}: ModalProps) {
  const theme = useTheme<Theme>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Convert percentage string to screen height number
  const maxContentHeight = useMemo(() => {
    const percentage = parseInt(maxHeight.replace('%', ''), 10);
    return (SCREEN_HEIGHT * percentage) / 100;
  }, [maxHeight]);

  // Handle modal visibility
  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useBottomSheetBackdrop(
    enableBackdropDismiss ? 'close' : 'none',
    0.5,
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableDynamicSizing
      maxDynamicContentSize={maxContentHeight}
      enablePanDownToClose={enablePanDownToClose}
      onDismiss={onClose}
      backgroundStyle={{
        backgroundColor: theme.colors.surfaceBackground,
      }}
      handleIndicatorStyle={[
        {
          backgroundColor: theme.colors.textSecondary,
          width: moderateScale(40),
          height: moderateScale(4),
        },
        !showHandle && styles.hiddenHandle,
      ]}
      backdropComponent={renderBackdrop}>
      <BottomSheetView style={styles.bottomSheetContent}>
        {title && (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="m"
            paddingTop="s"
            paddingBottom="m"
            borderBottomWidth={1}
            borderBottomColor="gray100">
            <Text variant="title">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon source="close" size="m" color="textSecondary" />
            </TouchableOpacity>
          </Box>
        )}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    // Don't use flex: 1 with dynamic sizing - let content determine height
  },
  hiddenHandle: {
    opacity: 0,
    width: 0,
    height: 0,
  },
});