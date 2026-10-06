import {StyleSheet} from 'react-native';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {bottomSheetStyles} from '../../theme/bottomSheet';

export const styles = StyleSheet.create({
  handleIndicator: bottomSheetStyles.handleIndicator,
  background: bottomSheetStyles.sheetBackground,
  content: {
    flex: 1,
    paddingTop: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(24 * 1.2),
    fontFamily: fonts.bold,
    color: palette.heading,
  },
  badge: {
    backgroundColor: palette.green700,
    borderRadius: 100,
    width: moderateScale(20),
    height: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.bold,
    color: palette.white,
    lineHeight: moderateScale(12),
  },
  clearButton: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: palette.green700,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(40),
  },
  section: {
    borderBottomWidth: 0.8,
    borderBottomColor: palette.gray100,
    paddingBottom: moderateScale(20),
    marginBottom: moderateScale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: moderateScale(28),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: palette.black,
  },
  sectionBadge: {
    backgroundColor: palette.green700,
    borderRadius: 100,
    minWidth: moderateScale(18),
    height: moderateScale(18),
    paddingHorizontal: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBadgeText: {
    fontSize: moderateScale(11),
    fontFamily: fonts.bold,
    color: palette.white,
    lineHeight: moderateScale(11),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: moderateScale(5),
  },
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(4),
    borderWidth: 1,
    borderColor: palette.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: palette.green500,
    borderColor: palette.green500,
  },
  checkboxLabel: {
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
    color: palette.black,
  },
  checkboxCount: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.5),
    fontFamily: fonts.regular,
    color: palette.gray600,
  },
  /** Radio variant of `checkbox` — used for single-select facets. */
  checkboxRadio: {
    borderRadius: moderateScale(12),
  },
  /** "Show N more" / "Show less" toggle inside a truncated section. */
  showMoreText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.bold,
    color: palette.green700,
    marginTop: moderateScale(4),
  },
});
