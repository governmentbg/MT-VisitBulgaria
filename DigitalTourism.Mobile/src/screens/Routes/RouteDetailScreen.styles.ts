import {StyleSheet} from 'react-native';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {theme} from '../../theme';

export const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  title: {
    flex: 1,
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.3),
    marginLeft: moderateScale(8),
  },
  editButton: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.3),
    color: palette.green700,
  },
  editSettingsButton: {
    marginRight: moderateScale(12),
    padding: moderateScale(4),
  },
  subtitle: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.4),
  },
  progressTrack: {
    height: moderateScale(4),
    borderRadius: theme.borderRadii.full,
    backgroundColor: palette.gray100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadii.full,
    backgroundColor: palette.green500,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: moderateScale(12),
  },
  tabText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.3),
  },
  tabTextActive: {
    color: palette.green500,
  },
  tabTextInactive: {
    color: palette.gray400,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  tabUnderlineActive: {
    backgroundColor: palette.green500,
  },
  tabUnderlineInactive: {
    backgroundColor: palette.gray100,
  },
  listContent: {
    paddingBottom: moderateScale(100),
  },
  dragListContent: {
    paddingBottom: moderateScale(120),
  },
  editInstruction: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    color: palette.green500,
    textAlign: 'center',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
  },
  fab: {
    position: 'absolute',
    right: moderateScale(16),
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: palette.green700,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  centerText: {
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },
});
