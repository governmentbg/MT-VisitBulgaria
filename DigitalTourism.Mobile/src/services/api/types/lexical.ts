/**
 * Payload CMS Lexical rich-text AST types.
 *
 * Narrow discriminated union for the node subset that can appear in
 * Experiences (hotel/activity/attraction/event/restaurant) rich-text fields
 * based on the editor config in
 * DigitalTourism.Cloud/DigitalTourism.Cloud.PayloadCms/src/collections/Experiences/createExperienceCollection.ts.
 */

export type LexicalTextFormat = number;

export type LexicalAlign = 'left' | 'center' | 'right' | 'justify' | '' | null;

export interface LexicalTextNode {
  type: 'text';
  text: string;
  format: LexicalTextFormat;
  style?: string;
  mode?: string;
  detail?: number;
  version?: number;
}

export interface LexicalLinkDocValue {
  id: string | number;
  slug?: string;
  title?: string;
}

export interface LexicalLinkFields {
  linkType?: 'custom' | 'internal';
  url?: string;
  newTab?: boolean;
  doc?: {
    relationTo: string;
    value: string | number | LexicalLinkDocValue;
  } | null;
}

export interface LexicalLinkNode {
  type: 'link';
  fields: LexicalLinkFields;
  children: LexicalInlineNode[];
  format?: LexicalAlign;
  indent?: number;
  version?: number;
}

export type LexicalInlineNode = LexicalTextNode | LexicalLinkNode;

export interface LexicalParagraphNode {
  type: 'paragraph';
  format?: LexicalAlign;
  children: LexicalInlineNode[];
  indent?: number;
  version?: number;
  textFormat?: number;
  textStyle?: string;
}

export interface LexicalHeadingNode {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  format?: LexicalAlign;
  children: LexicalInlineNode[];
  indent?: number;
  version?: number;
}

export interface LexicalListItemNode {
  type: 'listitem';
  children: LexicalInlineNode[];
  value?: number;
  checked?: boolean;
  format?: LexicalAlign;
  indent?: number;
  version?: number;
}

export interface LexicalListNode {
  type: 'list';
  listType: 'bullet' | 'number' | 'check';
  tag?: 'ul' | 'ol';
  start?: number;
  children: LexicalListItemNode[];
  format?: LexicalAlign;
  indent?: number;
  version?: number;
}

export interface LexicalQuoteNode {
  type: 'quote';
  format?: LexicalAlign;
  children: LexicalInlineNode[];
  indent?: number;
  version?: number;
}

export interface LexicalHorizontalRuleNode {
  type: 'horizontalrule';
  version?: number;
}

export interface LexicalBlockFieldsBase {
  blockType: string;
  blockName?: string;
  id?: string;
}

export interface LexicalBlockNode<F extends LexicalBlockFieldsBase = LexicalBlockFieldsBase> {
  type: 'block';
  fields: F;
  format?: string;
  version?: number;
}

export type LexicalBlockLevelNode =
  | LexicalParagraphNode
  | LexicalHeadingNode
  | LexicalListNode
  | LexicalQuoteNode
  | LexicalHorizontalRuleNode
  | LexicalBlockNode;

export interface LexicalRootNode {
  type: 'root';
  children: LexicalBlockLevelNode[];
  format?: LexicalAlign;
  indent?: number;
  version?: number;
  direction?: string | null;
}

export interface LexicalRoot {
  root: LexicalRootNode;
}

// ---------------------------------------------------------------------------
// Custom block field shapes (Payload block configs)
// ---------------------------------------------------------------------------

export interface BannerBlockFields extends LexicalBlockFieldsBase {
  blockType: 'banner';
  style?: 'info' | 'warning' | 'error' | 'success';
  content?: LexicalRoot | null;
}

export interface CodeBlockFields extends LexicalBlockFieldsBase {
  blockType: 'code';
  language?: string;
  code?: string;
}

export interface MediaUploadValue {
  id?: string | number;
  url?: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  sizes?: Record<string, {url?: string; width?: number; height?: number} | undefined>;
}

export interface MediaBlockFields extends LexicalBlockFieldsBase {
  blockType: 'mediaBlock';
  mediaType?: 'image' | 'video';
  media?: MediaUploadValue | string | number | null;
  videoSource?: {
    sourceType?: 'file' | 'url' | 'embed';
    videoFile?: MediaUploadValue | string | number | null;
    videoUrl?: string;
    embedUrl?: string;
  };
  captions?: Array<{text?: string; styling?: string}>;
  altText?: string;
  layout?: string;
  background?: string;
  blockCaption?: LexicalRoot | null;
}

export interface LearnMoreBlockItem {
  title?: string;
  body?: LexicalRoot | null;
  image?: MediaUploadValue | string | number | null;
}

export interface LearnMoreBlockFields extends LexicalBlockFieldsBase {
  blockType: 'learnMore';
  heading?: string;
  description?: string;
  items?: LearnMoreBlockItem[];
}

// ---------------------------------------------------------------------------
// Lexical text format bitmask (subset of what Payload enables for mobile data)
// ---------------------------------------------------------------------------

export const LEXICAL_FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4, // (not enabled in experiences, but kept for completeness)
  UNDERLINE: 8,
  CODE: 16, // (not enabled)
  SUBSCRIPT: 32, // (not enabled)
  SUPERSCRIPT: 64, // (not enabled)
} as const;

export function hasFormat(format: LexicalTextFormat | undefined, mask: number): boolean {
  if (!format) return false;
  // eslint-disable-next-line no-bitwise
  return (format & mask) !== 0;
}

export function isLexicalRoot(value: unknown): value is LexicalRoot {
  if (!value || typeof value !== 'object') return false;
  const root = (value as {root?: unknown}).root;
  if (!root || typeof root !== 'object') return false;
  const children = (root as {children?: unknown}).children;
  return Array.isArray(children);
}

export function isNonEmptyLexical(value: LexicalRoot | null | undefined): value is LexicalRoot {
  return !!value?.root?.children?.length;
}

/**
 * Wrap a plain string into a minimal single-paragraph Lexical root.
 * Useful when legacy sources (Typesense, search snippets) produce plain text
 * but the consumer expects a LexicalRoot.
 */
export function plainTextToLexicalRoot(text: string | null | undefined): LexicalRoot | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{type: 'text', text: trimmed, format: 0}],
        },
      ],
    },
  };
}
