export default function TripsLoading() {
  return (
    <div className="min-h-screen bg-grey-25">
      <div className="container py-10">
        {/* Header skeleton */}
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-grey-100" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-grey-100" />
        </div>

        {/* Trip cards skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-grey-100 bg-white p-5">
              <div className="mb-3 h-5 w-3/4 rounded bg-grey-100" />
              <div className="mb-2 h-4 w-1/2 rounded bg-grey-100" />
              <div className="h-4 w-1/3 rounded bg-grey-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
