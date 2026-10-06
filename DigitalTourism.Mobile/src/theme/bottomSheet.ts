import {palette} from './palette';

/** Shared bottom sheet styles used across FilterBottomSheet, NearbyBottomSheet, etc. */
export const bottomSheetStyles = {
  sheetBackground: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    backgroundColor: palette.gray300,
    width: 48,
  },
} as const;
