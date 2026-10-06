import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from '../../theme/scaling';

export const MINI_PLAYER_HEIGHT = verticalScale(110);
export const PADDING = moderateScale(16);
export const TAB_BAR_HEIGHT = verticalScale(70);

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: MINI_PLAYER_HEIGHT,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: moderateScale(4)},
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: moderateScale(3),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    overflow: 'hidden',
    zIndex: 2,
  },
  progressBar: {
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  tappableArea: {
    paddingTop: moderateScale(8),
    height: verticalScale(100),
    position: 'relative',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(12),
    gap: moderateScale(6),
    height: verticalScale(100),
    position: 'relative',
  },
  attractionNameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  attractionName: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(8),
  },
  controlsRow: {
    justifyContent: 'center',
  },
  playButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    fontSize: moderateScale(11),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});
