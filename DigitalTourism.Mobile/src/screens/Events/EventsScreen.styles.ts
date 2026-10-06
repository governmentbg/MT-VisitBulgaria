import {StyleSheet} from 'react-native';
import {moderateScale} from '../../theme/scaling';
import {fonts} from '../../theme/fonts';
import {palette} from '../../theme/palette';
import {theme} from '../../theme';

// Pre-computed heights for animation (all on JS thread, safe for worklets)
export const TITLE_SECTION_HEIGHT =
  moderateScale(16) + // paddingTop
  moderateScale(32 * 1.2) + // title lineHeight
  moderateScale(8) + // subtitle marginTop
  moderateScale(16 * 1.5); // subtitle lineHeight

export const SEARCH_ROW_HEIGHT =
  moderateScale(8) + // marginTop
  moderateScale(48) + // search bar height
  moderateScale(8); // marginBottom

export const CHIPS_SECTION_HEIGHT =
  moderateScale(34); // chip height (paddingVertical s=8*2 + fontSize 16 + border 2)

export const HEADER_PADDING_BOTTOM_EXPANDED = moderateScale(8);
export const HEADER_PADDING_BOTTOM_COLLAPSED = moderateScale(16);

export const FULL_HEADER_HEIGHT =
  TITLE_SECTION_HEIGHT + SEARCH_ROW_HEIGHT + CHIPS_SECTION_HEIGHT + HEADER_PADDING_BOTTOM_EXPANDED;

export const COLLAPSED_HEADER_HEIGHT = SEARCH_ROW_HEIGHT + HEADER_PADDING_BOTTOM_COLLAPSED;

export const COLLAPSE_AMOUNT = FULL_HEADER_HEIGHT - COLLAPSED_HEADER_HEIGHT;
export const COLLAPSE_THRESHOLD = COLLAPSE_AMOUNT; // 1:1 scroll-to-collapse ratio

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray50,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: palette.white,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
    overflow: 'hidden',
    zIndex: 10,
  },
  titleSection: {
    paddingTop: moderateScale(16),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleTextBlock: {
    flex: 1,
    paddingRight: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(32 * 1.2),
    fontFamily: fonts.bold,
    color: palette.black,
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.5),
    fontFamily: fonts.regular,
    color: palette.gray600,
    marginTop: moderateScale(8),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(8),
    marginTop: moderateScale(8),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.white,
    borderRadius: theme.borderRadii.full,
    height: moderateScale(48),
    paddingHorizontal: moderateScale(16),
    marginRight: moderateScale(12),
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
    color: palette.black,
    marginLeft: moderateScale(12),
    paddingVertical: 0,
  },
  filterButtonTouch: {
    width: moderateScale(44),
    height: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: 48,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: 0,
    backgroundColor: palette.green700,
    borderRadius: 100,
    width: moderateScale(20),
    height: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: moderateScale(12),
    fontFamily: fonts.bold,
    color: palette.white,
    lineHeight: moderateScale(12),
  },
  chipsContainer: {
    marginHorizontal: -moderateScale(16),
  },
});
