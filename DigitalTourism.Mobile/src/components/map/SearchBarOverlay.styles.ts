import {StyleSheet} from 'react-native';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {fonts} from '../../theme/fonts';

export const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    maxWidth: 361,
  },
  container: {
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    color: palette.black,
    padding: 0,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: moderateScale(4),
    backgroundColor: palette.white,
    borderRadius: 12,
    shadowColor: palette.gray900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    maxHeight: moderateScale(250),
    overflow: 'hidden',
  },
  suggestionsList: {
    borderRadius: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),
    gap: moderateScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.gray50,
  },
  suggestionThumb: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  suggestionThumbImg: {
    width: '100%',
    height: '100%',
  },
  suggestionThumbPlaceholder: {
    backgroundColor: palette.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionThumbEmoji: {
    fontSize: moderateScale(18),
  },
  suggestionTitle: {
    fontSize: moderateScale(14),
    color: palette.heading,
  },
  suggestionTypeBadge: {
    fontSize: moderateScale(11),
    fontFamily: fonts.medium,
    color: palette.green700,
  },
  suggestionCity: {
    fontSize: moderateScale(11),
    color: palette.gray600,
    flexShrink: 1,
  },
  suggestionDistance: {
    fontSize: moderateScale(11),
    fontFamily: fonts.bold,
    color: palette.green700,
    marginLeft: moderateScale(8),
  },
});
