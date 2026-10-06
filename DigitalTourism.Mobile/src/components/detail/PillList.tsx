import React from 'react';
import {StyleSheet} from 'react-native';
import {Box, Icon, Text, type IconName} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {theme} from '../../theme';

import type {TagItem} from '../../types/common';

export interface PillItem extends Omit<TagItem, 'id'> {
  id: string | number;
}

interface PillListProps {
  items: PillItem[];
  defaultIcon?: IconName;
  iconColor?: string;
}

export const PillList = React.memo(function PillList({
  items,
  defaultIcon = 'check',
  iconColor = palette.green700,
}: PillListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Box flexDirection="row" flexWrap="wrap" gap="s">
      {items.map(item => (
        <Box
          key={item.id}
          flexDirection="row"
          alignItems="center"
          style={styles.pill}
          gap="xs">
          <Icon
            source={(item.icon as IconName) || defaultIcon}
            size={moderateScale(16)}
            color={iconColor}
          />
          <Text style={styles.text}>{item.name}</Text>
        </Box>
      ))}
    </Box>
  );
});

const styles = StyleSheet.create({
  pill: {
    backgroundColor: palette.gray50,
    borderRadius: theme.borderRadii.full,
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(12),
  },
  text: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    fontFamily: fonts.regular,
    color: palette.heading,
  },
});
