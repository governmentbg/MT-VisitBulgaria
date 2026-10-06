import React from 'react';
import {Linking, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {Box, Text, Image} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';
import {resolveMediaUrl} from '../../services/api/transforms/payloadHelpers';
import {
  LEXICAL_FORMAT,
  LexicalAlign,
  LexicalBlockLevelNode,
  LexicalBlockNode,
  LexicalHeadingNode,
  LexicalInlineNode,
  LexicalLinkFields,
  LexicalLinkNode,
  LexicalListItemNode,
  LexicalListNode,
  LexicalParagraphNode,
  LexicalQuoteNode,
  LexicalRoot,
  LexicalTextNode,
  LexicalTextFormat,
  hasFormat,
  isNonEmptyLexical,
  BannerBlockFields,
  CodeBlockFields,
  MediaBlockFields,
  MediaUploadValue,
  LearnMoreBlockFields,
} from '../../services/api/types/lexical';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface CmsRendererProps {
  value: LexicalRoot | null | undefined;
}

export function CmsRenderer({value}: CmsRendererProps): React.ReactElement | null {
  if (!isNonEmptyLexical(value)) return null;
  return <>{value.root.children.map((node, i) => renderBlock(node, i))}</>;
}

export type CmsBlockRenderer<F = Record<string, unknown>> = React.FC<{
  fields: F & {blockType: string; blockName?: string; id?: string};
}>;

const blockRegistry: Record<string, CmsBlockRenderer<any>> = {};

export function registerCmsBlock<F>(slug: string, renderer: CmsBlockRenderer<F>): void {
  blockRegistry[slug] = renderer as CmsBlockRenderer<any>;
}

// ---------------------------------------------------------------------------
// Block-level rendering
// ---------------------------------------------------------------------------

function renderBlock(node: LexicalBlockLevelNode, key: React.Key): React.ReactNode {
  switch (node.type) {
    case 'paragraph':
      return <ParagraphBlock key={key} node={node} />;
    case 'heading':
      return <HeadingBlock key={key} node={node} />;
    case 'list':
      return <ListBlock key={key} node={node} />;
    case 'quote':
      return <QuoteBlock key={key} node={node} />;
    case 'horizontalrule':
      return <View key={key} style={styles.hr} />;
    case 'block':
      return <BlockDispatch key={key} node={node} />;
    default:
      return null;
  }
}

function ParagraphBlock({node}: {node: LexicalParagraphNode}) {
  if (!node.children?.length) return <Box height={moderateScale(8)} />;
  return (
    <Text style={[styles.body, alignStyle(node.format)]}>
      {renderInlineChildren(node.children)}
    </Text>
  );
}

function HeadingBlock({node}: {node: LexicalHeadingNode}) {
  const headingStyle = headingStyleFor(node.tag);
  return (
    <Text
      accessibilityRole="header"
      fontFamily={fonts.bold}
      style={[headingStyle, alignStyle(node.format)]}>
      {renderInlineChildren(node.children)}
    </Text>
  );
}

function ListBlock({node}: {node: LexicalListNode}) {
  const isOrdered = node.listType === 'number';
  const start = typeof node.start === 'number' && node.start > 0 ? node.start : 1;
  return (
    <Box marginVertical="xs" gap="xs">
      {node.children?.map((item, idx) => (
        <ListItemRow
          key={idx}
          item={item}
          marker={
            isOrdered ? `${typeof item.value === 'number' ? item.value : start + idx}.` : '•'
          }
        />
      ))}
    </Box>
  );
}

function ListItemRow({item, marker}: {item: LexicalListItemNode; marker: string}) {
  return (
    <Box flexDirection="row" paddingLeft="s" gap="s">
      <Text style={styles.listMarker}>{marker}</Text>
      <Text style={[styles.body, styles.listItemText]}>
        {renderInlineChildren(item.children)}
      </Text>
    </Box>
  );
}

function QuoteBlock({node}: {node: LexicalQuoteNode}) {
  return (
    <View style={styles.quote}>
      <Text style={[styles.body, styles.quoteText, alignStyle(node.format)]}>
        {renderInlineChildren(node.children)}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Inline rendering
// ---------------------------------------------------------------------------

function renderInlineChildren(
  children: LexicalInlineNode[] | undefined,
): React.ReactNode {
  if (!children?.length) return null;
  return children.map((child, i) => renderInline(child, i));
}

function renderInline(node: LexicalInlineNode, key: React.Key): React.ReactNode {
  if (node.type === 'text') return renderTextNode(node, key);
  if (node.type === 'link') return renderLinkNode(node, key);
  return null;
}

function renderTextNode(node: LexicalTextNode, key: React.Key): React.ReactNode {
  if (!node.text) return null;
  const style = formatToTextStyle(node.format);
  if (!style) return <React.Fragment key={key}>{node.text}</React.Fragment>;
  return (
    <Text key={key} style={style}>
      {node.text}
    </Text>
  );
}

function renderLinkNode(node: LexicalLinkNode, key: React.Key): React.ReactNode {
  return (
    <Text
      key={key}
      style={styles.link}
      onPress={() => handleLinkPress(node.fields)}>
      {renderInlineChildren(node.children)}
    </Text>
  );
}

function formatToTextStyle(format: LexicalTextFormat | undefined): TextStyle | null {
  if (!format) return null;
  const style: TextStyle = {};
  if (hasFormat(format, LEXICAL_FORMAT.BOLD)) style.fontFamily = fonts.bold;
  if (hasFormat(format, LEXICAL_FORMAT.ITALIC)) style.fontStyle = 'italic';

  const decorations: string[] = [];
  if (hasFormat(format, LEXICAL_FORMAT.UNDERLINE)) decorations.push('underline');
  if (hasFormat(format, LEXICAL_FORMAT.STRIKETHROUGH)) decorations.push('line-through');
  if (decorations.length) {
    style.textDecorationLine = decorations.join(' ') as TextStyle['textDecorationLine'];
  }
  return Object.keys(style).length ? style : null;
}

function alignStyle(format: LexicalAlign | undefined): TextStyle | undefined {
  if (!format) return undefined;
  if (format === 'left' || format === 'center' || format === 'right' || format === 'justify') {
    return {textAlign: format};
  }
  return undefined;
}

function headingStyleFor(tag: LexicalHeadingNode['tag']): TextStyle {
  switch (tag) {
    case 'h1':
      return styles.h1;
    case 'h2':
      return styles.h2;
    case 'h3':
      return styles.h3;
    case 'h4':
    case 'h5':
    case 'h6':
    default:
      return styles.h4;
  }
}

// ---------------------------------------------------------------------------
// Link handling
// ---------------------------------------------------------------------------

const ALLOWED_LINK_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:'];

async function handleLinkPress(fields: LexicalLinkFields): Promise<void> {
  if (!fields) return;
  if (fields.linkType === 'internal') {
    if (__DEV__) {
      console.warn('[CmsRenderer] internal link navigation not implemented', fields.doc);
    }
    return;
  }
  const url = fields.url;
  if (!url) return;
  const normalized = url.trim();
  const scheme = normalized.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)?.[0]?.toLowerCase();
  if (!scheme || !ALLOWED_LINK_SCHEMES.includes(scheme)) {
    if (__DEV__) {
      console.warn('[CmsRenderer] blocked link with disallowed scheme', normalized);
    }
    return;
  }
  try {
    const can = await Linking.canOpenURL(normalized);
    if (can) await Linking.openURL(normalized);
  } catch (err) {
    if (__DEV__) {
      console.warn('[CmsRenderer] failed to open link', normalized, err);
    }
  }
}

// ---------------------------------------------------------------------------
// Block dispatch + custom blocks
// ---------------------------------------------------------------------------

function BlockDispatch({node}: {node: LexicalBlockNode}) {
  const blockType = node.fields?.blockType;
  if (!blockType) return null;
  const Renderer = blockRegistry[blockType];
  if (!Renderer) {
    if (__DEV__) {
      console.warn('[CmsRenderer] unsupported blockType', blockType);
    }
    return null;
  }
  return <Renderer fields={node.fields} />;
}

// --- Banner ---------------------------------------------------------------

const BANNER_STYLE_COLORS: Record<
  NonNullable<BannerBlockFields['style']>,
  {bg: string; accent: string}
> = {
  info: {bg: palette.infoBg, accent: palette.infoAccent},
  warning: {bg: palette.warningBg, accent: palette.warningAccent},
  success: {bg: palette.successBg, accent: palette.successAccent},
  error: {bg: palette.errorBg, accent: palette.errorAccent},
};

function BannerBlock({fields}: {fields: BannerBlockFields}) {
  const style = fields.style && BANNER_STYLE_COLORS[fields.style] ? fields.style : 'info';
  const colors = BANNER_STYLE_COLORS[style];
  return (
    <View
      style={[
        styles.banner,
        {backgroundColor: colors.bg, borderLeftColor: colors.accent},
      ]}>
      {fields.blockName ? (
        <Text style={styles.bannerCaption}>{fields.blockName}</Text>
      ) : null}
      <CmsRenderer value={fields.content ?? null} />
    </View>
  );
}

// --- Code -----------------------------------------------------------------

function CodeBlock({fields}: {fields: CodeBlockFields}) {
  if (!fields.code) return null;
  return (
    <View style={styles.code}>
      {fields.language ? (
        <Text style={styles.codeLang}>{fields.language.toUpperCase()}</Text>
      ) : null}
      <Text style={styles.codeBody}>{fields.code}</Text>
    </View>
  );
}

// --- Media ----------------------------------------------------------------

function MediaBlock({fields}: {fields: MediaBlockFields}) {
  const altText = fields.altText || getMediaAlt(fields.media) || '';
  const captions = fields.captions?.filter(c => !!c?.text) ?? [];

  let mediaNode: React.ReactNode = null;

  if (fields.mediaType === 'video') {
    const videoUrl = getVideoUrl(fields);
    const poster = getMediaPreview(fields.media);
    mediaNode = (
      <Text
        style={styles.mediaVideoFallback}
        onPress={() => (videoUrl ? Linking.openURL(videoUrl) : undefined)}
        accessibilityLabel={altText || 'Play video'}>
        {poster ? '▶ ' : ''}
        {altText || videoUrl || 'Video'}
      </Text>
    );
  } else {
    const {uri, aspectRatio} = getImageUriAndRatio(fields.media);
    if (uri) {
      mediaNode = (
        <Image
          source={{uri}}
          style={[styles.mediaImage, aspectRatio ? {aspectRatio} : null]}
          accessibilityLabel={altText}
        />
      );
    }
  }

  if (!mediaNode && !captions.length && !isNonEmptyLexical(fields.blockCaption)) {
    return null;
  }

  return (
    <Box marginVertical="m" gap="s">
      {mediaNode}
      {captions.length > 0 ? (
        <Box gap="xs">
          {captions.map((c, i) => (
            <Text key={i} style={styles.mediaCaption}>
              {c.text}
            </Text>
          ))}
        </Box>
      ) : null}
      {isNonEmptyLexical(fields.blockCaption) ? (
        <CmsRenderer value={fields.blockCaption} />
      ) : null}
    </Box>
  );
}

function getMediaAlt(media: MediaBlockFields['media']): string | undefined {
  if (media && typeof media === 'object') return (media as MediaUploadValue).alt;
  return undefined;
}

function getMediaPreview(media: MediaBlockFields['media']): string | undefined {
  if (!media || typeof media !== 'object') return undefined;
  const m = media as MediaUploadValue;
  const url = m.sizes?.medium?.url || m.sizes?.small?.url || m.url;
  return url ? resolveMediaUrl(url) : undefined;
}

function getImageUriAndRatio(media: MediaBlockFields['media']): {
  uri: string | undefined;
  aspectRatio: number | undefined;
} {
  if (!media || typeof media !== 'object') {
    return {uri: undefined, aspectRatio: undefined};
  }
  const m = media as MediaUploadValue;
  const url = m.sizes?.medium?.url || m.sizes?.small?.url || m.url;
  const uri = url ? resolveMediaUrl(url) : undefined;
  const w =
    m.sizes?.medium?.width ??
    m.sizes?.small?.width ??
    m.width ??
    undefined;
  const h =
    m.sizes?.medium?.height ??
    m.sizes?.small?.height ??
    m.height ??
    undefined;
  const aspectRatio = w && h ? w / h : undefined;
  return {uri, aspectRatio};
}

function getVideoUrl(fields: MediaBlockFields): string | undefined {
  const src = fields.videoSource;
  if (!src) return undefined;
  if (src.sourceType === 'url') return src.videoUrl;
  if (src.sourceType === 'embed') return src.embedUrl;
  if (src.sourceType === 'file') {
    const file = src.videoFile;
    if (file && typeof file === 'object') {
      const url = (file as MediaUploadValue).url;
      return url ? resolveMediaUrl(url) : undefined;
    }
  }
  return undefined;
}

// --- LearnMore ------------------------------------------------------------

function LearnMoreBlock({fields}: {fields: LearnMoreBlockFields}) {
  const items = fields.items?.filter(Boolean) ?? [];
  if (!fields.heading && !fields.description && items.length === 0) return null;

  return (
    <Box marginVertical="m" gap="m">
      {fields.heading ? (
        <Text fontFamily={fonts.bold} style={styles.h2}>
          {fields.heading}
        </Text>
      ) : null}
      {fields.description ? (
        <Text style={styles.body}>{fields.description}</Text>
      ) : null}
      <Box gap="m">
        {items.map((item, i) => (
          <LearnMoreCard key={i} item={item} />
        ))}
      </Box>
    </Box>
  );
}

function LearnMoreCard({item}: {item: NonNullable<LearnMoreBlockFields['items']>[number]}) {
  const {uri} = getImageUriAndRatio(item.image as MediaBlockFields['media']);
  return (
    <Box flexDirection="row" gap="m" alignItems="flex-start">
      {uri ? (
        <Image
          source={{uri}}
          style={styles.learnMoreImage}
          accessibilityLabel={item.title || ''}
        />
      ) : null}
      <Box flex={1} gap="xs">
        {item.title ? (
          <Text fontFamily={fonts.bold} style={styles.h3}>
            {item.title}
          </Text>
        ) : null}
        {isNonEmptyLexical(item.body) ? <CmsRenderer value={item.body} /> : null}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Register default blocks
// ---------------------------------------------------------------------------

registerCmsBlock<BannerBlockFields>('banner', BannerBlock);
registerCmsBlock<CodeBlockFields>('code', CodeBlock);
registerCmsBlock<MediaBlockFields>('mediaBlock', MediaBlock);
registerCmsBlock<LearnMoreBlockFields>('learnMore', LearnMoreBlock);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  body: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.5),
    color: palette.black,
    marginBottom: moderateScale(8),
  },
  h1: {
    fontSize: moderateScale(22),
    lineHeight: moderateScale(22 * 1.3),
    color: palette.heading,
    marginTop: moderateScale(12),
    marginBottom: moderateScale(4),
  },
  h2: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(18 * 1.3),
    color: palette.heading,
    marginTop: moderateScale(10),
    marginBottom: moderateScale(4),
  },
  h3: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.3),
    color: palette.heading,
    marginTop: moderateScale(8),
    marginBottom: moderateScale(2),
  },
  h4: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(14 * 1.3),
    color: palette.heading,
    marginTop: moderateScale(6),
    marginBottom: moderateScale(2),
  },
  link: {
    color: palette.green700,
    textDecorationLine: 'underline',
  },
  hr: {
    height: 1,
    backgroundColor: palette.gray200,
    marginVertical: moderateScale(12),
  },
  listMarker: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(16 * 1.5),
    color: palette.black,
    minWidth: moderateScale(18),
  },
  listItemText: {
    flex: 1,
    marginBottom: 0,
  },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: palette.green500,
    paddingLeft: moderateScale(12),
    marginVertical: moderateScale(8),
  } as ViewStyle,
  quoteText: {
    fontStyle: 'italic',
    color: palette.gray800,
  },
  banner: {
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    borderLeftWidth: 4,
    marginVertical: moderateScale(12),
  } as ViewStyle,
  bannerCaption: {
    fontFamily: fonts.mediumItalic,
    fontSize: moderateScale(12),
    color: palette.gray600,
    marginBottom: moderateScale(6),
  },
  code: {
    backgroundColor: palette.gray100,
    borderRadius: moderateScale(4),
    padding: moderateScale(12),
    marginVertical: moderateScale(10),
  } as ViewStyle,
  codeLang: {
    fontSize: moderateScale(10),
    color: palette.gray600,
    marginBottom: moderateScale(4),
    letterSpacing: 0.6,
  },
  codeBody: {
    fontFamily: 'Courier',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(13 * 1.4),
    color: palette.gray900,
  },
  mediaImage: {
    width: '100%',
    borderRadius: moderateScale(8),
    backgroundColor: palette.gray100,
  },
  mediaVideoFallback: {
    fontSize: moderateScale(14),
    color: palette.green700,
    textDecorationLine: 'underline',
    paddingVertical: moderateScale(12),
  },
  mediaCaption: {
    fontSize: moderateScale(13),
    fontStyle: 'italic',
    color: palette.gray600,
  },
  learnMoreImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(6),
    backgroundColor: palette.gray100,
  },
});
