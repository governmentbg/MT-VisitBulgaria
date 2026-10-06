import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '../theme';
import {moderateScale} from '../theme/scaling';
import {Box} from './Box';
import {Text} from './Text';
import {Icon, IconName} from './Icon';

interface ConfirmDialogAction {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger' | 'cancel';
}

interface ConfirmDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  icon?: IconName;
  iconColor?: string;
  actions: ConfirmDialogAction[];
}

export function ConfirmDialog({
  visible,
  onDismiss,
  title,
  message,
  icon,
  iconColor,
  actions,
}: ConfirmDialogProps) {
  const {theme} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 18,
          stiffness: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const dynamicStyles = useMemo(() => ({
    iconBackground: {
      backgroundColor: iconColor
        ? `${iconColor}18`
        : theme.colors.dangerLight,
    },
    buttonRadius: {borderRadius: theme.borderRadii.full},
    cancelBorder: {borderColor: theme.colors.border},
    buttonSpacing: {marginLeft: theme.spacing.s},
  }), [iconColor, theme.colors.dangerLight, theme.borderRadii.full, theme.colors.border, theme.spacing.s]);

  const getActionColor = (variant: ConfirmDialogAction['variant']) => {
    switch (variant) {
      case 'danger':
        return theme.colors.dangerDark;
      case 'cancel':
        return theme.colors.textSecondary;
      default:
        return theme.colors.mainBackground;
    }
  };

  const getActionBg = (variant: ConfirmDialogAction['variant']) => {
    switch (variant) {
      case 'danger':
        return theme.colors.dangerLight;
      case 'cancel':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <Animated.View style={[styles.backdrop, {backgroundColor: theme.colors.overlay, opacity: fadeAnim}]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dialog,
                {
                  backgroundColor: theme.colors.mainBackground,
                  opacity: fadeAnim,
                  transform: [{scale: scaleAnim}],
                },
              ]}>
              <Box alignItems="center" padding="l">
                {icon && (
                  <Box
                    marginBottom="m"
                    width={56}
                    height={56}
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    style={dynamicStyles.iconBackground}>
                    <Icon
                      source={icon}
                      size={28}
                      color={iconColor || theme.colors.dangerDark}
                    />
                  </Box>
                )}
                <Text variant="subtitle" textAlign="center">
                  {title}
                </Text>
                <Text
                  variant="body"
                  color="textSecondary"
                  textAlign="center"
                  marginTop="s">
                  {message}
                </Text>
              </Box>
              <Box
                flexDirection="row"
                paddingHorizontal="l"
                paddingBottom="l">
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={action.onPress}
                    activeOpacity={0.7}
                    style={[
                      styles.button,
                      {backgroundColor: getActionBg(action.variant)},
                      dynamicStyles.buttonRadius,
                      action.variant === 'cancel' && [styles.cancelBorder, dynamicStyles.cancelBorder],
                      index > 0 && dynamicStyles.buttonSpacing,
                    ]}>
                    <Text
                      variant="button"
                      textAlign="center"
                      style={{color: getActionColor(action.variant)}}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Box>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const DIALOG_PADDING = moderateScale(32);
const DIALOG_BORDER_RADIUS = moderateScale(24);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    // backgroundColor applied inline via theme.colors.overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIALOG_PADDING,
  },
  dialog: {
    width: '100%',
    borderRadius: DIALOG_BORDER_RADIUS,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBorder: {
    borderWidth: 1,
  },
});
