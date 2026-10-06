import { scale as sizeMattersScale, verticalScale as sizeMattersVerticalScale, moderateScale as sizeMattersModerateScale } from 'react-native-size-matters';

const MAX_SCALE = 1.35;

export const scale = (size: number, maxScale = MAX_SCALE) => {
  const scaled = sizeMattersScale(size);
  const scaleFactor = scaled / size;
  return scaleFactor > maxScale ? size * maxScale : scaled;
};

export const verticalScale = (size: number, maxScale = MAX_SCALE) => {
  const scaled = sizeMattersVerticalScale(size);
  const scaleFactor = scaled / size;
  return scaleFactor > maxScale ? size * maxScale : scaled;
};

export const moderateScale = (size: number, factor = 0.5, maxScale = MAX_SCALE) => {
  const scaled = sizeMattersModerateScale(size, factor);
  const scaleFactor = scaled / size;
  return scaleFactor > maxScale ? size * maxScale : scaled;
};
