import {useState, useCallback} from 'react';
import {createMMKV} from 'react-native-mmkv';

const onboardingStorage = createMMKV({id: 'onboarding-storage'});
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompleted] = useState(
    () => onboardingStorage.getBoolean(ONBOARDING_COMPLETED_KEY) === true,
  );

  const completeOnboarding = useCallback(() => {
    onboardingStorage.set(ONBOARDING_COMPLETED_KEY, true);
    setHasCompleted(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    onboardingStorage.remove(ONBOARDING_COMPLETED_KEY);
    setHasCompleted(false);
  }, []);

  return {hasCompletedOnboarding, completeOnboarding, resetOnboarding};
}

/**
 * Synchronous check for use outside React components (e.g. AppThemeProvider onReady)
 */
export function isOnboardingCompleted(): boolean {
  return onboardingStorage.getBoolean(ONBOARDING_COMPLETED_KEY) === true;
}
