import {useCallback, useMemo, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import RNFS from 'react-native-fs';
import type {ShareCardCaptureHandle} from '../components/share/ShareCardCapture';
import type {BaseEntity} from '../models/BaseEntity';
import {buildShareUrl} from '../utils/shareUrl';
import {showToast} from '../utils/toast';
import {useAlert} from '../contexts/AlertContext';
import {
  shareHandlers,
  isAppNotInstalledError,
  isUserCancelError,
  type ShareContext,
} from '../services/share/shareHandlers';
import type {ShareTargetKey} from '../utils/shareSocials';

/**
 * Orchestrates the custom share sheet lifecycle:
 * - opens/closes the bottom sheet
 * - lazily captures the branded share card only when a handler needs it
 * - routes target selection to the correct handler
 * - surfaces toast feedback on copy / app not installed
 */
export function useShareSheet() {
  const [visible, setVisible] = useState(false);
  const [entity, setEntity] = useState<BaseEntity | null>(null);
  const [entityType, setEntityType] = useState<string>('');
  const shareCardRef = useRef<ShareCardCaptureHandle>(null);
  const capturedImageRef = useRef<string | undefined>(undefined);
  const {t, i18n} = useTranslation('common');
  const {alert} = useAlert();

  const open = useCallback((e: BaseEntity, type: string) => {
    setEntity(e);
    setEntityType(type);
    capturedImageRef.current = undefined;
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const notifyCopied = useCallback(() => {
    const message = t('share.linkCopied');
    if (Platform.OS === 'android') {
      showToast(message);
    } else {
      alert(message, '', {
        icon: 'check-circle',
        iconColor: '#22C55E',
        actions: [{label: t('ok', {defaultValue: 'OK'})}],
      });
    }
  }, [alert, t]);

  const notifyError = useCallback(
    (messageKey: string) => {
      alert(
        t(messageKey, {defaultValue: t('errors.error')}),
        '',
        {
          icon: 'alert-circle-outline',
          iconColor: '#EF4444',
          actions: [{label: t('ok', {defaultValue: 'OK'})}],
        },
      );
    },
    [alert, t],
  );

  const buildContext = useCallback(
    (e: BaseEntity, type: string): ShareContext => {
      const city = e.cityName ? ` — ${e.cityName}` : '';
      const url = buildShareUrl(type, e.slug);
      const appName = t('appName');
      const message = t('shareMessage', {
        name: e.name,
        city,
        url,
        appName,
      });
      // Twitter has a 280 char limit, keep it punchy: name + url only.
      const shortMessage = `${e.name} ${url}`;

      return {
        entity: {
          id: e.id,
          slug: e.slug,
          name: e.name,
          cityName: e.cityName,
          images: e.images,
        },
        entityType: type,
        url,
        message,
        shortMessage,
        getCardImage: async () => {
          if (capturedImageRef.current) {
            return capturedImageRef.current;
          }
          try {
            const uri = await shareCardRef.current?.capture();
            capturedImageRef.current = uri;
            return uri;
          } catch {
            return undefined;
          }
        },
        onCopied: notifyCopied,
        onError: notifyError,
      };
    },
    [t, notifyCopied, notifyError],
  );

  const handleAction = useCallback(
    async (target: ShareTargetKey) => {
      if (!entity) return;
      const ctx = buildContext(entity, entityType);
      setVisible(false);
      try {
        await shareHandlers[target](ctx);
      } catch (err) {
        if (isUserCancelError(err)) {
          return;
        }
        if (isAppNotInstalledError(err)) {
          notifyError('share.errors.appNotInstalled');
          return;
        }
        // Unknown error — log in dev, silent in prod.
        if (__DEV__) {
          console.warn('[ShareSheet] handler failed:', target, err);
        }
        notifyError('share.errors.generic');
      } finally {
        // Clean up any temp card image after the share attempt finishes.
        if (capturedImageRef.current) {
          const uri = capturedImageRef.current;
          capturedImageRef.current = undefined;
          RNFS.unlink(uri.replace(/^file:\/\//, '')).catch(() => {});
        }
      }
    },
    [entity, entityType, buildContext, notifyError],
  );

  const capturedEntitySummary = useMemo(
    () =>
      entity
        ? {
            imageUrl: entity.images?.[0],
            name: entity.name,
            cityName: entity.cityName,
          }
        : null,
    [entity],
  );

  // `i18n` is referenced so the hook re-runs when the language changes,
  // keeping translated share messages in sync with current locale.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _lang = i18n.language;

  return {
    visible,
    open,
    close,
    handleAction,
    shareCardRef,
    entity,
    entityType,
    capturedEntitySummary,
  };
}
