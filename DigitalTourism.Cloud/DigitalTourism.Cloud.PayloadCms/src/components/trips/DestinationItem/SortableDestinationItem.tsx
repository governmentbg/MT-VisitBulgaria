'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DestinationItem, type DestinationItemProps } from './index'

interface SortableDestinationItemProps extends Omit<DestinationItemProps, 'className' | 'dragHandleRef' | 'dragHandleListeners'> {
  id: string
}

export const SortableDestinationItem: React.FC<SortableDestinationItemProps> = ({
  id,
  ...props
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="select-none">
      <DestinationItem
        {...props}
        dragHandleRef={setActivatorNodeRef}
        dragHandleListeners={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
