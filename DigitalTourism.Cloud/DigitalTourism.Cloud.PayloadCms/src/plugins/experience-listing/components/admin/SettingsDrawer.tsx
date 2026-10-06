'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  useField,
  useLocale,
  SelectInput,
  CheckboxInput,
  ReactSelect,
  FieldLabel,
} from '@payloadcms/ui'

const _typeOptions = [
  { label: 'Hotel', value: 'hotel' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Activity', value: 'activity' },
  { label: 'Attraction', value: 'attraction' },
  { label: 'Event', value: 'event' },
]

const gridColumnOptions = [
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
]

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Title A-Z', value: 'title_asc' },
  { label: 'Title Z-A', value: 'title_desc' },
  { label: 'Newest First', value: 'newest' },
]

const paginationOptions = [
  { label: 'Page Numbers', value: 'pagination' },
  { label: 'Load More', value: 'loadMore' },
]

type RelValue = (number | { id: number })[]

const extractIds = (items: RelValue | undefined): number[] => {
  if (!items?.length) return []
  return items
    .map((item) => (typeof item === 'number' ? item : item?.id))
    .filter((id): id is number => typeof id === 'number')
}

 
type Option = { label: string; value: any }

// ─── Async Relationship Multi-Select (uses Payload's ReactSelect) ───

interface RelationshipSelectProps {
  baseClass: string
  label: string
  collection: string
  labelField: 'title' | 'name'
  value: RelValue | undefined
  setValue: (val: RelValue) => void
  locale: string
}

const resolveLabel = (doc: Record<string, unknown>, field: string): string => {
  const val = doc[field]
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val) {
    return (
      (val as Record<string, string>).en ||
      Object.values(val as Record<string, string>)[0] ||
      ''
    )
  }
  return `#${doc.id}`
}

const RelationshipSelect: React.FC<RelationshipSelectProps> = ({
  baseClass,
  label,
  collection,
  labelField,
  value,
  setValue,
  locale,
}) => {
  const [options, setOptions] = useState<Option[]>([])
  const [labelMap, setLabelMap] = useState<Map<number, string>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const labelMapRef = useRef<Map<number, string>>(new Map())

  const selectedIds = extractIds(value)

  // Fetch labels for selected IDs
  useEffect(() => {
    const uncached = selectedIds.filter((id) => !labelMapRef.current.has(id))
    if (!uncached.length) return

    let cancelled = false
    const fetchLabels = async () => {
      try {
        const res = await fetch(
          `/api/${collection}?where[id][in]=${uncached.join(',')}&limit=${uncached.length}&depth=0&locale=${locale}`,
        )
        const data = await res.json()
        if (!cancelled && data.docs) {
          const next = new Map(labelMapRef.current)
          data.docs.forEach((doc: Record<string, unknown>) => {
            next.set(doc.id as number, resolveLabel(doc, labelField))
          })
          labelMapRef.current = next
          setLabelMap(next)
        }
      } catch {
        // Silently fail
      }
    }
    fetchLabels()
    return () => {
      cancelled = true
    }
     
  }, [value, collection, labelField, locale])

  // Fetch options on search
  const handleInputChange = useCallback(
    (searchVal: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const params = new URLSearchParams({ limit: '50', depth: '0', locale })
          if (searchVal.trim()) {
            params.set(`where[${labelField}][contains]`, searchVal.trim())
          }
          const res = await fetch(`/api/${collection}?${params}`)
          const data = await res.json()
          if (data.docs) {
            setOptions(
              data.docs.map((doc: Record<string, unknown>) => ({
                label: resolveLabel(doc, labelField),
                value: doc.id as number,
              })),
            )
          }
        } catch {
          // Silently fail
        } finally {
          setIsLoading(false)
        }
      }, 300)
    },
    [collection, labelField, locale],
  )

  // Fetch default options on mount
  useEffect(() => {
    handleInputChange('')
  }, [handleInputChange])

  const currentValue: Option[] = selectedIds.map((id) => ({
    label: labelMap.get(id) || `#${id}`,
    value: id,
  }))

  return (
    <div className={`${baseClass}__field`}>
      <FieldLabel label={label} />
      <ReactSelect
        options={options}
        value={currentValue}
        onChange={(newVal) => {
          const opts = (Array.isArray(newVal) ? newVal : newVal ? [newVal] : []) as Option[]
          const ids = opts.map((o) => o.value as number)
          setValue(ids)
          const next = new Map(labelMapRef.current)
          opts.forEach((o) => next.set(o.value as number, o.label))
          labelMapRef.current = next
          setLabelMap(next)
        }}
        isMulti={true}
        isSearchable={true}
        isClearable={true}
        isLoading={isLoading}
        onInputChange={handleInputChange}
      />
    </div>
  )
}

// ─── Settings Panel (inline, no Drawer) ───

interface SettingsPanelProps {
  parentPath: string
  baseClass: string
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ parentPath, baseClass }) => {
  const locale = useLocale()
  const localeCode = typeof locale === 'object' ? locale.code : locale
  const fp = (name: string) => (parentPath ? `${parentPath}.${name}` : name)

  // Read display mode to conditionally show grid-only settings
  const { value: displayMode } = useField<string>({ path: fp('displayMode') })
  const isGridMode = displayMode === 'grid' || !displayMode

  // ─── Field hooks ───
  const { value: defaultCategories, setValue: setDefaultCategories } = useField<RelValue>({
    path: fp('defaultCategories'),
  })
  const { value: defaultTags, setValue: setDefaultTags } = useField<RelValue>({
    path: fp('defaultTags'),
  })
  const { value: defaultRegion, setValue: setDefaultRegion } = useField<RelValue>({
    path: fp('defaultRegion'),
  })
  const { value: defaultMunicipality, setValue: setDefaultMunicipality } = useField<RelValue>({
    path: fp('defaultMunicipality'),
  })
  const { value: defaultCity, setValue: setDefaultCity } = useField<RelValue>({
    path: fp('defaultCity'),
  })
  const { value: itemsPerPage, setValue: setItemsPerPage } = useField<number>({
    path: fp('itemsPerPage'),
  })
  const { value: gridColumns, setValue: setGridColumns } = useField<string>({
    path: fp('gridColumns'),
  })
  const { value: defaultSort, setValue: setDefaultSort } = useField<string>({
    path: fp('defaultSort'),
  })
  const { value: paginationMode, setValue: setPaginationMode } = useField<string>({
    path: fp('paginationMode'),
  })

  // Features
  const { value: showAdvancedSearch, setValue: setShowAdvancedSearch } = useField<boolean>({
    path: fp('showAdvancedSearch'),
  })
  const { value: showSearchInput, setValue: setShowSearchInput } = useField<boolean>({
    path: fp('showSearchInput'),
  })

  return (
    <div className={`${baseClass}__settings`}>
      {/* ─── Row 1: Default Filters ─── */}
      <div className={`${baseClass}__row ${baseClass}__row--filters`}>
        <RelationshipSelect
          baseClass={baseClass}
          label="Categories"
          collection="categories"
          labelField="title"
          value={defaultCategories}
          setValue={setDefaultCategories}
          locale={localeCode || 'en'}
        />
        <RelationshipSelect
          baseClass={baseClass}
          label="Tags"
          collection="tags"
          labelField="title"
          value={defaultTags}
          setValue={setDefaultTags}
          locale={localeCode || 'en'}
        />
        <RelationshipSelect
          baseClass={baseClass}
          label="Regions"
          collection="regions"
          labelField="name"
          value={defaultRegion}
          setValue={setDefaultRegion}
          locale={localeCode || 'en'}
        />
        <RelationshipSelect
          baseClass={baseClass}
          label="Municipalities"
          collection="municipalities"
          labelField="name"
          value={defaultMunicipality}
          setValue={setDefaultMunicipality}
          locale={localeCode || 'en'}
        />
        <RelationshipSelect
          baseClass={baseClass}
          label="Cities"
          collection="cities"
          labelField="name"
          value={defaultCity}
          setValue={setDefaultCity}
          locale={localeCode || 'en'}
        />
      </div>

      {/* ─── Row 2: Display Settings ─── */}
      <div className={`${baseClass}__row ${baseClass}__row--display`}>
        <div className={`${baseClass}__field`}>
          <SelectInput
            path={fp('itemsPerPage')}
            name="itemsPerPage"
            label="Items Per Page"
            value={String(itemsPerPage ?? 8)}
            options={[4, 8, 12, 16, 24, 32, 48].map((n) => ({
              label: String(n),
              value: String(n),
            }))}
            onChange={(option) => {
              const val = Array.isArray(option) ? option[0]?.value : option?.value
              setItemsPerPage(parseInt(val as string, 10) || 8)
            }}
          />
        </div>
        {isGridMode && (
          <>
            <div className={`${baseClass}__field`}>
              <SelectInput
                path={fp('gridColumns')}
                name="gridColumns"
                label="Grid Columns"
                value={gridColumns || '4'}
                options={gridColumnOptions}
                onChange={(option) => {
                  const val = Array.isArray(option) ? option[0]?.value : option?.value
                  setGridColumns((val as string) || '4')
                }}
              />
            </div>
            <div className={`${baseClass}__field`}>
              <SelectInput
                path={fp('defaultSort')}
                name="defaultSort"
                label="Default Sort"
                value={defaultSort || 'relevance'}
                options={sortOptions}
                onChange={(option) => {
                  const val = Array.isArray(option) ? option[0]?.value : option?.value
                  setDefaultSort((val as string) || 'relevance')
                }}
              />
            </div>
            <div className={`${baseClass}__field`}>
              <SelectInput
                path={fp('paginationMode')}
                name="paginationMode"
                label="Pagination"
                value={paginationMode || 'pagination'}
                options={paginationOptions}
                onChange={(option) => {
                  const val = Array.isArray(option) ? option[0]?.value : option?.value
                  setPaginationMode((val as string) || 'pagination')
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* ─── Row 3: Features (grid mode only) ─── */}
      {isGridMode && (
        <div className={`${baseClass}__row ${baseClass}__row--features`}>
          <CheckboxInput
            checked={showAdvancedSearch ?? false}
            onToggle={() => setShowAdvancedSearch(!(showAdvancedSearch ?? false))}
            label="Advanced Search Link"
            name="showAdvancedSearch"
          />
          <CheckboxInput
            checked={showSearchInput ?? false}
            onToggle={() => setShowSearchInput(!(showSearchInput ?? false))}
            label="Search Input"
            name="showSearchInput"
          />
        </div>
      )}
    </div>
  )
}

export default SettingsPanel
