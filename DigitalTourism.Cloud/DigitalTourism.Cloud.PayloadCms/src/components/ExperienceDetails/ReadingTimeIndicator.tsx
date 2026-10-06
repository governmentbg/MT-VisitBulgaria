import React from 'react'
import { cn } from '@/components/ui'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export interface ReadingTimeIndicatorProps {
  richTextData?: DefaultTypedEditorState | null
  label?: string
  minutesLabel?: string
  className?: string
}

function extractTextFromNodes(nodes: any[]): string {
  let text = ''
  for (const node of nodes) {
    if (node.type === 'text' && typeof node.text === 'string') {
      text += node.text + ' '
    }
    if (node.children && Array.isArray(node.children)) {
      text += extractTextFromNodes(node.children)
    }
  }
  return text
}

function calculateReadingTime(data: DefaultTypedEditorState): number {
  const root = data?.root
  if (!root?.children) return 0
  const text = extractTextFromNodes(root.children)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

export const ReadingTimeIndicator: React.FC<ReadingTimeIndicatorProps> = ({
  richTextData,
  label = 'Време за четене',
  minutesLabel = 'мин.',
  className,
}) => {
  if (!richTextData) return null

  const minutes = calculateReadingTime(richTextData)

  return (
    <p className={cn('font-heading text-xl font-semibold leading-[1.2] text-black', className)}>
      {label}: {minutes} {minutesLabel}
    </p>
  )
}
