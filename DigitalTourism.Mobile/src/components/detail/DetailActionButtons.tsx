import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Icon, Text, type IconName} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

type ActionVariant = 'primary' | 'secondary' | 'neutral';

export interface ActionButton {
  icon: IconName;
  label: string;
  onPress: () => void;
}

interface DetailActionButtonsProps {
  actions: ActionButton[];
}

const NEUTRAL_FG = '#101828';

function getVariant(icon: IconName): ActionVariant {
  if (icon === 'calendar-check') return 'primary';
  if (icon === 'book-open-variant') return 'secondary';
  return 'neutral';
}

function getVariantColors(
  variant: ActionVariant,
): {bg: string; iconColor: string; labelColor: string} {
  switch (variant) {
    case 'primary':
      return {
        bg: palette.green700,
        iconColor: palette.white,
        labelColor: palette.white,
      };
    case 'secondary':
      return {
        bg: palette.green50,
        iconColor: palette.green700,
        labelColor: palette.green700,
      };
    case 'neutral':
    default:
      return {
        bg: palette.gray50,
        iconColor: palette.green700,
        labelColor: NEUTRAL_FG,
      };
  }
}

export const DetailActionButtons = React.memo(function DetailActionButtons({
  actions,
}: DetailActionButtonsProps) {
  return (
    <Box flexDirection="row" gap="s">
      {actions.map((action) => {
        const variant = getVariant(action.icon);
        const {bg, iconColor, labelColor} = getVariantColors(variant);
        return (
          <TouchableOpacity
            key={action.icon}
            style={[styles.button, {backgroundColor: bg}]}
            onPress={action.onPress}
            activeOpacity={0.7}
            testID={`detail-action-${action.icon}`}
            accessibilityLabel={action.label}
            accessibilityRole="button">
            <Icon
              source={action.icon}
              size={moderateScale(24)}
              color={iconColor}
            />
            <Text style={[styles.label, {color: labelColor}]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: moderateScale(71),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  label: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14),
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
});
