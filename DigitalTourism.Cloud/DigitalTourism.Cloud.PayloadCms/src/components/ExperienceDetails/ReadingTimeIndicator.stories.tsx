import type { Meta, StoryObj } from '@storybook/react'
import { ReadingTimeIndicator } from './ReadingTimeIndicator'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

function createMockRichText(wordCount: number): DefaultTypedEditorState {
  const words = Array.from({ length: wordCount }, (_, i) => `дума${i}`).join(' ')
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: words, version: 1 }],
          version: 1,
        },
      ],
      direction: null,
      format: '' as any,
      indent: 0,
      version: 1,
    },
  } as unknown as DefaultTypedEditorState
}

const meta = {
  title: 'ExperienceDetails/ReadingTimeIndicator',
  component: ReadingTimeIndicator,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ReadingTimeIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const ShortArticle: Story = {
  args: {
    richTextData: createMockRichText(100),
  },
}

export const MediumArticle: Story = {
  args: {
    richTextData: createMockRichText(600),
  },
}

export const LongArticle: Story = {
  args: {
    richTextData: createMockRichText(2000),
  },
}

export const CustomLabel: Story = {
  args: {
    richTextData: createMockRichText(400),
    label: 'Reading time',
  },
}
