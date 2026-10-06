import type { AdminTool } from './types'

const tools: AdminTool[] = []

export function registerAdminTool(tool: AdminTool): void {
  tools.push(tool)
}

export function getAdminTools(): AdminTool[] {
  return [...tools].sort((a, b) => a.order - b.order)
}
