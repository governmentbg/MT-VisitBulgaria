import React, {createContext, useCallback, useContext, useRef, useState, type ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {ConfirmDialog} from '../design/ConfirmDialog';
import type {IconName} from '../design/Icon';

interface AlertAction {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'danger' | 'cancel';
}

interface AlertOptions {
  icon?: IconName;
  iconColor?: string;
  actions?: AlertAction[];
}

interface AlertContextValue {
  alert: (title: string, message: string, options?: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function useAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}

interface DialogState {
  visible: boolean;
  title: string;
  message: string;
  icon?: IconName;
  iconColor?: string;
  actions: AlertAction[];
}

const INITIAL_STATE: DialogState = {
  visible: false,
  title: '',
  message: '',
  actions: [],
};

export function AlertProvider({children}: {children: ReactNode}) {
  const {t} = useTranslation('common');
  const [state, setState] = useState<DialogState>(INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  const dismiss = useCallback(() => {
    setState(prev => ({...prev, visible: false}));
  }, []);

  const alert = useCallback(
    (title: string, message: string, options?: AlertOptions) => {
      setState({
        visible: true,
        title,
        message,
        icon: options?.icon,
        iconColor: options?.iconColor,
        actions: options?.actions ?? [{label: t('ok'), variant: 'default'}],
      });
    },
    [t],
  );

  const handleAction = useCallback(
    (action: AlertAction) => {
      dismiss();
      action.onPress?.();
    },
    [dismiss],
  );

  return (
    <AlertContext.Provider value={{alert}}>
      {children}
      <ConfirmDialog
        visible={state.visible}
        onDismiss={dismiss}
        title={state.title}
        message={state.message}
        icon={state.icon}
        iconColor={state.iconColor}
        actions={state.actions.map(a => ({
          label: a.label,
          onPress: () => handleAction(a),
          variant: a.variant,
        }))}
      />
    </AlertContext.Provider>
  );
}
