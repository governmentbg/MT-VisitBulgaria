import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Box} from '../../design/Box';
import {Text} from '../../design/Text';
import {Icon, IconName} from '../../design/Icon';

interface ProfileMenuItemProps {
  icon: IconName;
  label: string;
  onPress: () => void;
}

export function ProfileMenuItem({icon, label, onPress}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box
        height={64}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m">
        <Icon source={icon} size="m" color="textPrimary" />
        <Text variant="body" marginLeft="m" flex={1}>
          {label}
        </Text>
        <Icon source="chevron-right" size="m" color="textTertiary" />
      </Box>
    </TouchableOpacity>
  );
}
