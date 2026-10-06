'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TOOLKIT_ADMIN_PATH, TOOLKIT_TRIGGER } from '../ToolkitView/constants'

const TARGET = TOOLKIT_TRIGGER
const TIMEOUT_MS = 2000

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true
  if (target instanceof HTMLSelectElement) return true
  if (target.isContentEditable) return true
  if (target.getAttribute('role') === 'textbox') return true
  return false
}

export const KeyboardNav: React.FC = () => {
  const router = useRouter()
  const bufferRef = useRef('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return

      bufferRef.current += e.key.toLowerCase()

      // Cap buffer length to prevent unbounded growth
      if (bufferRef.current.length > TARGET.length) {
        bufferRef.current = bufferRef.current.slice(-TARGET.length)
      }

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        bufferRef.current = ''
      }, TIMEOUT_MS)

      if (bufferRef.current.includes(TARGET)) {
        bufferRef.current = ''
        if (timerRef.current) clearTimeout(timerRef.current)
        router.push(TOOLKIT_ADMIN_PATH)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [router])

  return null
}

export default KeyboardNav
