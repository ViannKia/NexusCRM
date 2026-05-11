import { Skeleton } from '@/components/ui/skeleton';

export default function ActivitiesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {[48, 32, 40, 36, 32].map((w, i) => (
          <Skeleton key={i} className={`h-9 w-${w === 48 ? '12' : w === 32 ? '16' : w === 40 ? '20' : w === 36 ? '24' : '16'} rounded-md`} />
        ))}
      </div>

      {/* Activity cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border bg-white p-4"
          >
            {/* Icon circle */}
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

            {/* Content */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3.5 w-12" />
              </div>
              <Skeleton className="h-3.5 w-52" />
              <Skeleton className="h-3 w-36" />
            </div>

            {/* Action button */}
            <Skeleton className="h-8 w-24 shrink-0 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
