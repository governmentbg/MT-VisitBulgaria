import React, {useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Config from 'react-native-config';
import {Box, Modal, Text, Icon, Image, ResizeMode} from '../../design';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {SHARE_TARGETS, type ShareTargetKey} from '../../utils/shareSocials';

interface EntityPreview {
  imageUrl?: string;
  name: string;
  cityName?: string;
}

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  entity: EntityPreview | null;
  onAction: (target: ShareTargetKey) => void;
}

/**
 * Custom share sheet with branded per-app buttons.
 *
 * Renders a grid of circular icon buttons for each target in SHARE_TARGETS.
 * The entity preview at the top shows the content being shared, similar to
 * what Airbnb and Pinterest show in their custom share UIs.
 *
 * Targets that require FB_APP_ID (Instagram Stories, Facebook Stories) are
 * filtered out when the env var isn't configured, rather than failing at
 * tap time.
 */
export function ShareSheet({visible, onClose, entity, onAction}: ShareSheetProps) {
  const {t} = useTranslation('common');

  const targets = useMemo(() => {
    const hasFbAppId = !!Config.FB_APP_ID;
    return SHARE_TARGETS.filter(tgt => !tgt.requiresFbAppId || hasFbAppId);
  }, []);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={t('share.title')}
      maxHeight="75%">
      {entity && (
        <Box
          flexDirection="row"
          alignItems="center"
          padding="m"
          marginHorizontal="m"
          marginTop="s"
          backgroundColor="surfaceBackground"
          borderRadius="m">
          {entity.imageUrl ? (
            <Image
              source={{uri: entity.imageUrl}}
              style={styles.previewImage}
              resizeMode={ResizeMode.cover}
            />
          ) : (
            <View style={[styles.previewImage, styles.previewPlaceholder]} />
          )}
          <Box flex={1} marginLeft="m">
            <Text variant="bodyMedium" numberOfLines={2}>
              {entity.name}
            </Text>
            {entity.cityName ? (
              <Text variant="caption" color="textSecondary" marginTop="xs">
                {entity.cityName}
              </Text>
            ) : null}
          </Box>
        </Box>
      )}

      <Box
        flexDirection="row"
        flexWrap="wrap"
        paddingHorizontal="m"
        paddingTop="m"
        paddingBottom="l">
        {targets.map(target => (
          <TouchableOpacity
            key={target.key}
            style={styles.targetButton}
            onPress={() => onAction(target.key)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t(`share.${target.labelKey}`)}
            testID={`share-target-${target.key}`}>
            <View
              style={[
                styles.iconCircle,
                {backgroundColor: target.bg},
              ]}>
              <Icon
                source={target.icon}
                size={moderateScale(26)}
                color={target.iconColor}
              />
            </View>
            <Text
              variant="caption"
              marginTop="xs"
              style={styles.targetLabel}
              numberOfLines={1}>
              {t(`share.${target.labelKey}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </Box>
    </Modal>
  );
}

const ICON_SIZE = moderateScale(56);

const styles = StyleSheet.create({
  previewImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(8),
  },
  previewPlaceholder: {
    backgroundColor: palette.green500,
  },
  targetButton: {
    width: '20%',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetLabel: {
    fontSize: moderateScale(11),
    textAlign: 'center',
  },
});
