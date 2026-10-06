import type {IconName} from '../design/Icon';

/**
 * Data-driven config for the custom ShareSheet grid.
 *
 * Each target corresponds to a handler in `src/services/share/shareHandlers.ts`.
 * The UI renders these in declaration order (3 rows × 5 columns typical layout).
 *
 * Note on icons: Material Design Icons does not ship brand glyphs for Viber or
 * Telegram, so we fall back to neutral glyphs (`message`, `send`) while
 * keeping each brand's signature color on the circular background.
 */

export type ShareTargetKey =
  | 'copyLink'
  | 'sms'
  | 'whatsapp'
  | 'viber'
  | 'facebook'
  | 'messenger'
  | 'telegram'
  | 'instagramStories'
  | 'facebookStories'
  | 'snapchat'
  | 'twitter'
  | 'linkedin'
  | 'email'
  | 'moreOptions';

export interface ShareTarget {
  key: ShareTargetKey;
  icon: IconName;
  bg: string;
  iconColor: string;
  labelKey: string; // i18n key inside the `share` namespace, without the "share." prefix
  /** True if this target requires FB_APP_ID to function */
  requiresFbAppId?: boolean;
}

export const SHARE_TARGETS: ShareTarget[] = [
  {key: 'copyLink',         icon: 'link-variant',       bg: '#4B5563', iconColor: '#FFFFFF', labelKey: 'copyLink'},
  {key: 'sms',              icon: 'message-text',       bg: '#22C55E', iconColor: '#FFFFFF', labelKey: 'sms'},
  {key: 'whatsapp',         icon: 'whatsapp',           bg: '#25D366', iconColor: '#FFFFFF', labelKey: 'whatsapp'},
  {key: 'viber',            icon: 'message',            bg: '#7360F2', iconColor: '#FFFFFF', labelKey: 'viber'},
  {key: 'facebook',         icon: 'facebook',           bg: '#1877F2', iconColor: '#FFFFFF', labelKey: 'facebook'},
  {key: 'messenger',        icon: 'facebook-messenger', bg: '#0084FF', iconColor: '#FFFFFF', labelKey: 'messenger'},
  {key: 'telegram',         icon: 'send',               bg: '#0088CC', iconColor: '#FFFFFF', labelKey: 'telegram'},
  {key: 'instagramStories', icon: 'instagram',          bg: '#E4405F', iconColor: '#FFFFFF', labelKey: 'instagramStories', requiresFbAppId: true},
  {key: 'facebookStories',  icon: 'facebook',           bg: '#1877F2', iconColor: '#FFFFFF', labelKey: 'facebookStories',  requiresFbAppId: true},
  {key: 'snapchat',         icon: 'snapchat',           bg: '#FFFC00', iconColor: '#000000', labelKey: 'snapchat'},
  {key: 'twitter',          icon: 'twitter',            bg: '#000000', iconColor: '#FFFFFF', labelKey: 'twitter'},
  {key: 'linkedin',         icon: 'linkedin',           bg: '#0A66C2', iconColor: '#FFFFFF', labelKey: 'linkedin'},
  {key: 'email',            icon: 'email',              bg: '#EA4335', iconColor: '#FFFFFF', labelKey: 'email'},
  {key: 'moreOptions',      icon: 'dots-horizontal',    bg: '#6B7280', iconColor: '#FFFFFF', labelKey: 'moreOptions'},
];
