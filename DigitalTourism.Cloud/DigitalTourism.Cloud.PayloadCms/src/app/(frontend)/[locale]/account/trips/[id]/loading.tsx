export default function TripDetailLoading() {
  return (
    <div className="trip-planner-root flex h-screen flex-col overflow-hidden bg-grey-25">
      {/* Header skeleton */}
      <div className="z-30 shrink-0 border-b border-grey-100 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 animate-pulse rounded bg-grey-100" />
          <div className="h-6 w-48 animate-pulse rounded bg-grey-100" />
          <div className="ml-auto h-8 w-24 animate-pulse rounded-lg bg-grey-100" />
        </div>
      </div>

      {/* Body skeleton: sidebar + map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="w-[380px] shrink-0 overflow-y-auto border-r border-grey-100 bg-white p-4 max-sm:w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-6">
              <div className="mb-3 h-5 w-20 animate-pulse rounded bg-grey-100" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex animate-pulse items-center gap-3 rounded-xl border border-grey-100 p-3"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-grey-100" />
                    <div className="flex-1">
                      <div className="mb-1 h-4 w-3/4 rounded bg-grey-100" />
                      <div className="h-3 w-1/2 rounded bg-grey-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Map skeleton */}
        <div className="flex-1 animate-pulse bg-grey-50" />
      </div>
    </div>
  )
}
