import React, {createContext, useContext, useState, useCallback, useEffect, useRef} from 'react';
import {Modal} from 'react-native';
import axios from 'axios';
import {MaintenanceScreen} from '../components/MaintenanceScreen';
import {apiClient} from '../services/api/apiClient';

interface MaintenanceState {
  isUnderMaintenance: boolean;
}

const MaintenanceContext = createContext<MaintenanceState>({isUnderMaintenance: false});

export function useMaintenanceState() {
  return useContext(MaintenanceContext);
}

// How many consecutive failures trigger maintenance mode
const FAILURE_THRESHOLD = 3;
// Reset failure count after this many ms of no errors
const RESET_WINDOW_MS = 30000;

/**
 * Provider that detects API unreachability and shows a maintenance overlay.
 *
 * Triggers when:
 * - 3+ consecutive network errors or 503 responses within 30 seconds
 *
 * Clears when:
 * - User taps "Retry" and a health check succeeds
 */
export function MaintenanceProvider({children}: {children: React.ReactNode}) {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const failureCountRef = useRef(0);
  const lastFailureRef = useRef(0);

  // Listen to API errors via response interceptor
  useEffect(() => {
    const interceptorId = apiClient.interceptors.response.use(
      // Success — reset failure count
      response => {
        failureCountRef.current = 0;
        return response;
      },
      // Error — track consecutive failures
      error => {
        const isNetworkError = !error.response && axios.isAxiosError(error);
        const is503 = error.response?.status === 503;
        const is502 = error.response?.status === 502;

        if (isNetworkError || is503 || is502) {
          const now = Date.now();

          // Reset count if outside the window
          if (now - lastFailureRef.current > RESET_WINDOW_MS) {
            failureCountRef.current = 0;
          }

          failureCountRef.current++;
          lastFailureRef.current = now;

          if (failureCountRef.current >= FAILURE_THRESHOLD) {
            setIsUnderMaintenance(true);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.response.eject(interceptorId);
    };
  }, []);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      // Try a lightweight health check
      await apiClient.get('/cities?limit=1&depth=0');
      // Success — exit maintenance mode
      failureCountRef.current = 0;
      setIsUnderMaintenance(false);
    } catch {
      // Still failing — stay in maintenance
    } finally {
      setIsRetrying(false);
    }
  }, []);

  return (
    <MaintenanceContext.Provider value={{isUnderMaintenance}}>
      {children}
      <Modal
        visible={isUnderMaintenance}
        animationType="fade"
        statusBarTranslucent
        presentationStyle="fullScreen">
        <MaintenanceScreen onRetry={handleRetry} isRetrying={isRetrying} />
      </Modal>
    </MaintenanceContext.Provider>
  );
}
