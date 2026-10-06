import {Share as RNCoreShare} from 'react-native';
import RNShare, {Social} from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import Config from 'react-native-config';
import type {ShareTargetKey} from '../../utils/shareSocials';

/**
 * Per-app share handlers. Each handler receives a `ShareContext` and returns
 * a Promise. Handlers intentionally do different things based on what the
 * receiving app actually supports:
 *
 * - Facebook / Messenger / LinkedIn → URL only (let OG tags do the work)
 * - WhatsApp / Viber / Telegram → branded image + message text
 * - Instagram / Facebook Stories / Snapchat → branded image only (no text)
 * - Twitter → short text + URL (280 char limit)
 * - SMS / Email → text + URL (no image)
 * - Copy link → clipboard only
 * - More options → native share sheet (fallback)
 */

export interface ShareContext {
  entity: {
    id: string;
    slug?: string;
    name: string;
    cityName?: string;
    images: string[];
  };
  entityType: string;
  url: string;
  message: string;
  shortMessage: string;
  /** Lazily captures the branded share card image and returns its file URI */
  getCardImage: () => Promise<string | undefined>;
  /** Called after copyLink succeeds — triggers a toast in the caller */
  onCopied: () => void;
  /** Called if a targeted app is not installed or fails */
  onError: (messageKey: string) => void;
}

/** Prefix a local file path with file:// for react-native-share */
const toFileUri = (path: string | undefined): string | undefined =>
  path ? (path.startsWith('file://') ? path : `file://${path}`) : undefined;

async function copyLink(ctx: ShareContext): Promise<void> {
  Clipboard.setString(ctx.url);
  ctx.onCopied();
}

async function whatsapp(ctx: ShareContext): Promise<void> {
  const img = toFileUri(await ctx.getCardImage());
  await RNShare.shareSingle({
    social: Social.Whatsapp,
    url: img ?? ctx.url,
    message: ctx.message,
    title: ctx.entity.name,
    type: img ? 'image/png' : undefined,
  });
}

async function viber(ctx: ShareContext): Promise<void> {
  const img = toFileUri(await ctx.getCardImage());
  await RNShare.shareSingle({
    social: Social.Viber,
    url: img ?? ctx.url,
    message: ctx.message,
    title: ctx.entity.name,
    type: img ? 'image/png' : undefined,
  });
}

async function telegram(ctx: ShareContext): Promise<void> {
  const img = toFileUri(await ctx.getCardImage());
  await RNShare.shareSingle({
    social: Social.Telegram,
    url: img ?? ctx.url,
    message: ctx.message,
    title: ctx.entity.name,
    type: img ? 'image/png' : undefined,
  });
}

async function facebook(ctx: ShareContext): Promise<void> {
  await RNShare.shareSingle({
    social: Social.Facebook,
    url: ctx.url,
    title: ctx.entity.name,
  });
}

async function messenger(ctx: ShareContext): Promise<void> {
  await RNShare.shareSingle({
    social: Social.Messenger,
    url: ctx.url,
    title: ctx.entity.name,
  });
}

async function linkedin(ctx: ShareContext): Promise<void> {
  await RNShare.shareSingle({
    social: Social.Linkedin,
    url: ctx.url,
    title: ctx.entity.name,
  });
}

async function twitter(ctx: ShareContext): Promise<void> {
  await RNShare.shareSingle({
    social: Social.Twitter,
    url: ctx.url,
    message: ctx.shortMessage,
    title: ctx.entity.name,
  });
}

async function instagramStories(ctx: ShareContext): Promise<void> {
  const appId = Config.FB_APP_ID;
  if (!appId) {
    ctx.onError('share.errors.fbAppIdMissing');
    return;
  }
  const img = toFileUri(await ctx.getCardImage());
  if (!img) {
    ctx.onError('share.errors.captureFailed');
    return;
  }
  await RNShare.shareSingle({
    social: Social.InstagramStories,
    appId,
    backgroundImage: img,
  });
}

async function facebookStories(ctx: ShareContext): Promise<void> {
  const appId = Config.FB_APP_ID;
  if (!appId) {
    ctx.onError('share.errors.fbAppIdMissing');
    return;
  }
  const img = toFileUri(await ctx.getCardImage());
  if (!img) {
    ctx.onError('share.errors.captureFailed');
    return;
  }
  await RNShare.shareSingle({
    social: Social.FacebookStories,
    appId,
    backgroundImage: img,
  });
}

async function snapchat(ctx: ShareContext): Promise<void> {
  const img = toFileUri(await ctx.getCardImage());
  if (!img) {
    ctx.onError('share.errors.captureFailed');
    return;
  }
  await RNShare.shareSingle({
    social: Social.Snapchat,
    url: img,
    type: 'image/png',
  });
}

async function sms(ctx: ShareContext): Promise<void> {
  await RNShare.shareSingle({
    social: Social.Sms,
    message: ctx.message,
  });
}

async function email(ctx: ShareContext): Promise<void> {
  await RNShare.shareSingle({
    social: Social.Email,
    subject: ctx.entity.name,
    message: ctx.message,
  });
}

async function moreOptions(ctx: ShareContext): Promise<void> {
  // Fallback to React Native's built-in share sheet.
  await RNCoreShare.share({
    title: ctx.entity.name,
    message: ctx.message,
    url: ctx.url,
  });
}

export const shareHandlers: Record<
  ShareTargetKey,
  (ctx: ShareContext) => Promise<void>
> = {
  copyLink,
  sms,
  whatsapp,
  viber,
  facebook,
  messenger,
  telegram,
  instagramStories,
  facebookStories,
  snapchat,
  twitter,
  linkedin,
  email,
  moreOptions,
};

/**
 * `react-native-share` rejects with error messages containing these tokens
 * when the user cancels or when the target app isn't installed. We treat
 * both as non-errors.
 */
const USER_CANCEL_TOKENS = [
  'USER_INTERRUPT',
  'User did not share',
  'CANCELLED',
  'cancelled',
];
const NOT_INSTALLED_TOKENS = [
  'not installed',
  'No Activity',
  'not available',
];

export function isUserCancelError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return USER_CANCEL_TOKENS.some(t => msg.includes(t));
}

export function isAppNotInstalledError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return NOT_INSTALLED_TOKENS.some(t => msg.toLowerCase().includes(t.toLowerCase()));
}
