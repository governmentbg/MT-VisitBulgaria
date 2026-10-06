import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../contexts/AuthContext';
import {useFavourites} from './queries/useFavourites';
import {useAddFavourite, useRemoveFavourite} from './mutations/useToggleFavourite';
import {ConfirmDialog} from '../design/ConfirmDialog';
import type {FavouriteExperienceType, FavouriteItem} from '../models/Favourite';

interface PendingRemoval {
  favouriteId: number;
  title: string;
}

function useRemoveConfirmDialog(onConfirm: (favouriteId: number) => void) {
  const {t} = useTranslation('common');
  const [pending, setPending] = useState<PendingRemoval | null>(null);

  const request = useCallback((favouriteId: number, title: string) => {
    setPending({favouriteId, title});
  }, []);

  const dismiss = useCallback(() => setPending(null), []);

  const confirm = useCallback(() => {
    if (pending) {
      onConfirm(pending.favouriteId);
      setPending(null);
    }
  }, [pending, onConfirm]);

  const dialog = (
    <ConfirmDialog
      visible={!!pending}
      onDismiss={dismiss}
      icon="heart-off-outline"
      title={t('actions.removeFavouriteTitle')}
      message={pending?.title ?? ''}
      actions={[
        {
          label: t('actions.cancel'),
          onPress: dismiss,
          variant: 'cancel',
        },
        {
          label: t('actions.removeFavourite'),
          onPress: confirm,
          variant: 'danger',
        },
      ]}
    />
  );

  return {request, dialog};
}

/**
 * Favourite toggle for a single known entity (detail screens).
 *
 * Returns `isFavourited` flag, a stable `toggle` callback, and a
 * `confirmDialog` element that must be rendered by the caller. The toggle
 * adds directly but always asks for confirmation before removing.
 * When the user is not authenticated, `toggle` triggers login instead.
 */
export function useFavouriteToggle(
  relationTo: FavouriteExperienceType,
  id: string | number,
  title: string,
) {
  const {isAuthenticated, login} = useAuth();
  const {data: favourites} = useFavourites(isAuthenticated);
  const addFavourite = useAddFavourite();
  const removeFavourite = useRemoveFavourite();

  const favItem = favourites?.find(f => f.id === `${relationTo}_${id}`);
  const isFavourited = !!favItem;

  const removeFn = useCallback(
    (favouriteId: number) => removeFavourite.mutate(favouriteId),
    [removeFavourite],
  );
  const {request: requestRemove, dialog: confirmDialog} = useRemoveConfirmDialog(removeFn);

  const toggle = useCallback(() => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (favItem) {
      requestRemove(favItem.favouriteId, title);
    } else {
      const numericId = typeof id === 'number' ? id : parseInt(String(id), 10);
      if (isNaN(numericId)) {
        if (__DEV__) console.warn('[useFavouriteToggle] Invalid id:', id);
        return;
      }
      addFavourite.mutate({relationTo, experienceId: numericId});
    }
  }, [isAuthenticated, login, favItem, title, requestRemove, addFavourite, relationTo, id]);

  return {isFavourited, toggle, confirmDialog};
}

/**
 * Favourite toggle for lists where the entity ID/title varies per call.
 *
 * Returns `isFavourited(id)` check, a `toggle(id, title)` callback, and a
 * `confirmDialog` element the caller must render. Adds directly; removal
 * always asks for confirmation.
 */
export function useFavouriteToggleForList(
  relationTo: FavouriteExperienceType,
) {
  const {isAuthenticated, login} = useAuth();
  const {data: favourites} = useFavourites(isAuthenticated);
  const addFavourite = useAddFavourite();
  const removeFavourite = useRemoveFavourite();

  const removeFn = useCallback(
    (favouriteId: number) => removeFavourite.mutate(favouriteId),
    [removeFavourite],
  );
  const {request: requestRemove, dialog: confirmDialog} = useRemoveConfirmDialog(removeFn);

  const isFavourited = useCallback(
    (id: string | number) =>
      !!favourites?.find(f => f.id === `${relationTo}_${id}`),
    [favourites, relationTo],
  );

  const toggle = useCallback(
    (id: string | number, title: string) => {
      if (!isAuthenticated) {
        login();
        return;
      }
      const favItem = favourites?.find(f => f.id === `${relationTo}_${id}`);
      if (favItem) {
        requestRemove(favItem.favouriteId, title);
      } else {
        const numericId = typeof id === 'number' ? id : parseInt(String(id), 10);
        if (isNaN(numericId)) {
          if (__DEV__) console.warn('[useFavouriteToggle] Invalid id:', id);
          return;
        }
        addFavourite.mutate({relationTo, experienceId: numericId});
      }
    },
    [isAuthenticated, login, favourites, requestRemove, addFavourite, relationTo],
  );

  return {isFavourited, toggle, confirmDialog};
}

/**
 * Removal-only variant for the Favourites screen, where items are listed
 * from the favourites collection directly and are always in the "remove"
 * state. Returns a `requestRemove(item)` callback and a `confirmDialog`.
 */
export function useFavouriteRemoveWithConfirm() {
  const removeFavourite = useRemoveFavourite();

  const removeFn = useCallback(
    (favouriteId: number) => removeFavourite.mutate(favouriteId),
    [removeFavourite],
  );
  const {request, dialog: confirmDialog} = useRemoveConfirmDialog(removeFn);

  const requestRemove = useCallback(
    (item: FavouriteItem) => request(item.favouriteId, item.title),
    [request],
  );

  return {
    requestRemove,
    confirmDialog,
    isRemoving: removeFavourite.isPending,
    removingId: removeFavourite.variables,
  };
}
