import React, {useState} from 'react';
import {LayoutAnimation, StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Icon, type IconName, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {theme} from '../../theme';

interface ExpandableSectionProps {
  icon: IconName;
  label: string;
  /** Override label colour when in a specific state (e.g. "open") */
  labelStyle?: object;
  /** Hide the chevron when there is nothing to expand */
  showChevron?: boolean;
  children: React.ReactNode;
}

export const ExpandableSection = React.memo(function ExpandableSection({
  icon,
  label,
  labelStyle,
  showChevron = true,
  children,
}: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  return (
    <Box>
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}>
        <Icon
          source={icon}
          size={moderateScale(18)}
          color="textSecondary"
        />
        <Text style={[styles.labelText, labelStyle]}>{label}</Text>
        {showChevron && (
          <Icon
            source={expanded ? 'chevron-up' : 'chevron-down'}
            size={moderateScale(18)}
            color="textSecondary"
          />
        )}
      </TouchableOpacity>

      {expanded && children}
    </Box>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.gray50,
    borderRadius: theme.borderRadii.full,
    minHeight: moderateScale(44),
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    gap: moderateScale(6),
  },
  labelText: {
    flex: 1,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontFamily: fonts.medium,
    color: palette.gray600,
  },
});
