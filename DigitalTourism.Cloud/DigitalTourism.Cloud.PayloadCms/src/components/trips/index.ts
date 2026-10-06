// Types
export type {
  TripSummary,
  TripDay,
  TripStop,
  DestinationItemData,
  TripStatus,
} from './types'

// Phase 1: Atomic Components
export { DayBadge } from './DayBadge'
export type { DayBadgeProps } from './DayBadge'

export { AddButton } from './AddButton'
export type { AddButtonProps } from './AddButton'

export { DayCounter } from './DayCounter'
export type { DayCounterProps } from './DayCounter'

export { DestinationItem } from './DestinationItem'
export type { DestinationItemProps } from './DestinationItem'

export { SortableDestinationItem } from './DestinationItem/SortableDestinationItem'

export { DestinationOptionsMenu } from './DestinationOptionsMenu'
export type { DestinationOptionsMenuProps } from './DestinationOptionsMenu'

// Phase 2: Composite Components
export { DestinationList } from './DestinationList'
export type { DestinationListProps } from './DestinationList'

export { CreateTripDialog } from './CreateTripDialog'
export type { CreateTripDialogProps } from './CreateTripDialog'

export { TripCard } from './TripCard'
export type { TripCardProps } from './TripCard'

export { TripCardGrid } from './TripCardGrid'
export type { TripCardGridProps } from './TripCardGrid'

export { TripListHeader } from './TripListHeader'
export type { TripListHeaderProps } from './TripListHeader'

export { TripEmptyState } from './TripEmptyState'
export type { TripEmptyStateProps } from './TripEmptyState'

export { AddDestinationDialog } from './AddDestinationDialog'
export type { AddDestinationDialogProps } from './AddDestinationDialog'

// Phase 3: Planner Components
export { TripPlannerHeader } from './TripPlannerHeader'
export type { TripPlannerHeaderProps } from './TripPlannerHeader'

export { DaySection } from './DaySection'
export type { DaySectionProps } from './DaySection'

export { DaySidebar } from './DaySidebar'
export type { DaySidebarProps } from './DaySidebar'

export { MoveToDayDialog } from './MoveToDayDialog'
export type { MoveToDayDialogProps } from './MoveToDayDialog'
