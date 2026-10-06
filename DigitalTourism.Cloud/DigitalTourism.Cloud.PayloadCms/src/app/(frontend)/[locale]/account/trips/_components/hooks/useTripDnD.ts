'use client'

import { useState, useCallback, useRef } from 'react'
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

interface UseTripDnDOptions {
  items: Record<string, string[]>
  setItems: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  onChangesMade: () => void
}

export interface UseTripDnDReturn {
  activeId: string | null
  sensors: ReturnType<typeof useSensors>
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
}

export function useTripDnD({ items, setItems, onChangesMade }: UseTripDnDOptions): UseTripDnDReturn {
  const [activeId, setActiveId] = useState<string | null>(null)

  // Track items in a ref so findContainer always reads latest state
  const itemsRef = useRef(items)
  itemsRef.current = items

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const findContainer = useCallback((id: string) => {
    const current = itemsRef.current
    if (id in current) return id
    return Object.keys(current).find((key) => current[key].includes(id))
  }, [])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeContainer = findContainer(active.id as string)
    const overContainer = findContainer(over.id as string)
    if (!activeContainer || !overContainer || activeContainer === overContainer) return

    setItems((prev) => {
      const activeItems = prev[activeContainer]
      const overItems = prev[overContainer]
      if (!activeItems || !overItems) return prev
      const activeIndex = activeItems.indexOf(active.id as string)
      const overIndex = overItems.indexOf(over.id as string)

      // Item already moved — avoid redundant state update
      if (activeIndex === -1) return prev

      let newIndex
      if (over.id in prev) {
        newIndex = overItems.length
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1
        const modifier = isBelowLastItem ? 1 : 0
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length
      }

      return {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item !== active.id),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex),
        ],
      }
    })
    onChangesMade()
  }, [findContainer, setItems, onChangesMade])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    const activeContainer = findContainer(active.id as string)
    const overContainer = over ? findContainer(over.id as string) : null

    if (activeContainer && overContainer && activeContainer === overContainer && over) {
      setItems((prev) => {
        const activeIndex = prev[activeContainer].indexOf(active.id as string)
        const overIndex = prev[overContainer].indexOf(over.id as string)
        if (activeIndex !== overIndex) {
          onChangesMade()
          return {
            ...prev,
            [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
          }
        }
        return prev
      })
    }
    setActiveId(null)
  }, [findContainer, setItems, onChangesMade])

  return { activeId, sensors, handleDragStart, handleDragOver, handleDragEnd }
}
