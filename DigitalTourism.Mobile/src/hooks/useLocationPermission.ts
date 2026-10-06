import {useState, useCallback, useEffect} from 'react';
import {Platform} from 'react-native';
import {createMMKV} from 'react-native-mmkv';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

const locationStorage = createMMKV({id: 'location-permission-storage'});
const HAS_PROMPTED_KEY = '@location_has_prompted_on_open';

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})!;

export function useLocationPermission() {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>(RESULTS.DENIED);

  // Eagerly check real permission status on mount to avoid flash of "denied"
  useEffect(() => {
    check(LOCATION_PERMISSION)
      .then(setPermissionStatus)
      .catch(err => {
        if (__DEV__) console.warn('[useLocationPermission] check failed:', err);
      });
  }, []);

  const [hasPromptedOnOpen, setHasPromptedOnOpen] = useState(
    () => locationStorage.getBoolean(HAS_PROMPTED_KEY) === true,
  );

  const checkPermission = useCallback(async () => {
    const status = await check(LOCATION_PERMISSION);
    setPermissionStatus(status);
    return status;
  }, []);

  const requestPermission = useCallback(async () => {
    const status = await request(LOCATION_PERMISSION);
    setPermissionStatus(status);
    return status;
  }, []);

  const markPrompted = useCallback(() => {
    locationStorage.set(HAS_PROMPTED_KEY, true);
    setHasPromptedOnOpen(true);
  }, []);

  const resetPrompted = useCallback(() => {
    locationStorage.remove(HAS_PROMPTED_KEY);
    setHasPromptedOnOpen(false);
  }, []);

  return {
    permissionStatus,
    hasPromptedOnOpen,
    checkPermission,
    requestPermission,
    markPrompted,
    resetPrompted,
  };
}
