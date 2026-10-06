import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {Box} from '../../design/Box';
import {Text} from '../../design/Text';
import {Icon} from '../../design/Icon';
import {useTheme} from '../../theme';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

interface DeleteAccountConfirmModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  /** Text the user must type exactly to unlock the confirm button (localized). */
  requiredKeyword: string;
  title: string;
  prompt: string;
  placeholder: string;
  confirmLabel: string;
  cancelLabel: string;
}

/**
 * Gate-2 of the account deletion flow — a typed-keyword confirmation.
 *
 * Mirrors the structure of {@link ConfirmDialog} (centered RN Modal + animated
 * backdrop) but swaps the body for an explanatory line + a single input. The
 * confirm button stays disabled until the trimmed input equals
 * `requiredKeyword` exactly (case-sensitive), which is the strongest mobile
 * signal of intent short of a password reauth.
 */
export function DeleteAccountConfirmModal({
  visible,
  onDismiss,
  onConfirm,
  isDeleting,
  requiredKeyword,
  title,
  prompt,
  placeholder,
  confirmLabel,
  cancelLabel,
}: DeleteAccountConfirmModalProps) {
  const {theme} = useTheme();
  const [typed, setTyped] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      setTyped('');
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

  const isMatch = useMemo(
    () => typed.trim() === requiredKeyword,
    [typed, requiredKeyword],
  );
  const canConfirm = isMatch && !isDeleting;

  const handleDismiss = () => {
    if (isDeleting) return;
    onDismiss();
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent>
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <Animated.View
          style={[
            styles.backdrop,
            {backgroundColor: theme.colors.overlay, opacity: fadeAnim},
          ]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoider}>
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
                  <Box
                    marginBottom="m"
                    width={56}
                    height={56}
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    style={{backgroundColor: theme.colors.dangerLight}}>
                    <Icon
                      source="alert-octagon-outline"
                      size={28}
                      color={theme.colors.dangerDark}
                    />
                  </Box>
                  <Text variant="subtitle" textAlign="center">
                    {title}
                  </Text>
                  <Text
                    variant="body"
                    color="textSecondary"
                    textAlign="center"
                    marginTop="s">
                    {prompt}
                  </Text>
                  <Text
                    fontFamily={fonts.bold}
                    color="textHeading"
                    marginTop="s"
                    style={styles.keywordHint}>
                    {requiredKeyword}
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      isFocused && styles.textInputFocused,
                    ]}
                    value={typed}
                    onChangeText={setTyped}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textTertiary}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    editable={!isDeleting}
                    returnKeyType="done"
                  />
                </Box>
                <Box
                  flexDirection="row"
                  paddingHorizontal="l"
                  paddingBottom="l">
                  <TouchableOpacity
                    onPress={handleDismiss}
                    disabled={isDeleting}
                    activeOpacity={0.7}
                    style={[
                      styles.button,
                      styles.cancelButton,
                      {borderColor: theme.colors.border},
                    ]}>
                    <Text
                      variant="button"
                      textAlign="center"
                      style={{color: theme.colors.textSecondary}}>
                      {cancelLabel}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={canConfirm ? onConfirm : undefined}
                    disabled={!canConfirm}
                    activeOpacity={0.7}
                    style={[
                      styles.button,
                      styles.confirmButton,
                      {
                        backgroundColor: canConfirm
                          ? theme.colors.dangerLight
                          : palette.gray200,
                      },
                    ]}>
                    {isDeleting ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.dangerDark}
                      />
                    ) : (
                      <Text
                        variant="button"
                        textAlign="center"
                        style={{
                          color: canConfirm
                            ? theme.colors.dangerDark
                            : palette.gray600,
                        }}>
                        {confirmLabel}
                      </Text>
                    )}
                  </TouchableOpacity>
                </Box>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const DIALOG_PADDING = moderateScale(32);
const DIALOG_BORDER_RADIUS = moderateScale(24);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIALOG_PADDING,
  },
  keyboardAvoider: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  keywordHint: {
    fontSize: moderateScale(18),
    letterSpacing: moderateScale(1),
  },
  textInput: {
    marginTop: moderateScale(12),
    width: '100%',
    height: moderateScale(48),
    borderWidth: 1,
    borderColor: palette.gray100,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    fontSize: moderateScale(16),
    fontFamily: fonts.regular,
    color: palette.heading,
    backgroundColor: palette.white,
    textAlign: 'center',
  },
  textInputFocused: {
    borderColor: palette.green500,
  },
  button: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginRight: moderateScale(8),
  },
  confirmButton: {},
});
