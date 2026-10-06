import {Platform, ToastAndroid} from 'react-native';

/**
 * Lightweight cross-platform toast used for transient feedback
 * like "Link copied!". On iOS, falls back to a lightweight console
 * log because there's no native toast API — callers should pair this
 * with `AlertContext.alert` if a visible confirmation is required on iOS.
 *
 * For now this is used only for Android feedback. iOS feedback is handled
 * by the calling screen via `AlertContext`.
 */
export function showToast(message: string): void {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  // iOS toast handling is done via AlertContext in the caller.
}
