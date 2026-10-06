import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Box, Icon, type IconName, Modal, Text} from '../../../design';
import {fonts} from '../../../theme/fonts';
import {palette} from '../../../theme/palette';
import {moderateScale} from '../../../theme/scaling';

interface RouteCardMenuProps {
  visible: boolean;
  onDismiss: () => void;
  routeName: string;
  onEdit: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function RouteCardMenu({
  visible,
  onDismiss,
  routeName,
  onEdit,
  onDownload,
  onDelete,
}: RouteCardMenuProps) {
  const {t} = useTranslation('routes');

  const handle = (action: () => void) => () => {
    onDismiss();
    action();
  };

  return (
    <Modal visible={visible} onClose={onDismiss}>
      <Box
        paddingHorizontal="m"
        paddingTop="m"
        paddingBottom="s"
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderBottomColor="gray100">
        <Text style={styles.title} numberOfLines={2}>
          {routeName}
        </Text>
      </Box>
      <Box paddingHorizontal="m" paddingTop="s" paddingBottom="l">
        <ActionRow
          icon="pencil-outline"
          label={t('edit')}
          onPress={handle(onEdit)}
        />
        <ActionRow
          icon="download-outline"
          label={t('download')}
          onPress={handle(onDownload)}
        />
        <ActionRow
          icon="trash-can-outline"
          label={t('delete')}
          onPress={handle(onDelete)}
          destructive
        />
      </Box>
    </Modal>
  );
}

interface ActionRowProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function ActionRow({icon, label, onPress, destructive}: ActionRowProps) {
  const color = destructive ? palette.dangerDark : palette.heading;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.row}>
      <Icon source={icon} size={moderateScale(22)} color={color} />
      <Text style={[styles.label, {color}]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.3),
    color: palette.heading,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(14),
    gap: moderateScale(16),
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.3),
  },
});
