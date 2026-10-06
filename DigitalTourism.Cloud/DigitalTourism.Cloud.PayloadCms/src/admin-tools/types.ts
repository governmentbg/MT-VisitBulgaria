import type { ComponentType } from 'react'

export interface AdminTool {
  id: string
  label: string
  description: string
  Component: ComponentType
  order: number
}
