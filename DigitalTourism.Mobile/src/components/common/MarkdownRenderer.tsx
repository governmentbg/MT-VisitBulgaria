import React, {useMemo} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {Box, Text} from '../../design';
import {fonts} from '../../theme/fonts';
import {moderateScale} from '../../theme/scaling';
import {palette} from '../../theme/palette';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Lightweight Markdown renderer for React Native.
 * Supports: headings (#-###), bold (**), bullet/numbered lists, links, paragraphs.
 * No external dependencies — simple line-by-line parser.
 */
export function MarkdownRenderer({content}: MarkdownRendererProps) {
  const elements = useMemo(() => parseMarkdown(content), [content]);

  return (
    <Box gap="s">
      {elements.map(el => renderElement(el))}
    </Box>
  );
}

// --- Parser ---

type MdElement =
  | {id: string; type: 'h1'; text: string}
  | {id: string; type: 'h2'; text: string}
  | {id: string; type: 'h3'; text: string}
  | {id: string; type: 'paragraph'; text: string}
  | {id: string; type: 'bullet'; text: string}
  | {id: string; type: 'numbered'; text: string; num: string}
  | {id: string; type: 'spacer'};

function parseMarkdown(md: string): MdElement[] {
  const lines = md.split('\n');
  const elements: MdElement[] = [];
  let prevEmpty = false;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const trimmed = lines[lineIdx].trim();

    if (trimmed === '') {
      if (!prevEmpty) elements.push({id: `spacer-${lineIdx}`, type: 'spacer'});
      prevEmpty = true;
      continue;
    }
    prevEmpty = false;

    if (trimmed.startsWith('### ')) {
      elements.push({id: `h3-${lineIdx}`, type: 'h3', text: trimmed.slice(4)});
    } else if (trimmed.startsWith('## ')) {
      elements.push({id: `h2-${lineIdx}`, type: 'h2', text: trimmed.slice(3)});
    } else if (trimmed.startsWith('# ')) {
      elements.push({id: `h1-${lineIdx}`, type: 'h1', text: trimmed.slice(2)});
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push({id: `bullet-${lineIdx}`, type: 'bullet', text: trimmed.slice(2)});
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        elements.push({id: `numbered-${lineIdx}`, type: 'numbered', num: match[1], text: match[2]});
      }
    } else {
      elements.push({id: `paragraph-${lineIdx}`, type: 'paragraph', text: trimmed});
    }
  }

  return elements;
}

// --- Renderer ---

function renderElement(el: MdElement): React.ReactNode {
  switch (el.type) {
    case 'h1':
      return (
        <Text key={el.id} style={styles.h1} fontFamily={fonts.bold}>
          {renderInline(el.text)}
        </Text>
      );
    case 'h2':
      return (
        <Text key={el.id} style={styles.h2} fontFamily={fonts.bold}>
          {renderInline(el.text)}
        </Text>
      );
    case 'h3':
      return (
        <Text key={el.id} style={styles.h3} fontFamily={fonts.bold}>
          {renderInline(el.text)}
        </Text>
      );
    case 'bullet':
      return (
        <Box key={el.id} flexDirection="row" paddingLeft="m" gap="s">
          <Text style={styles.body}>•</Text>
          <Text style={[styles.body, styles.listItem]}>
            {renderInline(el.text)}
          </Text>
        </Box>
      );
    case 'numbered':
      return (
        <Box key={el.id} flexDirection="row" paddingLeft="m" gap="s">
          <Text style={styles.body}>{el.num}.</Text>
          <Text style={[styles.body, styles.listItem]}>
            {renderInline(el.text)}
          </Text>
        </Box>
      );
    case 'spacer':
      return <Box key={el.id} height={moderateScale(4)} />;
    case 'paragraph':
      return (
        <Text key={el.id} style={styles.body}>
          {renderInline(el.text)}
        </Text>
      );
  }
}

/**
 * Parse inline formatting: **bold**, [link](url)
 */
function renderInline(text: string): React.ReactNode {
  // Split by **bold** and [link](url) patterns
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for bold
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
    // Check for link
    const linkMatch = remaining.match(/^(.*?)\[(.+?)\]\((.+?)\)(.*)/s);

    if (boldMatch && (!linkMatch || boldMatch.index! <= linkMatch.index!)) {
      if (boldMatch[1]) parts.push(boldMatch[1]);
      parts.push(
        <Text key={`b${key++}`} style={styles.bold}>
          {boldMatch[2]}
        </Text>,
      );
      remaining = boldMatch[3];
    } else if (linkMatch) {
      if (linkMatch[1]) parts.push(linkMatch[1]);
      const url = linkMatch[3];
      parts.push(
        <Text
          key={`l${key++}`}
          style={styles.link}
          onPress={() => Linking.openURL(url)}>
          {linkMatch[2]}
        </Text>,
      );
      remaining = linkMatch[4];
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
}

const styles = StyleSheet.create({
  h1: {
    fontSize: moderateScale(22),
    lineHeight: moderateScale(22 * 1.3),
    color: palette.heading,
    marginTop: moderateScale(8),
  },
  h2: {
    fontSize: moderateScale(17),
    lineHeight: moderateScale(17 * 1.3),
    color: palette.heading,
    marginTop: moderateScale(6),
  },
  h3: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(15 * 1.3),
    color: palette.heading,
    marginTop: moderateScale(4),
  },
  body: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(13 * 1.6),
    color: palette.gray800,
    fontFamily: fonts.regular,
  },
  bold: {
    fontFamily: fonts.bold,
  },
  link: {
    color: palette.green700,
    textDecorationLine: 'underline',
  },
  listItem: {
    flex: 1,
  },
});
