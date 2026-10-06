'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/components/ui/theme/cn'
import {
  DndContext,
  closestCorners,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui'
import { searchExperiences, getMyFavoriteDestinations } from '../actions'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import {
  TripPlannerHeader,
  DaySidebar,
  AddDestinationDialog,
  CreateTripDialog,
} from '@/components/trips'
import { useTripDnD } from './hooks/useTripDnD'
import { useTripAutoSave } from './hooks/useTripAutoSave'
import { useTripDestinations } from './hooks/useTripDestinations'
import { useTripEditing } from './hooks/useTripEditing'
import { useTripInit } from './hooks/useTripInit'

const Map = dynamic(() => import('./Map'), { ssr: false })

type Props = {
  trip: any
  onBackPath: string
  locale: string
}

export function TripPlanner({ trip, onBackPath, locale }: Props) {
  const t = useTranslations('tripPlanner')
  const router = useRouter()

  // Core state
  const [items, setItems] = useState<Record<string, string[]>>({})
  const [stopData, setStopData] = useState<Record<string, { experience: any; note?: string }>>({})

  // Add Destination Dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addDialogDay, setAddDialogDay] = useState(1)

  // Mobile sidebar & header
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [headerHidden, setHeaderHidden] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    if (!headerRef.current) return
    const ro = new ResizeObserver(([entry]) => setHeaderHeight(entry.contentRect.height))
    ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [])

  // Trip editing (duration, name, dates, orphan management)
  const editing = useTripEditing({
    tripId: trip.id,
    initialDuration: trip.duration,
    initialName: trip.name,
    initialStartDate: trip.startDate,
    items,
    setItems,
    markDirty: () => autoSave.markDirty(),
  })

  // DnD hook
  const { activeId, sensors, handleDragStart, handleDragOver, handleDragEnd } = useTripDnD({
    items,
    setItems,
    onChangesMade: () => autoSave.markDirty(),
  })

  // Auto-save hook
  const autoSave = useTripAutoSave({
    tripId: trip.id,
    items,
    stopData,
    duration: editing.duration,
    isDragging: activeId !== null,
  })

  // Initialize state from trip data
  useTripInit({ trip, setItems, setStopData })

  // Destinations: CRUD, favorites, derived data, PDF
  const dest = useTripDestinations({
    items,
    setItems,
    stopData,
    setStopData,
    duration: editing.duration,
    locale,
    tripId: trip.id,
    tripName: editing.tripName,
    tripStartDate: editing.tripStartDate,
    addDialogDay,
    markDirty: () => autoSave.markDirty(),
    setAddDialogOpen,
  })

  const loadFavorites = useCallback(
    () => getMyFavoriteDestinations(locale),
    [locale],
  )

  const handleAddDestination = useCallback((dayNumber: number) => {
    setAddDialogDay(dayNumber)
    setAddDialogOpen(true)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="trip-planner-root flex h-screen flex-col overflow-hidden bg-grey-25">
        <div
          ref={headerRef}
          className={cn(
            'z-30 shrink-0',
            'max-sm:absolute max-sm:inset-x-0 max-sm:top-0 max-sm:z-50 max-sm:transition-transform max-sm:duration-300',
            headerHidden && 'max-sm:-translate-y-full',
          )}
        >
          <TripPlannerHeader
            tripName={editing.tripName}
            dateRange={dest.dateRange}
            dayCount={editing.duration}
            onExit={() => router.push(onBackPath)}
            onEditName={() => editing.setEditDialogOpen(true)}
            onDayIncrement={() => editing.handleDayCountChange(1)}
            onDayDecrement={() => editing.handleDayCountChange(-1)}
            isSaving={autoSave.isSaving}
            onDownloadPdf={dest.handleDownloadPdf}
            isDownloadingPdf={dest.isDownloadingPdf}
            showingMap={!sidebarOpen}
            onToggleMap={() => setSidebarOpen((v) => !v)}
            className="trip-planner-header"
          />
        </div>

        <div className="relative flex flex-1 overflow-hidden">
          <div
            className={`shrink-0 transition-all duration-300 ${
              sidebarOpen ? 'max-sm:absolute max-sm:inset-0 max-sm:z-40' : 'max-sm:hidden'
            }`}
          >
            <DaySidebar
              days={dest.tripDays}
              dayCount={editing.duration}
              onDayCountChange={editing.handleDayCountChange}
              onAddDestination={handleAddDestination}
              onDeleteDestination={dest.handleDeleteDestination}
              onViewInfo={dest.handleViewInfo}
              onAddToFavorites={dest.handleToggleFavorite}
              isFavorite={dest.checkIsFavorite}
              onMoveToDay={dest.handleMoveToDay}
              tripStartDate={trip.startDate}
              onScrollDirection={(dir) => setHeaderHidden(dir === 'down')}
              mobileHeaderHeight={headerHeight}
              itemIds={items}
            />
          </div>

          <div className="flex-1 relative isolate">
            <Map
              markers={dest.visibleMarkers}
              isLiked={(m) => {
                const exp = stopData[m.id]?.experience
                if (!exp) return false
                return dest.checkIsFavorite({ id: exp.id, title: exp.title || '', type: exp.type })
              }}
              onToggleLike={(m) => {
                const exp = stopData[m.id]?.experience
                if (!exp) return
                dest.handleToggleFavorite({ id: exp.id, title: exp.title || '', type: exp.type })
              }}
            />
          </div>
        </div>
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.4' } },
          }),
        }}
      >
        {activeId && stopData[activeId] ? (
          <div className="w-[300px] rounded-xl border bg-white p-3 shadow-xl">
            <span className="text-sm font-semibold">
              {stopData[activeId].experience?.title || 'Item'}
            </span>
          </div>
        ) : null}
      </DragOverlay>

      <CreateTripDialog
        open={editing.editDialogOpen}
        onOpenChange={editing.setEditDialogOpen}
        onSubmit={editing.handleEditTrip}
        isSubmitting={editing.isEditSubmitting}
        initialValues={editing.editDialogInitialValues}
      />

      <AddDestinationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        dayNumber={addDialogDay}
        onAdd={dest.handleAddToDay}
        locale={locale}
        loadFavorites={loadFavorites}
        searchAction={searchExperiences}
      />

      <Dialog open={editing.orphanDialogOpen} onOpenChange={editing.setOrphanDialogOpen}>
        <DialogContent>
          <DialogHeader style={{ marginBottom: '20px' }}>
            <DialogTitle>{t('orphansTitle')}</DialogTitle>
            <DialogDescription>{t('orphansDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={editing.cancelOrphans} icon={null}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={editing.confirmOrphans} icon={null}>
              {t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}
